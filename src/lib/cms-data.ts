import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import facility1 from "@/assets/facility-1.jpg";
import player1 from "@/assets/player-1.jpg";

export type WebsiteType = "sub-academy" | "state" | "district";

export type GalleryItem = {
  id: string;
  image: string;
  title: string;
  description: string;
};

export type FacilityItem = {
  id: string;
  image: string;
  title: string;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  locationUrl: string;
  date: string;
  startTime: string;
  endTime: string;
  active: boolean;
};

export type DownloadCategory = "RULES" | "FORM" | "DOCUMENT";

export type DownloadItem = {
  id: string;
  title: string;
  description: string;
  category: DownloadCategory;
  fileName: string;
  fileSize: string;
  active: boolean;
};

export type ExperienceItem = {
  id: string;
  name: string;
  image: string;
  experience: string;
  rating: number;
  active: boolean;
};

export type ExploreItem = {
  id: string;
  logoUrl: string;
  name: string;
  description: string;
  websiteUrl: string;
  active: boolean;
};

export type WebsiteData = {
  navbar: { logoUrl: string; shortName: string };
  hero: { title: string; subtitle: string; images: string[] };
  about: { title: string; description: string; image: string };
  explore: { title: string; subtitle: string; items: ExploreItem[] };
  gallery: GalleryItem[];
  facilities: FacilityItem[];
  events: EventItem[];
  downloads: DownloadItem[];
  experiences: ExperienceItem[];
  location: {
    mapImage: string;
    mapUrl: string;
    address: string;
    contactNumber: string;
    latitude: string;
    longitude: string;
  };
  footer: {
    address: string;
    contactNumber: string;
    youtubeUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    twitterUrl: string;
  };
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const initialData: WebsiteData = {
  navbar: { logoUrl: "", shortName: "KSA" },
  hero: {
    title: "Kerala SA",
    subtitle: "Train. Compete. Excel",
    images: [hero1, hero2, facility1, hero1],
  },
  about: {
    title: "About Us",
    description:
      "A state-recognised shooting academy training young athletes with certified coaches and modern ranges.",
    image: hero2,
  },
  explore: {
    title: "Districts",
    subtitle: "Explore our network",
    items: [
      {
        id: uid(),
        logoUrl: "",
        name: "Ernakulam",
        description: "District academy with two indoor ranges",
        websiteUrl: "https://example.org/ernakulam",
        active: true,
      },
      {
        id: uid(),
        logoUrl: "",
        name: "Thrissur",
        description: "Rifle and pistol coaching for juniors",
        websiteUrl: "https://example.org/thrissur",
        active: true,
      },
    ],
  },
  gallery: [
    {
      id: uid(),
      image: hero1,
      title: "Range Day",
      description: "Juniors at the 10m air rifle range",
    },
    {
      id: uid(),
      image: hero2,
      title: "Field Camp",
      description: "Morning conditioning on the field",
    },
    {
      id: uid(),
      image: facility1,
      title: "Strength",
      description: "Strength block inside the gym",
    },
  ],
  facilities: [
    { id: uid(), image: hero1, title: "Shooting Range" },
    { id: uid(), image: facility1, title: "Fitness Center" },
    { id: uid(), image: hero2, title: "Training Hall" },
  ],
  events: [
    {
      id: uid(),
      title: "State Trials",
      description: "Open selection rounds",
      location: "Central Range, Kochi",
      locationUrl: "https://maps.google.com",
      date: "2026-10-12",
      startTime: "09:00",
      endTime: "17:00",
      active: true,
    },
    {
      id: uid(),
      title: "Junior Camp",
      description: "Two week coaching camp",
      location: "Academy Campus",
      locationUrl: "",
      date: "2026-11-02",
      startTime: "07:30",
      endTime: "12:00",
      active: true,
    },
  ],
  downloads: [
    {
      id: uid(),
      title: "Competition Rules 2026",
      description: "Official rulebook for all state events",
      category: "RULES",
      fileName: "competition-rules-2026.pdf",
      fileSize: "1.8 MB",
      active: true,
    },
    {
      id: uid(),
      title: "Admission Form",
      description: "New athlete registration form",
      category: "FORM",
      fileName: "admission-form.pdf",
      fileSize: "420 KB",
      active: true,
    },
  ],
  experiences: [
    {
      id: uid(),
      name: "Arjun Menon",
      image: player1,
      experience:
        "The coaches rebuilt my technique from scratch. Two seasons later I qualified for the nationals.",
      rating: 5,
      active: true,
    },
  ],
  location: {
    mapImage: "",
    mapUrl: "https://maps.google.com",
    address: "Sports Complex Road, Kaloor, Kochi, Kerala 682017",
    contactNumber: "9876543210",
    latitude: "9.9816",
    longitude: "76.2999",
  },
  footer: {
    address: "Sports Complex Road, Kaloor, Kochi, Kerala 682017",
    contactNumber: "9876543210",
    youtubeUrl: "https://youtube.com",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    twitterUrl: "",
  },
};

/* ---------- validation helpers ---------- */

export function lengthError(
  value: string,
  opts: { required?: boolean; min?: number; max?: number; label?: string },
): string | null {
  const v = value.trim();
  if (opts.required && !v) return "This field is required";
  if (!v) return null;
  if (opts.min && opts.max && (v.length < opts.min || v.length > opts.max))
    return `${opts.min}–${opts.max} characters required`;
  if (opts.min && !opts.max && v.length < opts.min)
    return `Minimum ${opts.min} characters`;
  if (opts.max && v.length > opts.max) return `Maximum ${opts.max} characters`;
  return null;
}

export function urlError(value: string, required = false): string | null {
  const v = value.trim();
  if (!v) return required ? "This field is required" : null;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:"
      ? null
      : "Enter a valid URL";
  } catch {
    return "Enter a valid URL";
  }
}

export function phoneError(value: string, required = true): string | null {
  const v = value.trim();
  if (!v) return required ? "This field is required" : null;
  return /^\d{10}$/.test(v) ? null : "Enter a valid 10-digit number";
}

export function moveItem<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

export const SECTIONS: Record<WebsiteType, { id: string; label: string }[]> = {
  "sub-academy": [
    { id: "basic", label: "Basic Information" },
    { id: "hero", label: "Hero" },
    { id: "about", label: "About" },
    { id: "gallery", label: "Gallery" },
    { id: "facilities", label: "Facilities" },
    { id: "events", label: "Events" },
    { id: "downloads", label: "Downloads" },
    { id: "experiences", label: "Players' Experience" },
    { id: "location", label: "Location" },
    { id: "contact", label: "Contact Us" },
    { id: "footer", label: "Footer" },
  ],
  state: [
    { id: "basic", label: "Basic Information" },
    { id: "hero", label: "Hero" },
    { id: "about", label: "About" },
    { id: "explore", label: "Explore Districts / Academies" },
    { id: "gallery", label: "Gallery" },
    { id: "events", label: "Events" },
    { id: "downloads", label: "Downloads" },
    { id: "location", label: "Location" },
    { id: "contact", label: "Contact Us" },
    { id: "footer", label: "Footer" },
  ],
  district: [
    { id: "basic", label: "Basic Information" },
    { id: "hero", label: "Hero" },
    { id: "about", label: "About" },
    { id: "explore", label: "Explore Districts / Academies" },
    { id: "gallery", label: "Gallery" },
    { id: "events", label: "Events" },
    { id: "downloads", label: "Downloads" },
    { id: "location", label: "Location" },
    { id: "contact", label: "Contact Us" },
    { id: "footer", label: "Footer" },
  ],
};
