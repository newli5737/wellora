import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SEED CẢNH BÁO: Không được chạy seed dữ liệu mẫu trong môi trường production!');
  }

  console.log('--- Bắt đầu Seeding dữ liệu phát triển (Dữ liệu mẫu) ---');

  // 1. Tạo cơ sở phòng khám mẫu
  const location = await prisma.location.upsert({
    where: { slug: 'wellora-trung-tam' },
    update: {},
    create: {
      name: 'Wellora Healthcare — Cơ sở Mẫu',
      slug: 'wellora-trung-tam',
      address: '[Dữ liệu mẫu] 123 Đại Lộ Sức Khỏe, Quận 1, TP. Hồ Chí Minh',
      phone: '1900 8888',
      timezone: 'Asia/Ho_Chi_Minh',
      isActive: true,
    },
  });

  // 2. Tạo tài khoản quản trị viên và bác sĩ mẫu
  const passwordHash = await bcrypt.hash('WelloraDev123!@#', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@wellora.local' },
    update: {},
    create: {
      email: 'admin@wellora.local',
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@wellora.local' },
    update: {},
    create: {
      email: 'staff@wellora.local',
      passwordHash,
      role: UserRole.STAFF,
      isActive: true,
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor.ha@wellora.local' },
    update: {},
    create: {
      email: 'doctor.ha@wellora.local',
      passwordHash,
      role: UserRole.PRACTITIONER,
      isActive: true,
    },
  });

  // 3. Tạo thông tin Practitioner (bác sĩ)
  const practitioner = await prisma.practitioner.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      displayName: 'BS. CK1 Nguyễn Thu Hà (Dữ liệu mẫu)',
      bio: 'Bác sĩ chuyên khoa y học gia đình và chăm sóc sức khỏe phòng ngừa. [Thông tin mẫu dùng kiểm thử].',
      isBookable: true,
      isPublished: true,
    },
  });

  // 4. Tạo các dịch vụ mẫu
  const servicesData = [
    {
      name: 'Khám sức khỏe tổng quát ban đầu',
      slug: 'kham-tong-quat',
      description: 'Đánh giá chỉ số sinh hiệu, thăm khám lâm sàng tổng quát và tư vấn kế hoạch chăm sóc sức khỏe phòng ngừa.',
      durationMinutes: 30,
      bufferBeforeMinutes: 5,
      bufferAfterMinutes: 10,
      priceMinor: 350000,
      currency: 'VND',
    },
    {
      name: 'Tư vấn dinh dưỡng & lối sống lành mạnh',
      slug: 'tu-van-dinh-duong',
      description: 'Phân tích thói quen dinh dưỡng, chỉ số cơ thể và thiết lập thực đơn khoa học phù hợp với thể trạng cá nhân.',
      durationMinutes: 45,
      bufferBeforeMinutes: 5,
      bufferAfterMinutes: 10,
      priceMinor: 450000,
      currency: 'VND',
    },
    {
      name: 'Theo dõi chỉ số & Tái khám định kỳ',
      slug: 'theo-doi-dinh-ky',
      description: 'Đánh giá tiến triển sức khỏe, kiểm tra các chỉ số huyết áp, đường huyết định kỳ và điều chỉnh phác đồ chăm sóc.',
      durationMinutes: 30,
      bufferBeforeMinutes: 5,
      bufferAfterMinutes: 5,
      priceMinor: 250000,
      currency: 'VND',
    },
  ];

  const createdServices = [];
  for (const s of servicesData) {
    const service = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        ...s,
        isActive: true,
        isPublished: true,
      },
    });
    createdServices.push(service);

    // Liên kết practitioner với service
    await prisma.practitionerService.upsert({
      where: {
        practitionerId_serviceId: {
          practitionerId: practitioner.id,
          serviceId: service.id,
        },
      },
      update: {},
      create: {
        practitionerId: practitioner.id,
        serviceId: service.id,
      },
    });
  }

  // 5. Cấu hình giờ làm việc (Thứ 2 đến Thứ 7, 08:00 - 12:00 và 13:30 - 17:30)
  // weekday: 1 (Mon) -> 6 (Sat)
  for (let weekday = 1; weekday <= 6; weekday++) {
    // Sáng
    await prisma.workingHours.create({
      data: {
        practitionerId: practitioner.id,
        locationId: location.id,
        weekday,
        startTime: '08:00',
        endTime: '12:00',
      },
    });
    // Chiều
    await prisma.workingHours.create({
      data: {
        practitionerId: practitioner.id,
        locationId: location.id,
        weekday,
        startTime: '13:30',
        endTime: '17:30',
      },
    });
  }

  console.log('--- Seeding hoàn tất thành công! ---');
  console.log('Cơ sở:', location.name);
  console.log('Tài khoản test:');
  console.log('- Admin: admin@wellora.local / WelloraDev123!@#');
  console.log('- Staff: staff@wellora.local / WelloraDev123!@#');
  console.log('- Bác sĩ: doctor.ha@wellora.local / WelloraDev123!@#');
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

