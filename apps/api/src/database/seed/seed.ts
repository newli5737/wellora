import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SEED) {
    throw new Error('SEED CẢNH BÁO: Không được chạy seed dữ liệu mẫu trong môi trường production!');
  }

  console.log('--- Bắt đầu Seeding dữ liệu phòng khám vào Cơ sở dữ liệu ---');

  // 1. Tạo cơ sở phòng khám
  const location = await prisma.location.upsert({
    where: { slug: 'wellora-trung-tam' },
    update: {
      name: 'Wellora Healthcare — Cơ sở Trung tâm',
      address: '123 Đại Lộ Sức Khỏe, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      phone: '1900 8888',
      timezone: 'Asia/Ho_Chi_Minh',
      isActive: true,
    },
    create: {
      name: 'Wellora Healthcare — Cơ sở Trung tâm',
      slug: 'wellora-trung-tam',
      address: '123 Đại Lộ Sức Khỏe, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      phone: '1900 8888',
      timezone: 'Asia/Ho_Chi_Minh',
      isActive: true,
    },
  });

  // 2. Tạo tài khoản nhân sự
  const passwordHash = await bcrypt.hash('WelloraDev123!@#', 10);

  await prisma.user.upsert({
    where: { email: 'admin@wellora.local' },
    update: {},
    create: {
      email: 'admin@wellora.local',
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'staff@wellora.local' },
    update: {},
    create: {
      email: 'staff@wellora.local',
      passwordHash,
      role: UserRole.STAFF,
      isActive: true,
    },
  });

  const doctorUser1 = await prisma.user.upsert({
    where: { email: 'doctor.ha@wellora.local' },
    update: {},
    create: {
      email: 'doctor.ha@wellora.local',
      passwordHash,
      role: UserRole.PRACTITIONER,
      isActive: true,
    },
  });

  const doctorUser2 = await prisma.user.upsert({
    where: { email: 'doctor.tuan@wellora.local' },
    update: {},
    create: {
      email: 'doctor.tuan@wellora.local',
      passwordHash,
      role: UserRole.PRACTITIONER,
      isActive: true,
    },
  });

  // 3. Tạo Practitioner (Bác sĩ chuyên môn) với ảnh thực tế
  const practitioner1 = await prisma.practitioner.upsert({
    where: { userId: doctorUser1.id },
    update: {
      displayName: 'BS. CK1 Nguyễn Thu Hà',
      bio: 'Tốt nghiệp Đại học Y Dược TP.HCM với hơn 12 năm kinh nghiệm trong Y học gia đình và chăm sóc sức khỏe phòng ngừa.',
      photoUrl: '/images/clinic/doctor-ha.jpg',
      isBookable: true,
      isPublished: true,
    },
    create: {
      userId: doctorUser1.id,
      displayName: 'BS. CK1 Nguyễn Thu Hà',
      bio: 'Tốt nghiệp Đại học Y Dược TP.HCM với hơn 12 năm kinh nghiệm trong Y học gia đình và chăm sóc sức khỏe phòng ngừa.',
      photoUrl: '/images/clinic/doctor-ha.jpg',
      isBookable: true,
      isPublished: true,
    },
  });

  const practitioner2 = await prisma.practitioner.upsert({
    where: { userId: doctorUser2.id },
    update: {
      displayName: 'ThS. BS Trần Minh Tuấn',
      bio: 'Thạc sĩ Y khoa Đại học Y Hà Nội với hơn 15 năm kinh nghiệm chuyên sâu về Nội khoa tổng quát, quản lý bệnh mạn tính và tim mạch chuyển hóa.',
      photoUrl: '/images/clinic/doctor-tuan.jpg',
      isBookable: true,
      isPublished: true,
    },
    create: {
      userId: doctorUser2.id,
      displayName: 'ThS. BS Trần Minh Tuấn',
      bio: 'Thạc sĩ Y khoa Đại học Y Hà Nội với hơn 15 năm kinh nghiệm chuyên sâu về Nội khoa tổng quát, quản lý bệnh mạn tính và tim mạch chuyển hóa.',
      photoUrl: '/images/clinic/doctor-tuan.jpg',
      isBookable: true,
      isPublished: true,
    },
  });

  // 4. Tạo Dịch vụ với ảnh thực tế được lưu trực tiếp trong DB
  const servicesData = [
    {
      name: 'Khám sức khỏe tổng quát ban đầu',
      slug: 'kham-tong-quat',
      description: 'Đánh giá chỉ số sinh hiệu, thăm khám lâm sàng toàn diện và tư vấn kế hoạch chăm sóc sức khỏe phòng ngừa.',
      imageUrl: '/images/clinic/service-general.jpg',
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
      imageUrl: '/images/clinic/service-nutrition.jpg',
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
      imageUrl: '/images/clinic/service-checkup.jpg',
      durationMinutes: 30,
      bufferBeforeMinutes: 5,
      bufferAfterMinutes: 5,
      priceMinor: 250000,
      currency: 'VND',
    },
  ];

  for (const s of servicesData) {
    const service = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        description: s.description,
        imageUrl: s.imageUrl,
        durationMinutes: s.durationMinutes,
        bufferBeforeMinutes: s.bufferBeforeMinutes,
        bufferAfterMinutes: s.bufferAfterMinutes,
        priceMinor: s.priceMinor,
        currency: s.currency,
        isActive: true,
        isPublished: true,
      },
      create: {
        ...s,
        isActive: true,
        isPublished: true,
      },
    });

    // Gán cả 2 bác sĩ cho dịch vụ này
    for (const p of [practitioner1, practitioner2]) {
      await prisma.practitionerService.upsert({
        where: {
          practitionerId_serviceId: {
            practitionerId: p.id,
            serviceId: service.id,
          },
        },
        update: {},
        create: {
          practitionerId: p.id,
          serviceId: service.id,
        },
      });
    }
  }

  // 5. Cấu hình giờ làm việc cho cả 2 bác sĩ
  await prisma.workingHours.deleteMany({});
  for (const p of [practitioner1, practitioner2]) {
    for (let weekday = 1; weekday <= 6; weekday++) {
      // Sáng: 08:00 - 12:00
      await prisma.workingHours.create({
        data: {
          practitionerId: p.id,
          locationId: location.id,
          weekday,
          startTime: '08:00',
          endTime: '12:00',
        },
      });
      // Chiều: 13:30 - 17:30
      await prisma.workingHours.create({
        data: {
          practitionerId: p.id,
          locationId: location.id,
          weekday,
          startTime: '13:30',
          endTime: '17:30',
        },
      });
    }
  }

  console.log('--- Seeding hoàn tất thành công! ---');
  console.log('Cơ sở:', location.name);
  console.log('Bác sĩ:', practitioner1.displayName, ',', practitioner2.displayName);
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
