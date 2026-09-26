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
  navbar: { logoUrl: hero1, shortName: "KSA" },
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
      description: "Juniors at the 10m air rifle",
    },
    {
      id: uid(),
      image: hero2,
      title: "Field Camp",
      description: "Morning fitness on the field",
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
      description: "Open selection round",
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
      description: "Two week coaching",
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
  value: string | undefined | null,
  opts: { required?: boolean; min?: number; max?: number; label?: string },
): string | null {
  const v = (value || "").trim();
  if (opts.required && !v) return "This field is required";
  if (!v) return null;
  if (opts.min && opts.max && (v.length < opts.min || v.length > opts.max))
    return `${opts.min}–${opts.max} characters required`;
  if (opts.min && !opts.max && v.length < opts.min)
    return `Minimum ${opts.min} characters`;
  if (opts.max && v.length > opts.max) return `Maximum ${opts.max} characters`;
  return null;
}

export function urlError(value: string | undefined | null, required = false): string | null {
  const v = (value || "").trim();
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

export function phoneError(value: string | undefined | null, required = true): string | null {
  const v = (value || "").trim();
  if (!v) return required ? "This field is required" : null;
  return /^\d{10}$/.test(v) ? null : "Enter a valid 10-digit number";
}

export function moveItem<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item as T);
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

export type ValidationError = {
  key: string;
  sectionId: string;
  sectionLabel: string;
  fieldLabel: string;
  message: string;
  elementId: string;
};

export function validateWebsite(
  data: WebsiteData,
  websiteType: WebsiteType,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const isAcademy = websiteType === "sub-academy";

  // 1. BASIC INFORMATION
  if (!data.navbar?.logoUrl?.trim()) {
    errors.push({
      key: "navbar.logoUrl",
      sectionId: "basic",
      sectionLabel: "Basic Information",
      fieldLabel: "Logo",
      message: "Logo is required",
      elementId: "field-navbar-logoUrl",
    });
  }
  const shortNameErr = lengthError(data.navbar?.shortName, { required: true, max: 10 });
  if (shortNameErr) {
    errors.push({
      key: "navbar.shortName",
      sectionId: "basic",
      sectionLabel: "Basic Information",
      fieldLabel: "Short Name",
      message: shortNameErr,
      elementId: "field-navbar-shortName",
    });
  }

  // 2. HERO
  const heroTitleErr = lengthError(data.hero?.title, { required: true, max: 10 });
  if (heroTitleErr) {
    errors.push({
      key: "hero.title",
      sectionId: "hero",
      sectionLabel: "Hero",
      fieldLabel: "Hero Title",
      message: heroTitleErr,
      elementId: "field-hero-title",
    });
  }
  const heroSubtitleErr = lengthError(data.hero?.subtitle, { required: true, min: 15, max: 20 });
  if (heroSubtitleErr) {
    errors.push({
      key: "hero.subtitle",
      sectionId: "hero",
      sectionLabel: "Hero",
      fieldLabel: "Hero Subtitle",
      message: heroSubtitleErr,
      elementId: "field-hero-subtitle",
    });
  }
  const heroImgCount = (data.hero?.images || []).filter(Boolean).length;
  if (heroImgCount !== 4) {
    errors.push({
      key: "hero.images",
      sectionId: "hero",
      sectionLabel: "Hero",
      fieldLabel: "Hero Images",
      message: "Exactly 4 images are required",
      elementId: "field-hero-images",
    });
  }

  // 3. ABOUT
  const aboutTitleErr = lengthError(data.about?.title, { required: true, max: 10 });
  if (aboutTitleErr) {
    errors.push({
      key: "about.title",
      sectionId: "about",
      sectionLabel: "About",
      fieldLabel: "About Title",
      message: aboutTitleErr,
      elementId: "field-about-title",
    });
  }
  const aboutDescErr = lengthError(data.about?.description, { required: true, min: 50, max: 100 });
  if (aboutDescErr) {
    errors.push({
      key: "about.description",
      sectionId: "about",
      sectionLabel: "About",
      fieldLabel: "About Description",
      message: aboutDescErr,
      elementId: "field-about-description",
    });
  }
  if (!data.about?.image?.trim()) {
    errors.push({
      key: "about.image",
      sectionId: "about",
      sectionLabel: "About",
      fieldLabel: "About Image",
      message: "An image is required",
      elementId: "field-about-image",
    });
  }

  // 4. EXPLORE (State/District only)
  if (!isAcademy && data.explore) {
    const expTitleErr = lengthError(data.explore.title, { required: true, max: 10 });
    if (expTitleErr) {
      errors.push({
        key: "explore.title",
        sectionId: "explore",
        sectionLabel: "Explore Districts / Academies",
        fieldLabel: "Section Title",
        message: expTitleErr,
        elementId: "field-explore-title",
      });
    }
    const expSubErr = lengthError(data.explore.subtitle, { required: true, min: 15, max: 20 });
    if (expSubErr) {
      errors.push({
        key: "explore.subtitle",
        sectionId: "explore",
        sectionLabel: "Explore Districts / Academies",
        fieldLabel: "Section Subtitle",
        message: expSubErr,
        elementId: "field-explore-subtitle",
      });
    }
    (data.explore.items || []).forEach((item, idx) => {
      const nameErr = lengthError(item.name, { required: true, max: 15 });
      if (nameErr) {
        errors.push({
          key: `explore.items.${item.id}.name`,
          sectionId: "explore",
          sectionLabel: "Explore Districts / Academies",
          fieldLabel: `Card #${idx + 1} Name`,
          message: nameErr,
          elementId: `field-explore-${item.id}-name`,
        });
      }
      const descErr = lengthError(item.description, { required: true, min: 30, max: 40 });
      if (descErr) {
        errors.push({
          key: `explore.items.${item.id}.description`,
          sectionId: "explore",
          sectionLabel: "Explore Districts / Academies",
          fieldLabel: `Card #${idx + 1} Description`,
          message: descErr,
          elementId: `field-explore-${item.id}-description`,
        });
      }
      const urlErr = urlError(item.websiteUrl);
      if (urlErr) {
        errors.push({
          key: `explore.items.${item.id}.websiteUrl`,
          sectionId: "explore",
          sectionLabel: "Explore Districts / Academies",
          fieldLabel: `Card #${idx + 1} Website URL`,
          message: urlErr,
          elementId: `field-explore-${item.id}-websiteUrl`,
        });
      }
    });
  }

  // 5. GALLERY
  (data.gallery || []).forEach((item, idx) => {
    if (!item.image?.trim()) {
      errors.push({
        key: `gallery.${item.id}.image`,
        sectionId: "gallery",
        sectionLabel: "Gallery",
        fieldLabel: `Gallery #${idx + 1} Image`,
        message: "An image is required",
        elementId: `field-gallery-${item.id}-image`,
      });
    }
    const titleErr = lengthError(item.title, { max: 10 });
    if (titleErr) {
      errors.push({
        key: `gallery.${item.id}.title`,
        sectionId: "gallery",
        sectionLabel: "Gallery",
        fieldLabel: `Gallery #${idx + 1} Title`,
        message: titleErr,
        elementId: `field-gallery-${item.id}-title`,
      });
    }
    if (item.description) {
      const descErr = lengthError(item.description, { min: 20, max: 30 });
      if (descErr) {
        errors.push({
          key: `gallery.${item.id}.description`,
          sectionId: "gallery",
          sectionLabel: "Gallery",
          fieldLabel: `Gallery #${idx + 1} Description`,
          message: descErr,
          elementId: `field-gallery-${item.id}-description`,
        });
      }
    }
  });

  // 6. FACILITIES (Sub-Academy only)
  if (isAcademy && data.facilities) {
    data.facilities.forEach((item, idx) => {
      if (!item.image?.trim()) {
        errors.push({
          key: `facilities.${item.id}.image`,
          sectionId: "facilities",
          sectionLabel: "Facilities",
          fieldLabel: `Facility #${idx + 1} Image`,
          message: "An image is required",
          elementId: `field-facilities-${item.id}-image`,
        });
      }
      const titleErr = lengthError(item.title, { required: true, min: 10, max: 15 });
      if (titleErr) {
        errors.push({
          key: `facilities.${item.id}.title`,
          sectionId: "facilities",
          sectionLabel: "Facilities",
          fieldLabel: `Facility #${idx + 1} Title`,
          message: titleErr,
          elementId: `field-facilities-${item.id}-title`,
        });
      }
    });
  }

  // 7. EVENTS
  (data.events || []).forEach((item, idx) => {
    const titleErr = lengthError(item.title, { required: true, max: 15 });
    if (titleErr) {
      errors.push({
        key: `events.${item.id}.title`,
        sectionId: "events",
        sectionLabel: "Events",
        fieldLabel: `Event #${idx + 1} Title`,
        message: titleErr,
        elementId: `field-events-${item.id}-title`,
      });
    }
    const descErr = lengthError(item.description, { required: true, max: 20 });
    if (descErr) {
      errors.push({
        key: `events.${item.id}.description`,
        sectionId: "events",
        sectionLabel: "Events",
        fieldLabel: `Event #${idx + 1} Description`,
        message: descErr,
        elementId: `field-events-${item.id}-description`,
      });
    }
    const locErr = lengthError(item.location, { required: true });
    if (locErr) {
      errors.push({
        key: `events.${item.id}.location`,
        sectionId: "events",
        sectionLabel: "Events",
        fieldLabel: `Event #${idx + 1} Location`,
        message: locErr,
        elementId: `field-events-${item.id}-location`,
      });
    }
    const urlErr = urlError(item.locationUrl);
    if (urlErr) {
      errors.push({
        key: `events.${item.id}.locationUrl`,
        sectionId: "events",
        sectionLabel: "Events",
        fieldLabel: `Event #${idx + 1} Location URL`,
        message: urlErr,
        elementId: `field-events-${item.id}-locationUrl`,
      });
    }
    if (!item.date?.trim()) {
      errors.push({
        key: `events.${item.id}.date`,
        sectionId: "events",
        sectionLabel: "Events",
        fieldLabel: `Event #${idx + 1} Date`,
        message: "Date is required",
        elementId: `field-events-${item.id}-date`,
      });
    }
    if (!item.startTime?.trim()) {
      errors.push({
        key: `events.${item.id}.startTime`,
        sectionId: "events",
        sectionLabel: "Events",
        fieldLabel: `Event #${idx + 1} Start Time`,
        message: "Start time is required",
        elementId: `field-events-${item.id}-startTime`,
      });
    }
  });

  // 8. DOWNLOADS
  (data.downloads || []).forEach((item, idx) => {
    const titleErr = lengthError(item.title, { required: true });
    if (titleErr) {
      errors.push({
        key: `downloads.${item.id}.title`,
        sectionId: "downloads",
        sectionLabel: "Downloads",
        fieldLabel: `Download #${idx + 1} Title`,
        message: titleErr,
        elementId: `field-downloads-${item.id}-title`,
      });
    }
    if (!item.fileName?.trim()) {
      errors.push({
        key: `downloads.${item.id}.fileName`,
        sectionId: "downloads",
        sectionLabel: "Downloads",
        fieldLabel: `Download #${idx + 1} PDF File`,
        message: "A PDF file is required",
        elementId: `field-downloads-${item.id}-fileName`,
      });
    }
  });

  // 9. EXPERIENCES (Sub-Academy only)
  if (isAcademy && data.experiences) {
    data.experiences.forEach((item, idx) => {
      const nameErr = lengthError(item.name, { required: true, min: 10, max: 15 });
      if (nameErr) {
        errors.push({
          key: `experiences.${item.id}.name`,
          sectionId: "experiences",
          sectionLabel: "Players' Experience",
          fieldLabel: `Experience #${idx + 1} Player Name`,
          message: nameErr,
          elementId: `field-experiences-${item.id}-name`,
        });
      }
      const expErr = lengthError(item.experience, { required: true });
      if (expErr) {
        errors.push({
          key: `experiences.${item.id}.experience`,
          sectionId: "experiences",
          sectionLabel: "Players' Experience",
          fieldLabel: `Experience #${idx + 1} Description`,
          message: expErr,
          elementId: `field-experiences-${item.id}-experience`,
        });
      }
    });
  }

  // 10. LOCATION
  const mapUrlErr = urlError(data.location?.mapUrl);
  if (mapUrlErr) {
    errors.push({
      key: "location.mapUrl",
      sectionId: "location",
      sectionLabel: "Location",
      fieldLabel: "Map URL",
      message: mapUrlErr,
      elementId: "field-location-mapUrl",
    });
  }
  const locAddrErr = lengthError(data.location?.address, { required: true, max: 100 });
  if (locAddrErr) {
    errors.push({
      key: "location.address",
      sectionId: "location",
      sectionLabel: "Location",
      fieldLabel: "Address",
      message: locAddrErr,
      elementId: "field-location-address",
    });
  }
  const locPhoneErr = phoneError(data.location?.contactNumber);
  if (locPhoneErr) {
    errors.push({
      key: "location.contactNumber",
      sectionId: "location",
      sectionLabel: "Location",
      fieldLabel: "Contact Number",
      message: locPhoneErr,
      elementId: "field-location-contactNumber",
    });
  }

  // 11. FOOTER
  const footAddrErr = lengthError(data.footer?.address, { required: true, max: 100 });
  if (footAddrErr) {
    errors.push({
      key: "footer.address",
      sectionId: "footer",
      sectionLabel: "Footer",
      fieldLabel: "Address",
      message: footAddrErr,
      elementId: "field-footer-address",
    });
  }
  const footPhoneErr = phoneError(data.footer?.contactNumber);
  if (footPhoneErr) {
    errors.push({
      key: "footer.contactNumber",
      sectionId: "footer",
      sectionLabel: "Footer",
      fieldLabel: "Contact Number",
      message: footPhoneErr,
      elementId: "field-footer-contactNumber",
    });
  }
  (["youtubeUrl", "facebookUrl", "instagramUrl", "twitterUrl"] as const).forEach((fKey) => {
    const err = urlError(data.footer?.[fKey]);
    if (err) {
      errors.push({
        key: `footer.${fKey}`,
        sectionId: "footer",
        sectionLabel: "Footer",
        fieldLabel: fKey.replace("Url", " URL"),
        message: err,
        elementId: `field-footer-${fKey}`,
      });
    }
  });

  return errors;
}
