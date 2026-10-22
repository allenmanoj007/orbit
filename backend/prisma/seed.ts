import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const INITIAL_INTERESTS = [
  { name: 'Gaming', emoji: '🎮', category: 'Entertainment' },
  { name: 'Music', emoji: '🎵', category: 'Creative' },
  { name: 'Photography', emoji: '📷', category: 'Creative' },
  { name: 'Travel', emoji: '✈️', category: 'Lifestyle' },
  { name: 'Fitness', emoji: '💪', category: 'Health' },
  { name: 'Reading', emoji: '📚', category: 'Intellectual' },
  { name: 'Cooking', emoji: '🍳', category: 'Food' },
  { name: 'Art', emoji: '🎨', category: 'Creative' },
  { name: 'Technology', emoji: '💻', category: 'Intellectual' },
  { name: 'Movies', emoji: '🎬', category: 'Entertainment' },
  { name: 'Sports', emoji: '⚽', category: 'Health' },
  { name: 'Dancing', emoji: '💃', category: 'Creative' },
  { name: 'Yoga', emoji: '🧘', category: 'Health' },
  { name: 'Nature', emoji: '🌿', category: 'Lifestyle' },
  { name: 'Fashion', emoji: '👗', category: 'Lifestyle' },
  { name: 'Coffee', emoji: '☕', category: 'Food' },
  { name: 'Coding', emoji: '⌨️', category: 'Technology' },
  { name: 'Design', emoji: '✏️', category: 'Creative' },
  { name: 'Podcasts', emoji: '🎙️', category: 'Intellectual' },
  { name: 'Cycling', emoji: '🚴', category: 'Health' },
  { name: 'Hiking', emoji: '🥾', category: 'Outdoors' },
  { name: 'Writing', emoji: '✍️', category: 'Creative' },
  { name: 'Board Games', emoji: '🎲', category: 'Entertainment' },
  { name: 'Volunteering', emoji: '🤝', category: 'Community' },
  { name: 'Astronomy', emoji: '🔭', category: 'Science' },
];

const INITIAL_HOBBIES = [
  { name: 'Guitar', emoji: '🎸', category: 'Music' },
  { name: 'Gardening', emoji: '🌱', category: 'Home' },
  { name: 'Baking', emoji: '🧁', category: 'Cooking' },
  { name: 'Skateboarding', emoji: '🛹', category: 'Sports' },
  { name: 'Swimming', emoji: '🏊', category: 'Sports' },
  { name: 'Chess', emoji: '♟️', category: 'Games' },
  { name: 'Origami', emoji: '🦢', category: 'Crafts' },
  { name: 'Pottery', emoji: '🏺', category: 'Crafts' },
  { name: 'Running', emoji: '🏃', category: 'Fitness' },
  { name: 'Martial Arts', emoji: '🥋', category: 'Fitness' },
  { name: 'Painting', emoji: '🖌️', category: 'Art' },
  { name: 'Rock Climbing', emoji: '🧗', category: 'Outdoors' },
  { name: 'Camping', emoji: '⛺', category: 'Outdoors' },
  { name: 'Brewing Coffee', emoji: '☕', category: 'Food' },
  { name: 'Birdwatching', emoji: '🦜', category: 'Nature' },
];

async function main() {
  console.log('🌱 Starting Orbit database seed...');

  // 1. Seed Interests
  console.log('Inserting interests...');
  for (const item of INITIAL_INTERESTS) {
    await prisma.interest.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }

  // 2. Seed Hobbies
  console.log('Inserting hobbies...');
  for (const item of INITIAL_HOBBIES) {
    await prisma.hobby.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }

  // 3. Seed Admin User
  console.log('Creating admin user...');
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@orbit.app' },
    update: { isAdmin: true },
    create: {
      email: 'admin@orbit.app',
      passwordHash: adminPasswordHash,
      isAdmin: true,
      isEmailVerified: true,
      isActive: true,
      profile: {
        create: {
          displayName: 'Orbit Admin',
          username: 'orbit_admin',
          bio: 'System Administrator for Orbit Social Network',
          profession: 'Platform Lead',
          lookingFor: ['Professional Networking', 'Local Community'],
          profileCompleteness: 100,
        },
      },
      privacySettings: { create: {} },
      locationPreference: { create: {} },
    },
  });

  // 4. Seed Sample Nearby Users for instant rich discovery
  console.log('Creating sample nearby users...');
  const sampleUsers = [
    {
      email: 'sarah.designer@orbit.test',
      displayName: 'Sarah Chen',
      username: 'sarah_creative',
      bio: 'UI/UX Designer who loves exploring cozy cafes and sketching urban architecture. Let’s grab a matcha! 🍵',
      profession: 'Product Designer',
      age: 26,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      lookingFor: ['Creative Friends', 'New Friends', 'Coffee Chats'],
      interests: ['Design', 'Art', 'Coffee', 'Photography', 'Technology'],
      hobbies: ['Painting', 'Brewing Coffee'],
      lat: 37.7749,
      lng: -122.4194, // San Francisco baseline
    },
    {
      email: 'alex.gamer@orbit.test',
      displayName: 'Alex Rivera',
      username: 'alex_r',
      bio: 'Full-stack dev by day, Elden Ring explorer by night. Looking for coop teammates and local running buddies 🏃‍♂️',
      profession: 'Software Engineer',
      age: 28,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      lookingFor: ['Gaming Friends', 'Fitness Friends', 'Coding'],
      interests: ['Gaming', 'Coding', 'Technology', 'Fitness', 'Music'],
      hobbies: ['Running', 'Guitar'],
      lat: 37.7812,
      lng: -122.4121, // ~1 km away
    },
    {
      email: 'maya.yoga@orbit.test',
      displayName: 'Maya Patel',
      username: 'maya_flow',
      bio: 'Yoga instructor & plant lover 🌿 Always down for weekend hikes and exploring local farmers markets.',
      profession: 'Wellness Coach',
      age: 25,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      lookingFor: ['Fitness Friends', 'Travel Friends', 'Study Partners'],
      interests: ['Yoga', 'Nature', 'Fitness', 'Reading', 'Travel'],
      hobbies: ['Gardening', 'Rock Climbing'],
      lat: 37.7654,
      lng: -122.4289, // ~1.5 km away
    },
    {
      email: 'liam.sound@orbit.test',
      displayName: 'Liam Torres',
      username: 'liam_beats',
      bio: 'Indie music producer & vinyl collector. Let’s trade album recommendations or jam together.',
      profession: 'Sound Designer',
      age: 27,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      lookingFor: ['Creative Friends', 'New Friends', 'Just Chatting'],
      interests: ['Music', 'Podcasts', 'Movies', 'Photography'],
      hobbies: ['Guitar', 'Origami'],
      lat: 37.7891,
      lng: -122.4014, // ~2 km away
    },
  ];

  const defaultUserPassword = await bcrypt.hash('User@123', 10);

  for (const sample of sampleUsers) {
    const interestRecords = await prisma.interest.findMany({
      where: { name: { in: sample.interests } },
    });
    const hobbyRecords = await prisma.hobby.findMany({
      where: { name: { in: sample.hobbies } },
    });

    const user = await prisma.user.upsert({
      where: { email: sample.email },
      update: {},
      create: {
        email: sample.email,
        passwordHash: defaultUserPassword,
        isEmailVerified: true,
        isActive: true,
        profile: {
          create: {
            displayName: sample.displayName,
            username: sample.username,
            bio: sample.bio,
            profession: sample.profession,
            age: sample.age,
            avatarUrl: sample.avatarUrl,
            lookingFor: sample.lookingFor,
            profileCompleteness: 95,
            interests: {
              create: interestRecords.map((i) => ({ interestId: i.id })),
            },
            hobbies: {
              create: hobbyRecords.map((h) => ({ hobbyId: h.id })),
            },
          },
        },
        location: {
          create: {
            latitude: sample.lat,
            longitude: sample.lng,
            city: 'San Francisco',
            country: 'United States',
            discoveryEnabled: true,
          },
        },
        privacySettings: { create: {} },
        locationPreference: {
          create: {
            nearbyVisibility: 'EVERYONE',
            distanceDisplay: 'EXACT',
            discoveryEnabled: true,
            maxDiscoveryRadiusKm: 25,
          },
        },
      },
    });
  }

  console.log('✅ Orbit database seeded successfully with interests, hobbies, admin, and nearby test users!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
