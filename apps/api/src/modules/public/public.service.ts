import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { randomBytes } from 'crypto';

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: AvailabilityService,
    private readonly auditService: AuditService,
  ) {}

  async getPublishedServices() {
    return this.prisma.service.findMany({
      where: { isActive: true, isPublished: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        durationMinutes: true,
        priceMinor: true,
        currency: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async getServiceBySlug(slug: string) {
    const service = await this.prisma.service.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        durationMinutes: true,
        bufferBeforeMinutes: true,
        bufferAfterMinutes: true,
        priceMinor: true,
        currency: true,
        isActive: true,
        isPublished: true,
        practitioners: {
          select: {
            practitioner: {
              select: {
                id: true,
                displayName: true,
                bio: true,
                photoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!service || !service.isActive || !service.isPublished) {
      throw new NotFoundException({
        code: 'SERVICE_NOT_FOUND',
        message: 'Dịch vụ yêu cầu không tìm thấy hoặc chưa công bố.',
      });
    }

    return service;
  }

  async getPublishedPractitioners(serviceId?: string) {
    return this.prisma.practitioner.findMany({
      where: {
        isPublished: true,
        isBookable: true,
        ...(serviceId
          ? {
              services: {
                some: { serviceId },
              },
            }
          : {}),
      },
      select: {
        id: true,
        displayName: true,
        bio: true,
        photoUrl: true,
      },
      orderBy: { displayName: 'asc' },
    });
  }

  async getActiveLocations() {
    return this.prisma.location.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        phone: true,
        timezone: true,
      },
    });
  }

  async getAvailability(query: {
    serviceId: string;
    locationId?: string;
    practitionerId?: string;
    from: string;
    to: string;
  }) {
    return this.availabilityService.getAvailableSlots(query);
  }

  async createAppointment(dto: CreateAppointmentDto, requestId?: string) {
    if (!dto.consent) {
      throw new BadRequestException({
        code: 'CONSENT_REQUIRED',
        message: 'Bạn cần đồng ý với chính sách xử lý thông tin để đặt lịch.',
      });
    }

    const requestedStartsAt = new Date(dto.startsAt);
    if (isNaN(requestedStartsAt.getTime()) || requestedStartsAt <= new Date()) {
      throw new BadRequestException({
        code: 'INVALID_APPOINTMENT_TIME',
        message: 'Thời gian đặt lịch phải là thời điểm trong tương lai.',
      });
    }

    // Verify service
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId, isActive: true, isPublished: true },
      include: {
        practitioners: {
          include: { practitioner: true },
        },
      },
    });

    if (!service) {
      throw new BadRequestException({
        code: 'SERVICE_NOT_FOUND',
        message: 'Dịch vụ không tồn tại hoặc đã ngừng nhận lịch.',
      });
    }

    // Calculate endsAt
    const requestedEndsAt = new Date(
      requestedStartsAt.getTime() + service.durationMinutes * 60 * 1000,
    );

    // Verify or select location
    let location = null;
    if (dto.locationId) {
      location = await this.prisma.location.findUnique({
        where: { id: dto.locationId, isActive: true },
      });
    } else {
      location = await this.prisma.location.findFirst({
        where: { isActive: true },
      });
    }

    if (!location) {
      throw new BadRequestException({
        code: 'LOCATION_NOT_FOUND',
        message: 'Cơ sở khám không hợp lệ.',
      });
    }

    // Generate unguessable reference: e.g. WEL-4X8A9F-2K9B
    const randomCode = randomBytes(4).toString('hex').toUpperCase();
    const datePrefix = requestedStartsAt.toISOString().slice(2, 10).replace(/-/g, '');
    const reference = `WEL-${datePrefix}-${randomCode}`;

    // Execute atomic reservation in transaction
    const appointment = await this.prisma.$transaction(async (tx) => {
      // Determine practitioner
      let chosenPractitionerId = dto.practitionerId;

      if (!chosenPractitionerId) {
        // Find an available practitioner among those who provide this service
        const candidates = service.practitioners
          .map((ps) => ps.practitioner)
          .filter((p) => p.isBookable && p.isPublished);

        if (candidates.length === 0) {
          throw new ConflictException({
            code: 'NO_PRACTITIONER_AVAILABLE',
            message: 'Hiện không có bác sĩ khả dụng cho dịch vụ này vào khung giờ đã chọn.',
          });
        }

        // Try candidate practitioners with row lock
        for (const candidate of candidates) {
          // Lock practitioner row to serialize concurrent booking checks for this doctor
          await tx.$queryRaw`SELECT id FROM "practitioners" WHERE id = ${candidate.id} FOR UPDATE`;

          const conflict = await tx.appointment.findFirst({
            where: {
              practitionerId: candidate.id,
              status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
              startsAt: { lt: requestedEndsAt },
              endsAt: { gt: requestedStartsAt },
            },
          });

          if (!conflict) {
            chosenPractitionerId = candidate.id;
            break;
          }
        }

        if (!chosenPractitionerId) {
          throw new ConflictException({
            code: 'APPOINTMENT_SLOT_UNAVAILABLE',
            message: 'Khung giờ này vừa có người đặt. Vui lòng chọn giờ khác.',
          });
        }
      } else {
        // Specific practitioner requested: acquire exclusive row lock on practitioner
        await tx.$queryRaw`SELECT id FROM "practitioners" WHERE id = ${chosenPractitionerId} FOR UPDATE`;

        const conflict = await tx.appointment.findFirst({
          where: {
            practitionerId: chosenPractitionerId,
            status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
            startsAt: { lt: requestedEndsAt },
            endsAt: { gt: requestedStartsAt },
          },
        });

        if (conflict) {
          throw new ConflictException({
            code: 'APPOINTMENT_SLOT_UNAVAILABLE',
            message: 'Khung giờ này vừa có người đặt. Vui lòng chọn giờ khác.',
          });
        }
      }

      // Upsert patient by phone
      let patient = await tx.patient.findFirst({
        where: { phone: dto.patientPhone.trim() },
      });

      if (!patient) {
        patient = await tx.patient.create({
          data: {
            fullName: dto.patientName.trim(),
            phone: dto.patientPhone.trim(),
            email: dto.patientEmail?.trim() || null,
          },
        });
      } else {
        // Update name/email if patient exists
        patient = await tx.patient.update({
          where: { id: patient.id },
          data: {
            fullName: dto.patientName.trim(),
            email: dto.patientEmail?.trim() || patient.email,
          },
        });
      }

      // Create appointment
      const newAppt = await tx.appointment.create({
        data: {
          reference,
          patientId: patient.id,
          serviceId: service.id,
          locationId: location.id,
          practitionerId: chosenPractitionerId,
          startsAt: requestedStartsAt,
          endsAt: requestedEndsAt,
          status: AppointmentStatus.PENDING,
          patientNote: dto.patientNote?.trim() || null,
          createdBy: 'PUBLIC',
        },
        include: {
          service: { select: { name: true, durationMinutes: true, priceMinor: true, currency: true } },
          practitioner: { select: { displayName: true } },
          location: { select: { name: true, address: true, timezone: true } },
        },
      });

      return newAppt;
    });

    // Audit event (outside tx to not lock tx)
    await this.auditService.record({
      actorRole: 'PUBLIC',
      action: 'APPOINTMENT_CREATED',
      entityType: 'Appointment',
      entityId: appointment.id,
      requestId,
      metadata: {
        reference: appointment.reference,
        serviceId: appointment.serviceId,
        startsAt: appointment.startsAt.toISOString(),
      },
    });

    return {
      reference: appointment.reference,
      status: appointment.status,
      serviceName: appointment.service.name,
      practitionerName: appointment.practitioner?.displayName || 'Bác sĩ theo lịch phân công',
      startsAt: appointment.startsAt.toISOString(),
      endsAt: appointment.endsAt.toISOString(),
      locationName: appointment.location.name,
      locationAddress: appointment.location.address,
      priceMinor: appointment.service.priceMinor,
      currency: appointment.service.currency,
      message: 'Yêu cầu đặt lịch đã được tiếp nhận thành công. Phòng khám sẽ sớm liên hệ xác nhận với bạn.',
    };
  }

  async getAppointmentStatus(reference: string) {
    const cleanRef = reference.trim().toUpperCase();
    const appt = await this.prisma.appointment.findUnique({
      where: { reference: cleanRef },
      select: {
        reference: true,
        status: true,
        startsAt: true,
        endsAt: true,
        service: {
          select: {
            name: true,
            durationMinutes: true,
          },
        },
        location: {
          select: {
            name: true,
            address: true,
          },
        },
        createdAt: true,
      },
    });

    if (!appt) {
      throw new NotFoundException({
        code: 'APPOINTMENT_NOT_FOUND',
        message: 'Không tìm thấy thông tin lịch hẹn với mã tham chiếu này.',
      });
    }

    return appt;
  }
}
