import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AppointmentStatus } from '@prisma/client';

export interface GetAvailabilityQuery {
  serviceId: string;
  locationId?: string;
  practitionerId?: string;
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

export interface AvailableSlot {
  startsAt: string; // ISO string with UTC Z
  endsAt: string;
  localTime: string; // HH:mm in clinic timezone
  practitionerId?: string;
}

@Injectable()
export class AvailabilityService {
  private readonly DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';

  constructor(private readonly prisma: PrismaService) {}

  async getAvailableSlots(query: GetAvailabilityQuery): Promise<{
    timezone: string;
    slots: AvailableSlot[];
  }> {
    const { serviceId, locationId, practitionerId, from, to } = query;

    if (!serviceId) {
      throw new BadRequestException({
        code: 'MISSING_SERVICE_ID',
        message: 'Dịch vụ là thông tin bắt buộc để tính khung giờ.',
      });
    }

    const service = await this.prisma.service.findUnique({
      where: { id: serviceId, isActive: true },
      include: {
        practitioners: {
          include: {
            practitioner: true,
          },
        },
      },
    });

    if (!service) {
      throw new BadRequestException({
        code: 'SERVICE_NOT_FOUND',
        message: 'Dịch vụ không tồn tại hoặc đã ngừng hoạt động.',
      });
    }

    // Determine target location
    let targetLocation = null;
    if (locationId) {
      targetLocation = await this.prisma.location.findUnique({
        where: { id: locationId, isActive: true },
      });
    } else {
      targetLocation = await this.prisma.location.findFirst({
        where: { isActive: true },
      });
    }

    const timezone = targetLocation?.timezone || this.DEFAULT_TIMEZONE;

    // Validate date range (limit to 14 days max to prevent abuse)
    const fromDate = new Date(`${from}T00:00:00+07:00`);
    const toDate = new Date(`${to}T23:59:59+07:00`);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new BadRequestException({
        code: 'INVALID_DATE_RANGE',
        message: 'Khoảng thời gian không hợp lệ (định dạng YYYY-MM-DD).',
      });
    }

    const diffDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 1 || diffDays > 30) {
      throw new BadRequestException({
        code: 'RANGE_TOO_LARGE',
        message: 'Khoảng thời gian tra cứu tối đa là 30 ngày.',
      });
    }

    // Identify candidate practitioners
    let eligiblePractitioners = service.practitioners
      .map((ps) => ps.practitioner)
      .filter((p) => p.isBookable && p.isPublished);

    if (practitionerId) {
      eligiblePractitioners = eligiblePractitioners.filter((p) => p.id === practitionerId);
    }

    if (eligiblePractitioners.length === 0) {
      return { timezone, slots: [] };
    }

    const practitionerIds = eligiblePractitioners.map((p) => p.id);

    // Fetch working hours
    const workingHours = await this.prisma.workingHours.findMany({
      where: {
        OR: [
          { practitionerId: { in: practitionerIds } },
          { practitionerId: null },
        ],
      },
    });

    // Fetch exceptions
    const exceptions = await this.prisma.availabilityException.findMany({
      where: {
        OR: [
          { practitionerId: { in: practitionerIds } },
          { practitionerId: null },
        ],
        startDate: { lte: toDate },
        endDate: { gte: fromDate },
      },
    });

    // Fetch conflicting appointments
    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        practitionerId: { in: practitionerIds },
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
        startsAt: { lte: toDate },
        endsAt: { gte: fromDate },
      },
    });

    const slotsMap = new Map<string, AvailableSlot>();
    const now = new Date();
    // 30 minute minimum notice
    const cutoffTime = new Date(now.getTime() + 30 * 60 * 1000);

    const slotDurationMs = service.durationMinutes * 60 * 1000;
    const bufferAfterMs = service.bufferAfterMinutes * 60 * 1000;

    // Loop through each day
    const currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const weekday = currentDate.getDay(); // 0 is Sunday, 1 is Monday...

      for (const practitioner of eligiblePractitioners) {
        // Check if day off exception exists
        const isExceptionOff = exceptions.some((ex) => {
          const matchPractitioner = !ex.practitionerId || ex.practitionerId === practitioner.id;
          if (!matchPractitioner) return false;
          const exStartStr = ex.startDate.toISOString().slice(0, 10);
          const exEndStr = ex.endDate.toISOString().slice(0, 10);
          return dateStr >= exStartStr && dateStr <= exEndStr && ex.isUnavailable;
        });

        if (isExceptionOff) continue;

        // Find working hours for this weekday
        const pWorkingHours = workingHours.filter((wh) => {
          const matchPractitioner = !wh.practitionerId || wh.practitionerId === practitioner.id;
          return matchPractitioner && wh.weekday === weekday;
        });

        for (const wh of pWorkingHours) {
          const [startHour, startMin] = wh.startTime.split(':').map(Number);
          const [endHour, endMin] = wh.endTime.split(':').map(Number);

          const periodStart = new Date(`${dateStr}T${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00+07:00`);
          const periodEnd = new Date(`${dateStr}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00+07:00`);

          let slotStart = new Date(periodStart);

          while (slotStart.getTime() + slotDurationMs <= periodEnd.getTime()) {
            const slotEnd = new Date(slotStart.getTime() + slotDurationMs);

            // Check if slot is in future
            if (slotStart > cutoffTime) {
              // Check overlap with existing appointments
              const hasConflict = existingAppointments.some((appt) => {
                if (appt.practitionerId !== practitioner.id) return false;
                // [startsAt, endsAt] overlaps with [slotStart, slotEnd + buffer]
                const apptStart = appt.startsAt.getTime();
                const apptEnd = appt.endsAt.getTime();
                const testStart = slotStart.getTime();
                const testEnd = slotEnd.getTime() + bufferAfterMs;
                return Math.max(apptStart, testStart) < Math.min(apptEnd, testEnd);
              });

              if (!hasConflict) {
                const localHours = String(slotStart.getHours()).padStart(2, '0');
                const localMinutes = String(slotStart.getMinutes()).padStart(2, '0');
                const localTime = `${localHours}:${localMinutes}`;

                const key = `${dateStr}_${localTime}_${practitionerId ? practitioner.id : 'any'}`;
                if (!slotsMap.has(key)) {
                  slotsMap.set(key, {
                    startsAt: slotStart.toISOString(),
                    endsAt: slotEnd.toISOString(),
                    localTime,
                    practitionerId: practitionerId ? practitioner.id : undefined,
                  });
                }
              }
            }

            // Advance by duration or 30 minutes
            slotStart = new Date(slotStart.getTime() + 30 * 60 * 1000);
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const sortedSlots = Array.from(slotsMap.values()).sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );

    return {
      timezone,
      slots: sortedSlots,
    };
  }
}

