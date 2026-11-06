import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentStatus } from '@prisma/client';

describe('AppointmentsService - Status Transitions', () => {
  let service: AppointmentsService;
  let mockPrisma: any;
  let mockAudit: any;

  beforeEach(() => {
    mockPrisma = {
      appointment: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    mockAudit = {
      record: jest.fn().mockResolvedValue(undefined),
    };
    service = new AppointmentsService(mockPrisma, mockAudit);
  });

  const currentUser = { id: 'user-1', email: 'staff@wellora.local', role: 'STAFF' };

  it('allows PENDING -> CONFIRMED transition', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue({
      id: 'appt-1',
      status: AppointmentStatus.PENDING,
    });
    mockPrisma.appointment.update.mockResolvedValue({
      id: 'appt-1',
      status: AppointmentStatus.CONFIRMED,
    });

    const result = await service.updateStatus(
      'appt-1',
      { status: AppointmentStatus.CONFIRMED },
      currentUser,
    );

    expect(result.status).toBe(AppointmentStatus.CONFIRMED);
    expect(mockAudit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'APPOINTMENT_STATUS_CHANGED',
        entityId: 'appt-1',
      }),
    );
  });

  it('rejects CANCELLED -> CONFIRMED transition (terminal state)', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue({
      id: 'appt-1',
      status: AppointmentStatus.CANCELLED,
    });

    await expect(
      service.updateStatus(
        'appt-1',
        { status: AppointmentStatus.CONFIRMED },
        currentUser,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects COMPLETED -> PENDING transition', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue({
      id: 'appt-1',
      status: AppointmentStatus.COMPLETED,
    });

    await expect(
      service.updateStatus(
        'appt-1',
        { status: AppointmentStatus.PENDING },
        currentUser,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws NotFoundException when appointment does not exist', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(null);

    await expect(
      service.updateStatus(
        'non-existent',
        { status: AppointmentStatus.CONFIRMED },
        currentUser,
      ),
    ).rejects.toThrow(NotFoundException);
  });
});

