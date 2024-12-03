// Array of predefined Google Meet links
export const MEET_LINKS = [
  "https://meet.google.com/abc-defg-hij",
  "https://meet.google.com/klm-nopq-rst",
  "https://meet.google.com/uvw-xyz1-234",
  "https://meet.google.com/567-890a-bcd",
  "https://meet.google.com/efg-hijk-lmn"
];

let currentLinkIndex = 0;

export function getNextMeetLink(): string {
  const link = MEET_LINKS[currentLinkIndex];
  currentLinkIndex = (currentLinkIndex + 1) % MEET_LINKS.length;
  return link;
} 