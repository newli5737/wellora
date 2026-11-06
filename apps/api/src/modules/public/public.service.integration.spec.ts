import { Test, TestingModule } from '@nestjs/testing';
import { PublicService } from './public.service';
import { PrismaService } from '../../database/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { AuditService } from '../audit/audit.service';
import { ConflictException } from '@nestjs/common';

describe('PublicService Integration - Slot Concurrency & Race Condition', () => {
  let publicService: PublicService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicService,
        AvailabilityService,
        PrismaService,
        {
          provide: AuditService,
          useValue: {
            record: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    publicService = module.get<PublicService>(PublicService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('prevents double-booking when 2 requests compete for the same slot', async () => {
    // 1. Get existing seed service & doctor
    const service = await prisma.service.findFirst({ where: { isActive: true } });
    const location = await prisma.location.findFirst({ where: { isActive: true } });
    const practitioner = await prisma.practitioner.findFirst({ where: { isBookable: true } });

    expect(service).toBeDefined();
    expect(location).toBeDefined();
    expect(practitioner).toBeDefined();

    // Pick a future time slot: e.g. 2026-12-01T10:00:00.000Z
    const testSlotTime = '2026-12-01T10:00:00.000Z';

    // Clean up any test appointment from previous runs
    await prisma.appointment.deleteMany({
      where: {
        startsAt: new Date(testSlotTime),
        practitionerId: practitioner!.id,
      },
    });

    const payload1 = {
      serviceId: service!.id,
      locationId: location!.id,
      practitionerId: practitioner!.id,
      startsAt: testSlotTime,
      patientName: 'Người khám A',
      patientPhone: '0901111111',
      consent: true,
    };

    const payload2 = {
      serviceId: service!.id,
      locationId: location!.id,
      practitionerId: practitioner!.id,
      startsAt: testSlotTime,
      patientName: 'Người khám B',
      patientPhone: '0902222222',
      consent: true,
    };

    // Send both concurrently
    const results = await Promise.allSettled([
      publicService.createAppointment(payload1),
      publicService.createAppointment(payload2),
    ]);

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');

    // Exactly one must succeed
    expect(fulfilled.length).toBe(1);
    // Exactly one must be rejected with ConflictException
    expect(rejected.length).toBe(1);

    const rejectedReason = (rejected[0] as PromiseRejectedResult).reason;
    expect(rejectedReason).toBeInstanceOf(ConflictException);
    expect(rejectedReason.getResponse().code).toBe('APPOINTMENT_SLOT_UNAVAILABLE');

    // Clean up created test appointment
    const createdAppt = (fulfilled[0] as PromiseFulfilledResult<any>).value;
    await prisma.appointment.delete({
      where: { reference: createdAppt.reference },
    });
  });
});
