import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Download,
  FileText,
  MapPin,
  Phone,
  Star,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import type { WebsiteData, WebsiteType } from "@/lib/cms-data";

type Props = {
  data: WebsiteData;
  websiteType: WebsiteType;
  device?: "desktop" | "tablet" | "mobile";
  onNavigateSection?: (sectionId: string) => void;
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-brand-deep">
      {children}
    </h2>
  );
}

export function WebsitePreview({
  data,
  websiteType,
  device = "desktop",
  onNavigateSection,
}: Props) {
  const [slide, setSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const images = data.hero.images.filter(Boolean);
  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, [images.length]);

  const isAcademy = websiteType === "sub-academy";
  const isMobile = device === "mobile";
  const isTablet = device === "tablet";

  const grid3 = isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3";
  const grid2 = isMobile ? "grid-cols-1" : "grid-cols-2";

  const events = data.events.filter((e) => e.active);
  const downloads = data.downloads.filter((d) => d.active);
  const exp = data.experiences.filter((e) => e.active);
  const explore = data.explore.items.filter((e) => e.active);

  const navLinks = useMemo(() => {
    const links: { id: string; label: string }[] = [
      { id: "about", label: "About" },
    ];
    if (!isAcademy && explore.length > 0) {
      links.push({ id: "explore", label: "Districts" });
    }
    if (data.gallery.length > 0) {
      links.push({ id: "gallery", label: "Gallery" });
    }
    if (isAcademy && data.facilities.length > 0) {
      links.push({ id: "facilities", label: "Facilities" });
    }
    if (events.length > 0) {
      links.push({ id: "events", label: "Events" });
    }
    if (downloads.length > 0) {
      links.push({ id: "downloads", label: "Downloads" });
    }
    if (isAcademy && exp.length > 0) {
      links.push({ id: "experiences", label: "Experiences" });
    }
    links.push({ id: "location", label: "Contact" });
    return links;
  }, [isAcademy, explore.length, data.gallery.length, data.facilities.length, events.length, downloads.length, exp.length]);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    const scrollContainer = document.getElementById("pv-scroll-container");
    const target = document.getElementById(`pv-${sectionId}`);
    if (scrollContainer && target) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const targetScrollTop = targetRect.top - containerRect.top + scrollContainer.scrollTop;
      scrollContainer.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });
    }
    onNavigateSection?.(sectionId);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground overflow-hidden select-none">
      {/* ─── FIXED WEBSITE HEADER (ALWAYS VISIBLE AT TOP) ─── */}
      <header className="shrink-0 z-20 border-b bg-card/95 backdrop-blur-sm px-4 sm:px-6 py-3 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-2.5 text-left group hover:opacity-90 transition-opacity cursor-pointer"
          >
            {data.navbar.logoUrl ? (
              <img
                src={data.navbar.logoUrl}
                alt="Logo"
                className="size-8 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="size-8 rounded-full bg-brand-soft text-brand flex items-center justify-center font-bold text-xs">
                {data.navbar.shortName?.slice(0, 2) || "KS"}
              </div>
            )}
            <span className="font-display text-base sm:text-lg font-extrabold uppercase text-brand-deep tracking-tight">
              {data.navbar.shortName || "Academy"}
            </span>
          </button>

          {/* Desktop & Tablet Navigation */}
          {!isMobile ? (
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-brand-soft hover:text-brand transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-3 flex flex-col gap-1 border-t border-border pt-2 pb-1 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="flex items-center justify-between rounded-md px-3 py-2 text-left text-xs font-semibold text-foreground hover:bg-brand-soft hover:text-brand transition-colors cursor-pointer"
              >
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Mobile Quick-Jump Chips Bar */}
        {isMobile && (
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 -mx-4 px-4 scrollbar-none border-t border-border/50">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-foreground/80 hover:border-brand hover:bg-brand-soft hover:text-brand transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ─── DEDICATED SCROLLABLE WEBSITE CONTENT AREA (ONLY THIS SCROLLS) ─── */}
      <div
        id="pv-scroll-container"
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        {/* Hero Section */}
        <section
          id="pv-hero"
          className={`relative overflow-hidden bg-brand-deep text-brand-foreground ${
            isMobile ? "h-64 p-5" : isTablet ? "h-72 p-7" : "h-84 p-9"
          } flex flex-col justify-end`}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
                i === slide % images.length ? "opacity-55" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-display font-black uppercase leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-md">
              {data.hero.title || "Academy Title"}
            </h1>
            <p className="mt-2 text-xs sm:text-sm md:text-base font-medium text-white/90 drop-shadow-sm max-w-lg">
              {data.hero.subtitle || "Academy Subtitle"}
            </p>
          </div>
        </section>

        {/* About Section */}
        <section
          id="pv-about"
          className={`grid ${grid2} items-center gap-6 ${isMobile ? "p-4" : "p-6 sm:p-8"}`}
        >
          <div className="space-y-3">
            <H2>{data.about.title || "About Us"}</H2>
            <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {data.about.description}
            </p>
          </div>
          {data.about.image && (
            <div className="overflow-hidden rounded-xl border border-border shadow-xs">
              <img
                src={data.about.image}
                alt={data.about.title}
                className="aspect-video w-full max-w-full object-cover hover:scale-102 transition-transform duration-300"
              />
            </div>
          )}
        </section>

        {/* Explore Districts / Academies (State/District Only) */}
        {!isAcademy && explore.length > 0 && (
          <section
            id="pv-explore"
            className={`bg-surface ${isMobile ? "p-4" : "p-6 sm:p-8"}`}
          >
            <div className="mb-4">
              <H2>{data.explore.title || "Districts & Academies"}</H2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {data.explore.subtitle}
              </p>
            </div>
            <div className={`grid ${grid3} gap-3 sm:gap-4`}>
              {explore.map((x) => (
                <div
                  key={x.id}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs"
                >
                  <div>
                    {x.logoUrl ? (
                      <img
                        src={x.logoUrl}
                        alt={x.name}
                        className="mb-2 size-10 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="mb-2 size-10 rounded-full bg-brand-soft text-brand flex items-center justify-center font-bold text-xs">
                        {x.name?.slice(0, 2) || "AC"}
                      </div>
                    )}
                    <p className="font-semibold text-sm">{x.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {x.description}
                    </p>
                  </div>
                  {x.websiteUrl && (
                    <div className="mt-3 pt-2 border-t border-border/60">
                      <a
                        href={x.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline transition-colors cursor-pointer"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {data.gallery.length > 0 && (
          <section
            id="pv-gallery"
            className={`${isMobile ? "p-4" : "p-6 sm:p-8"}`}
          >
            <div className="mb-4">
              <H2>Gallery</H2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Highlights and training moments
              </p>
            </div>
            <div className={`grid ${grid3} gap-3 sm:gap-4`}>
              {data.gallery.map((g) => (
                <figure
                  key={g.id}
                  className="group overflow-hidden rounded-xl border border-border bg-card shadow-xs"
                >
                  {g.image && (
                    <div className="aspect-4/3 w-full overflow-hidden bg-muted">
                      <img
                        src={g.image}
                        alt={g.title}
                        className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <figcaption className="p-3">
                    <p className="text-xs sm:text-sm font-semibold">{g.title}</p>
                    {g.description && (
                      <p className="mt-1 text-[11.5px] text-muted-foreground">
                        {g.description}
                      </p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Facilities Section (Sub-Academy Only) */}
        {isAcademy && data.facilities.length > 0 && (
          <section
            id="pv-facilities"
            className={`bg-surface ${isMobile ? "p-4" : "p-6 sm:p-8"}`}
          >
            <div className="mb-4">
              <H2>Facilities</H2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                State-of-the-art training infrastructure
              </p>
            </div>
            <div className={`grid ${grid3} gap-3 sm:gap-4`}>
              {data.facilities.map((f) => (
                <div
                  key={f.id}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-xs"
                >
                  {f.image && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={f.image}
                        alt={f.title}
                        className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6">
                    <span className="rounded-md bg-brand px-2.5 py-1 text-[11px] font-bold text-brand-foreground shadow-xs">
                      {f.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Events Section */}
        {events.length > 0 && (
          <section
            id="pv-events"
            className={`${isMobile ? "p-4" : "p-6 sm:p-8"}`}
          >
            <div className="mb-4">
              <H2>Upcoming Events</H2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Competitions, trials, and training schedules
              </p>
            </div>
            <div className={`grid ${grid2} gap-3 sm:gap-4`}>
              {events.map((e) => (
                <div
                  key={e.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm">{e.title}</p>
                      <span className="rounded bg-brand-soft px-2 py-0.5 text-[10.5px] font-bold text-brand">
                        {e.date}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {e.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-border/60 flex flex-wrap items-center gap-3 text-[11px] font-medium text-brand">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3 shrink-0" />
                      {e.date}
                    </span>
                    {e.startTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 shrink-0" />
                        {e.startTime} {e.endTime ? `– ${e.endTime}` : ""}
                      </span>
                    )}
                    {e.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 shrink-0" />
                        {e.location}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Downloads Section */}
        {downloads.length > 0 && (
          <section
            id="pv-downloads"
            className={`bg-surface ${isMobile ? "p-4" : "p-6 sm:p-8"}`}
          >
            <div className="mb-4">
              <H2>Downloads & Official Documents</H2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Rulebooks, forms, circulars, and notices
              </p>
            </div>
            <div className={`grid ${grid2} gap-3 sm:gap-4`}>
              {downloads.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs hover:border-brand/50 transition-colors"
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand font-bold text-[10px]">
                    PDF
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm font-semibold text-foreground">
                      {d.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      <span className="font-semibold text-brand">{d.category}</span> · {d.fileSize || "PDF Document"}
                    </p>
                  </div>
                  <button
                    type="button"
                    title="Download File"
                    className="rounded-lg p-2 text-muted-foreground hover:bg-brand-soft hover:text-brand transition-colors cursor-pointer"
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Players' Experience Section (Sub-Academy Only) */}
        {isAcademy && exp.length > 0 && (
          <section
            id="pv-experiences"
            className={`${isMobile ? "p-4" : "p-6 sm:p-8"}`}
          >
            <div className="mb-4">
              <H2>Players' Experience</H2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                What our shooters and athletes say
              </p>
            </div>
            <div className={`grid ${grid3} gap-3 sm:gap-4`}>
              {exp.map((x) => (
                <div
                  key={x.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      {x.image ? (
                        <img
                          src={x.image}
                          alt={x.name}
                          className="size-9 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="size-9 rounded-full bg-brand-soft text-brand flex items-center justify-center font-bold text-xs">
                          {x.name?.slice(0, 2) || "P"}
                        </div>
                      )}
                      <div>
                        <p className="text-xs sm:text-sm font-semibold">{x.name}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-3 ${
                                i < x.rating
                                  ? "fill-warning text-warning"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground italic leading-relaxed">
                      "{x.experience}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Location & Contact Section */}
        <section
          id="pv-location"
          className={`bg-surface border-t border-border ${isMobile ? "p-4" : "p-6 sm:p-8"}`}
        >
          <div className="mb-4">
            <H2>Location & Contact</H2>
          </div>
          <div className={`grid ${grid2} gap-6 items-start`}>
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
                <p className="text-xs font-bold uppercase text-brand tracking-wider">
                  Visit Academy
                </p>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <MapPin className="size-4 shrink-0 text-brand mt-0.5" />
                  <span className="text-foreground leading-relaxed">
                    {data.location.address || "Address not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                  <Phone className="size-4 shrink-0 text-brand" />
                  <span className="text-foreground font-medium">
                    {data.location.contactNumber || "Phone not provided"}
                  </span>
                </div>
                {(data.location.mapUrl || data.location.address) && (
                  <div className="pt-2">
                    <a
                      href={
                        data.location.mapUrl && data.location.mapUrl !== "https://maps.google.com"
                          ? data.location.mapUrl
                          : data.location.latitude && data.location.longitude
                            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location.latitude)},${encodeURIComponent(data.location.longitude)}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location.address || "Kerala State Rifle Association")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-deep hover:underline transition-colors cursor-pointer"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Public Contact Form Simulation */}
              <div id="pv-contact" className="rounded-xl border border-border bg-card p-4 space-y-3">
                <p className="text-xs font-bold uppercase text-brand tracking-wider">
                  Get In Touch
                </p>
                <div className="space-y-2">
                  <div className="rounded-md border border-input bg-background/50 px-3 py-1.5 text-xs text-muted-foreground">
                    Your Full Name
                  </div>
                  <div className="rounded-md border border-input bg-background/50 px-3 py-1.5 text-xs text-muted-foreground">
                    Email Address
                  </div>
                  <div className="rounded-md border border-input bg-background/50 px-3 py-1.5 text-xs text-muted-foreground">
                    Message / Inquiry
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-md bg-brand py-2 text-xs font-semibold text-brand-foreground hover:bg-brand-deep transition-colors cursor-pointer"
                  >
                    Send Inquiry
                  </button>
                </div>
              </div>
            </div>

            {data.location.mapImage ? (
              <div className="overflow-hidden rounded-xl border border-border shadow-xs">
                <img
                  src={data.location.mapImage}
                  alt="Map Location"
                  className="aspect-video w-full max-w-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-xl border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center p-4 text-center">
                <MapPin className="size-6 text-muted-foreground mb-1" />
                <span className="text-xs font-medium text-foreground">Interactive Map Area</span>
                <span className="text-[11px] text-muted-foreground">
                  {data.location.address ? data.location.address.slice(0, 50) + "..." : "Map preview"}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Footer Section */}
        <footer
          id="pv-footer"
          className="bg-brand-deep px-5 sm:px-8 py-8 text-xs sm:text-sm text-brand-foreground/90 border-t border-white/10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg sm:text-xl font-extrabold uppercase text-white">
                {data.navbar.shortName || "Academy"}
              </p>
              <p className="mt-1 opacity-80 max-w-sm leading-relaxed">
                {data.footer.address || data.location.address}
              </p>
              <p className="mt-1 font-semibold text-white/90">
                Tel: {data.footer.contactNumber || data.location.contactNumber}
              </p>
            </div>
            <div className="text-right sm:text-right">
              <p className="text-[11px] opacity-70">
                © {new Date().getFullYear()} {data.navbar.shortName || "KSRA Academy"}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
