import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { QueryAppointmentsDto } from './dto/query-appointments.dto';
import { UpdateAppointmentStatusDto } from './dto/update-status.dto';
import { AuditService } from '../audit/audit.service';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  // Allowed state transition matrix
  private readonly ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
    [AppointmentStatus.PENDING]: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED],
    [AppointmentStatus.CONFIRMED]: [
      AppointmentStatus.COMPLETED,
      AppointmentStatus.NO_SHOW,
      AppointmentStatus.CANCELLED,
    ],
    [AppointmentStatus.CANCELLED]: [],
    [AppointmentStatus.COMPLETED]: [],
    [AppointmentStatus.NO_SHOW]: [],
  };

  async findAppointments(query: QueryAppointmentsDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: Prisma.AppointmentWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.serviceId) {
      where.serviceId = query.serviceId;
    }

    if (query.practitionerId) {
      where.practitionerId = query.practitionerId;
    }

    if (query.locationId) {
      where.locationId = query.locationId;
    }

    if (query.from || query.to) {
      where.startsAt = {};
      if (query.from) {
        where.startsAt.gte = new Date(`${query.from}T00:00:00+07:00`);
      }
      if (query.to) {
        where.startsAt.lte = new Date(`${query.to}T23:59:59+07:00`);
      }
    }

    const [total, items] = await Promise.all([
      this.prisma.appointment.count({ where }),
      this.prisma.appointment.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { startsAt: 'desc' },
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              phone: true,
              email: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              durationMinutes: true,
              priceMinor: true,
              currency: true,
            },
          },
          practitioner: {
            select: {
              id: true,
              displayName: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      data: items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getAppointmentById(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
          },
        },
        service: true,
        practitioner: true,
        location: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException({
        code: 'APPOINTMENT_NOT_FOUND',
        message: 'Không tìm thấy lịch hẹn.',
      });
    }

    return appointment;
  }

  async updateStatus(
    id: string,
    dto: UpdateAppointmentStatusDto,
    currentUser: AuthenticatedUser,
    requestId?: string,
  ) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appt) {
      throw new NotFoundException({
        code: 'APPOINTMENT_NOT_FOUND',
        message: 'Không tìm thấy lịch hẹn.',
      });
    }

    const currentStatus = appt.status;
    const targetStatus = dto.status;

    if (currentStatus === targetStatus) {
      return appt;
    }

    const allowed = this.ALLOWED_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(targetStatus)) {
      throw new BadRequestException({
        code: 'INVALID_STATUS_TRANSITION',
        message: `Không thể chuyển trạng thái từ "${currentStatus}" sang "${targetStatus}".`,
      });
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: targetStatus,
        cancellationReason: dto.reason || appt.cancellationReason,
      },
      include: {
        patient: true,
        service: true,
        practitioner: true,
      },
    });

    await this.auditService.record({
      actorId: currentUser.id,
      actorRole: currentUser.role,
      action: 'APPOINTMENT_STATUS_CHANGED',
      entityType: 'Appointment',
      entityId: updated.id,
      requestId,
      metadata: {
        fromStatus: currentStatus,
        toStatus: targetStatus,
        reason: dto.reason || null,
      },
    });

    return updated;
  }
}
