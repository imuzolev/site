/**
 * Central content source for the site. Keeping copy + specs here keeps the
 * section components presentational and easy to re-theme.
 */

export type Spec = {
  label: string;
  value: string;
  unit?: string;
};

export type Drone = {
  id: string;
  name: string;
  codename: string;
  category: "FPV" | "Military" | "Civilian";
  tagline: string;
  video: string;
  poster?: string;
  specs: Spec[];
};

export const SHOWCASE: Drone = {
  id: "vortex-x1",
  name: "VORTEX X-1",
  codename: "Sky Predator",
  category: "FPV",
  tagline:
    "A carbon-fiber FPV interceptor engineered for sub-second response and absolute aerial dominance.",
  video: "/videos/showcase.mp4",
  poster: "/videos/posters/showcase.jpg",
  specs: [
    { label: "Top Speed", value: "187", unit: "km/h" },
    { label: "Flight Time", value: "42", unit: "min" },
    { label: "Range", value: "16", unit: "km" },
    { label: "Max Altitude", value: "6000", unit: "m" },
    { label: "Sensor Suite", value: "8K / Thermal" },
    { label: "Payload", value: "2.4", unit: "kg" },
  ],
};

export const TECHNOLOGY = [
  {
    title: "AI Navigation",
    description:
      "Neural pathfinding computes optimal trajectories in real time across dynamic terrain.",
    accent: "#00D1FF",
  },
  {
    title: "Thermal Vision",
    description:
      "Radiometric thermal imaging detects heat signatures through smoke, fog and darkness.",
    accent: "#00FFE5",
  },
  {
    title: "Autonomous Flight",
    description:
      "Mission-grade autonomy executes complex flight plans without operator input.",
    accent: "#8B5CF6",
  },
  {
    title: "FPV Control",
    description:
      "Ultra-low-latency digital link delivers a true first-person cockpit experience.",
    accent: "#00D1FF",
  },
  {
    title: "Obstacle Avoidance",
    description:
      "360° LiDAR fusion maps surroundings and reroutes around threats instantly.",
    accent: "#00FFE5",
  },
  {
    title: "Computer Vision",
    description:
      "On-board inference tracks, classifies and locks targets at the edge.",
    accent: "#8B5CF6",
  },
] as const;

export const GALLERY = [
  { id: "g1", title: "Mountain Recon", location: "Alps · 4200m", video: "/videos/gallery-1.mp4" },
  { id: "g2", title: "Night Operation", location: "Classified", video: "/videos/gallery-2.mp4" },
  { id: "g3", title: "Coastal Patrol", location: "North Sea", video: "/videos/gallery-3.mp4" },
  { id: "g4", title: "Urban Survey", location: "Sector 7", video: "/videos/gallery-4.mp4" },
  { id: "g5", title: "Desert Strike", location: "Grid 19-A", video: "/videos/gallery-5.mp4" },
] as const;

export const STATS = [
  { value: 250, suffix: "+", label: "Missions Completed" },
  { value: 98, suffix: "%", label: "Success Rate" },
  { value: 120, suffix: "km/h", label: "Average Cruise" },
  { value: 24, suffix: "/7", label: "AI Navigation" },
] as const;

export const TIMELINE = [
  {
    year: "2019",
    title: "Genesis",
    description: "First autonomous FPV prototype achieves stable computer-vision lock.",
  },
  {
    year: "2021",
    title: "Thermal Fusion",
    description: "Radiometric thermal core integrated into the flight stack.",
  },
  {
    year: "2023",
    title: "Swarm Protocol",
    description: "Coordinated multi-unit autonomy validated across 32 airframes.",
  },
  {
    year: "2024",
    title: "Edge Intelligence",
    description: "On-board neural inference removes dependence on ground stations.",
  },
  {
    year: "2026",
    title: "Vortex Line",
    description: "Carbon interceptor platform reaches full production readiness.",
  },
] as const;

export const FLEET: Drone[] = [
  {
    id: "raptor",
    name: "RAPTOR",
    codename: "RPT-9",
    category: "Military",
    tagline: "Long-endurance ISR platform.",
    video: "/videos/fleet-1.mp4",
    specs: [
      { label: "Endurance", value: "11h" },
      { label: "Ceiling", value: "9km" },
    ],
  },
  {
    id: "wasp",
    name: "WASP",
    codename: "WSP-3",
    category: "FPV",
    tagline: "Micro-class agile interceptor.",
    video: "/videos/fleet-2.mp4",
    specs: [
      { label: "Speed", value: "210km/h" },
      { label: "Weight", value: "480g" },
    ],
  },
  {
    id: "atlas",
    name: "ATLAS",
    codename: "ATL-7",
    category: "Civilian",
    tagline: "Heavy-lift survey & mapping.",
    video: "/videos/fleet-3.mp4",
    specs: [
      { label: "Payload", value: "8kg" },
      { label: "Range", value: "22km" },
    ],
  },
  {
    id: "spectre",
    name: "SPECTRE",
    codename: "SPC-1",
    category: "Military",
    tagline: "Low-observable night operator.",
    video: "/videos/fleet-4.mp4",
    specs: [
      { label: "Signature", value: "Stealth" },
      { label: "Sensor", value: "Thermal" },
    ],
  },
  {
    id: "falcon",
    name: "FALCON",
    codename: "FLC-5",
    category: "Civilian",
    tagline: "Inspection & infrastructure.",
    video: "/videos/fleet-5.mp4",
    specs: [
      { label: "Zoom", value: "200x" },
      { label: "Time", value: "55min" },
    ],
  },
  {
    id: "nova",
    name: "NOVA",
    codename: "NVA-8",
    category: "FPV",
    tagline: "Cinematic aerial cinema rig.",
    video: "/videos/fleet-6.mp4",
    specs: [
      { label: "Camera", value: "8K60" },
      { label: "Gimbal", value: "3-axis" },
    ],
  },
];

export const SOCIALS = [
  { label: "Email", href: "mailto:contact@cortexis.tech", handle: "contact@cortexis.tech" },
  { label: "GitHub", href: "https://github.com", handle: "github.com/cortexis" },
  { label: "Telegram", href: "https://telegram.org", handle: "@cortexis" },
];

export const NAV_LINKS = [
  { label: "Showcase", href: "#showcase" },
  { label: "Technology", href: "#technology" },
  { label: "Gallery", href: "#gallery" },
  { label: "Fleet", href: "#fleet" },
  { label: "Contact", href: "#contact" },
];
