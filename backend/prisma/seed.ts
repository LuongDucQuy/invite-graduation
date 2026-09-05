import { PrismaClient, RsvpStatus, EventStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records (in reverse relation order)
  await prisma.message.deleteMany({});
  await prisma.eventGuest.deleteMany({});
  await prisma.timeline.deleteMany({});
  await prisma.gallery.deleteMany({});
  await prisma.guest.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.admin.deleteMany({});

  // 2. Create Admin
  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      passwordHash: adminPassword,
    },
  });
  console.log(`✅ Admin created: ${admin.username} / Admin@123456`);

  // 3. Create Event
  const event = await prisma.event.create({
    data: {
      title: 'Graduation Ceremony — Lương Đức Quý',
      graduateName: 'Lương Đức Quý',
      graduateMessage: 'Quý rất vui và vinh hạnh khi được chia sẻ cột mốc đặc biệt này cùng bạn.',
      description:
        'Hành trình 4 năm rực rỡ dưới mái trường đại học đã chính thức khép lại để mở ra những chương mới đầy khát vọng. Sự hiện diện và lời chúc của bạn là món quà vô giá nhất đối với Quý trong ngày lễ tốt nghiệp này.',
      eventDate: new Date('2026-09-20T18:30:00.000+07:00'),
      startTime: '18:30',
      endTime: '21:30',
      venueName: 'ABC University — Grand Hall A5',
      venueAddress: '123 Nguyễn Văn Cừ, Phường 4, Quận 5, TP. Hồ Chí Minh',
      latitude: 10.762622,
      longitude: 106.682372,
      googleMapUrl: 'https://maps.google.com/?q=10.762622,106.682372',
      coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop',
      avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      backgroundMusic: 'https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3',
      dressCode: 'Semi-formal / Elegant (Trắng, Be, Kem, Đen hoặc Pastel)',
      status: EventStatus.PUBLISHED,
    },
  });
  console.log(`✅ Event created: ${event.title}`);

  // 4. Create Timelines
  const timelinesData = [
    {
      eventId: event.id,
      time: '18:00',
      title: 'Đón khách & Check-in',
      description: 'Chụp hình lưu niệm tại Photobooth và nhận quà tặng kỷ niệm từ Quý.',
      icon: 'camera',
      sortOrder: 1,
    },
    {
      eventId: event.id,
      time: '18:30',
      title: 'Khai mạc buổi lễ tốt nghiệp',
      description: 'Lời chào mừng từ gia đình và phát biểu tri ân thầy cô, bạn bè.',
      icon: 'sparkles',
      sortOrder: 2,
    },
    {
      eventId: event.id,
      time: '19:15',
      title: 'Nghi thức trao bằng & Tung nón cử nhân',
      description: 'Khoảnh khắc nhận tấm bằng đại học và nghi thức chúc mừng của cử nhân.',
      icon: 'award',
      sortOrder: 3,
    },
    {
      eventId: event.id,
      time: '19:45',
      title: 'Chia sẻ kỷ niệm & Video hành trình',
      description: 'Xem lại những thước phim hành trình 4 năm sinh viên đầy cảm xúc.',
      icon: 'film',
      sortOrder: 4,
    },
    {
      eventId: event.id,
      time: '20:15',
      title: 'Tiệc mừng & Âm nhạc giao lưu',
      description: 'Thưởng thức tiệc Finger Food, cocktail nhẹ và cùng nhau trò chuyện ấm áp.',
      icon: 'music',
      sortOrder: 5,
    },
  ];

  for (const item of timelinesData) {
    await prisma.timeline.create({ data: item });
  }
  console.log(`✅ ${timelinesData.length} Timelines created`);

  // 5. Create Gallery
  const galleryData = [
    {
      eventId: event.id,
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
      caption: 'Khoảnh khắc cử nhân bước lên bục vinh quang',
      sortOrder: 1,
    },
    {
      eventId: event.id,
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
      caption: 'Nụ cười rạng rỡ của ngày nhận bằng',
      sortOrder: 2,
    },
    {
      eventId: event.id,
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
      caption: 'Kỷ niệm cùng những người bạn đồng hành suốt 4 năm',
      sortOrder: 3,
    },
    {
      eventId: event.id,
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop',
      caption: 'Những buổi thảo luận đồ án thâu đêm',
      sortOrder: 4,
    },
    {
      eventId: event.id,
      imageUrl: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?q=80&w=800&auto=format&fit=crop',
      caption: 'Góc giảng đường đại học thân thương',
      sortOrder: 5,
    },
    {
      eventId: event.id,
      imageUrl: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=800&auto=format&fit=crop',
      caption: 'Chúc mừng Tân cử nhân Lương Đức Quý!',
      sortOrder: 6,
    },
  ];

  for (const item of galleryData) {
    await prisma.gallery.create({ data: item });
  }
  console.log(`✅ ${galleryData.length} Galleries created`);

  // 6. Create Sample Guests
  const guestsData = [
    {
      eventId: event.id,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      inviteToken: 'a8K2x9',
      numberOfGuests: 2,
      relationship: 'Bạn thân Đại học',
      rsvpStatus: RsvpStatus.ATTENDING,
      rsvpMessage: 'Chúc mừng Quý nhé! Nhất định mình sẽ có mặt sớm để chụp hình cùng cậu!',
      openedAt: new Date(Date.now() - 3600000 * 24),
      confirmedAt: new Date(Date.now() - 3600000 * 20),
    },
    {
      eventId: event.id,
      name: 'Trần Văn B',
      email: 'tranvanb@example.com',
      phone: '0912345678',
      inviteToken: 'b7L3y1',
      numberOfGuests: 1,
      relationship: 'Đồng nghiệp',
      rsvpStatus: RsvpStatus.PENDING,
      rsvpMessage: null,
      openedAt: new Date(Date.now() - 3600000 * 12),
      confirmedAt: null,
    },
    {
      eventId: event.id,
      name: 'Lê Thị C',
      email: 'lethic@example.com',
      phone: '0923456789',
      inviteToken: 'c6M4z2',
      numberOfGuests: 3,
      relationship: 'Gia đình',
      rsvpStatus: RsvpStatus.ATTENDING,
      rsvpMessage: 'Cả nhà chúc mừng con trai tốt nghiệp xuất sắc! Tự hào về con!',
      openedAt: new Date(Date.now() - 3600000 * 48),
      confirmedAt: new Date(Date.now() - 3600000 * 40),
    },
    {
      eventId: event.id,
      name: 'Phạm Văn D',
      email: 'phamvand@example.com',
      phone: '0934567890',
      inviteToken: 'd5N5w3',
      numberOfGuests: 1,
      relationship: 'Mentor hướng dẫn',
      rsvpStatus: RsvpStatus.NOT_ATTENDING,
      rsvpMessage: 'Thầy có chuyến công tác vào ngày này nên tiếc quá không đến chung vui được. Chúc em luôn vững bước và thành công!',
      openedAt: new Date(Date.now() - 3600000 * 18),
      confirmedAt: new Date(Date.now() - 3600000 * 10),
    },
    {
      eventId: event.id,
      name: 'Hoàng Thị E',
      email: 'hoangthie@example.com',
      phone: '0945678901',
      inviteToken: 'e4P6v4',
      numberOfGuests: 2,
      relationship: 'Bạn cấp 3',
      rsvpStatus: RsvpStatus.PENDING,
      rsvpMessage: null,
      openedAt: null,
      confirmedAt: null,
    },
  ];

  const createdGuests = [];
  for (const item of guestsData) {
    const guest = await prisma.guest.create({ data: item });
    createdGuests.push(guest);
  }
  console.log(`✅ ${guestsData.length} Guests created with distinct tokens`);

  // 7. Create Sample Messages
  const messagesData = [
    {
      eventId: event.id,
      guestId: createdGuests[0].id,
      guestName: 'Nguyễn Văn A',
      content: 'Chúc mừng Tân cử nhân Lương Đức Quý! Chúc bạn sự nghiệp thăng tiến và luôn rực rỡ như hôm nay! 🎓🎉',
    },
    {
      eventId: event.id,
      guestId: createdGuests[2].id,
      guestName: 'Lê Thị C (Gia đình)',
      content: 'Tự hào về cháu rất nhiều! Chúc cháu bước sang chặng đường mới luôn gặp nhiều may mắn và hạnh phúc!',
    },
    {
      eventId: event.id,
      guestId: createdGuests[3].id,
      guestName: 'Thầy Phạm Văn D',
      content: 'Chúc mừng em đã hoàn thành xuất sắc đồ án và khóa học! Tiếp tục phát huy tinh thần học hỏi nhé!',
    },
  ];

  for (const item of messagesData) {
    await prisma.message.create({ data: item });
  }
  console.log(`✅ ${messagesData.length} Wishes messages created`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
