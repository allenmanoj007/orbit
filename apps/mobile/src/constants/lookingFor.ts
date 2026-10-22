export interface LookingForOption {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

export const LOOKING_FOR_OPTIONS: LookingForOption[] = [
  {
    id: 'new_friends',
    title: 'New Friends',
    emoji: '👋',
    description: 'Casual meetups, coffee, hanging out and exploring the area.',
  },
  {
    id: 'gaming_friends',
    title: 'Gaming Friends',
    emoji: '🎮',
    description: 'PC, console, tabletop or mobile gaming partners.',
  },
  {
    id: 'study_partners',
    title: 'Study Partners',
    emoji: '📚',
    description: 'Coworking, library sessions, and skill accountability.',
  },
  {
    id: 'travel_friends',
    title: 'Travel & Day Trips',
    emoji: '✈️',
    description: 'Weekend road trips, hiking trails, and new adventures.',
  },
  {
    id: 'fitness_friends',
    title: 'Fitness & Gym Buddies',
    emoji: '💪',
    description: 'Running, lifting, yoga classes, or cycling partners.',
  },
  {
    id: 'creative_friends',
    title: 'Creative Collaborators',
    emoji: '🎨',
    description: 'Designers, musicians, artists, and creators making cool things.',
  },
  {
    id: 'professional_networking',
    title: 'Professional Networking',
    emoji: '💼',
    description: 'Connect with local professionals in tech, design, and business.',
  },
  {
    id: 'local_community',
    title: 'Local Community',
    emoji: '🏘️',
    description: 'Get involved in neighborhood events and volunteering.',
  },
];
