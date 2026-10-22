export interface InterestOption {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

export const INTEREST_OPTIONS: InterestOption[] = [
  { id: '1', name: 'Gaming', emoji: '🎮', category: 'Entertainment' },
  { id: '2', name: 'Music', emoji: '🎵', category: 'Creative' },
  { id: '3', name: 'Photography', emoji: '📷', category: 'Creative' },
  { id: '4', name: 'Travel', emoji: '✈️', category: 'Lifestyle' },
  { id: '5', name: 'Fitness', emoji: '💪', category: 'Health' },
  { id: '6', name: 'Reading', emoji: '📚', category: 'Intellectual' },
  { id: '7', name: 'Cooking', emoji: '🍳', category: 'Food' },
  { id: '8', name: 'Art', emoji: '🎨', category: 'Creative' },
  { id: '9', name: 'Technology', emoji: '💻', category: 'Intellectual' },
  { id: '10', name: 'Movies', emoji: '🎬', category: 'Entertainment' },
  { id: '11', name: 'Sports', emoji: '⚽', category: 'Health' },
  { id: '12', name: 'Dancing', emoji: '💃', category: 'Creative' },
  { id: '13', name: 'Yoga', emoji: '🧘', category: 'Health' },
  { id: '14', name: 'Nature', emoji: '🌿', category: 'Lifestyle' },
  { id: '15', name: 'Coffee', emoji: '☕', category: 'Food' },
  { id: '16', name: 'Coding', emoji: '⌨️', category: 'Technology' },
  { id: '17', name: 'Design', emoji: '✏️', category: 'Creative' },
  { id: '18', name: 'Podcasts', emoji: '🎙️', category: 'Intellectual' },
  { id: '19', name: 'Cycling', emoji: '🚴', category: 'Health' },
  { id: '20', name: 'Hiking', emoji: '🥾', category: 'Outdoors' },
];

export const HOBBY_OPTIONS = [
  { id: 'h1', name: 'Guitar', emoji: '🎸' },
  { id: 'h2', name: 'Gardening', emoji: '🌱' },
  { id: 'h3', name: 'Baking', emoji: '🧁' },
  { id: 'h4', name: 'Running', emoji: '🏃' },
  { id: 'h5', name: 'Chess', emoji: '♟️' },
  { id: 'h6', name: 'Painting', emoji: '🖌️' },
  { id: 'h7', name: 'Rock Climbing', emoji: '🧗' },
  { id: 'h8', name: 'Camping', emoji: '⛺' },
];
