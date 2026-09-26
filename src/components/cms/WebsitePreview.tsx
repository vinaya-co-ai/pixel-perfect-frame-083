import { useEffect, useState } from "react";
import { Calendar, Clock, Download, FileText, MapPin, Phone, Star } from "lucide-react";
import type { WebsiteData, WebsiteType } from "@/lib/cms-data";

type Props = { data: WebsiteData; websiteType: WebsiteType; compact: boolean };

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide text-brand-deep">
      {children}
    </h2>
  );
}

export function WebsitePreview({ data, websiteType, compact }: Props) {
  const [slide, setSlide] = useState(0);
  const images = data.hero.images.filter(Boolean);
  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, [images.length]);

  const isAcademy = websiteType === "sub-academy";
  const grid = compact ? "grid-cols-1" : "grid-cols-3";
  const grid2 = compact ? "grid-cols-1" : "grid-cols-2";
  const events = data.events.filter((e) => e.active);
  const downloads = data.downloads.filter((d) => d.active);
  const exp = data.experiences.filter((e) => e.active);
  const explore = data.explore.items.filter((e) => e.active);

  return (
    <div className="bg-background text-foreground">
      <nav className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-5 py-3">
        <div className="flex items-center gap-2">
          {data.navbar.logoUrl && (
            <img src={data.navbar.logoUrl} alt="" className="size-8 rounded-full object-cover" />
          )}
          <span className="font-display text-lg font-bold uppercase text-brand-deep">
            {data.navbar.shortName || "Academy"}
          </span>
        </div>
        {!compact && (
          <div className="flex gap-4 text-xs font-semibold text-muted-foreground">
            <span>About</span><span>Gallery</span><span>Events</span><span>Contact</span>
          </div>
        )}
      </nav>

      <section id="pv-hero" className="relative h-72 overflow-hidden bg-brand-deep">
        {images.map((src, i) => (
          <img key={i} src={src} alt="" className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${i === slide % images.length ? "opacity-60" : "opacity-0"}`} />
        ))}
        <div className="relative flex h-full flex-col justify-end p-6 text-brand-foreground">
          <h1 className="font-display text-4xl font-extrabold uppercase leading-none">{data.hero.title}</h1>
          <p className="mt-2 max-w-md text-sm opacity-90">{data.hero.subtitle}</p>
        </div>
      </section>

      <section id="pv-about" className={`grid ${grid2} items-center gap-6 p-6`}>
        <div>
          <H2>{data.about.title}</H2>
          <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{data.about.description}</p>
        </div>
        {data.about.image && <img src={data.about.image} alt="" className="aspect-video w-full rounded-lg object-cover" />}
      </section>

      {!isAcademy && explore.length > 0 && (
        <section id="pv-explore" className="bg-surface p-6">
          <H2>{data.explore.title}</H2>
          <p className="text-sm text-muted-foreground">{data.explore.subtitle}</p>
          <div className={`mt-4 grid ${grid} gap-3`}>
            {explore.map((x) => (
              <div key={x.id} className="rounded-lg border bg-card p-4">
                {x.logoUrl && <img src={x.logoUrl} alt="" className="mb-2 size-10 rounded-full object-cover" />}
                <p className="font-semibold">{x.name}</p>
                <p className="text-xs text-muted-foreground">{x.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.gallery.length > 0 && (
        <section id="pv-gallery" className="p-6">
          <H2>Gallery</H2>
          <div className={`mt-4 grid ${grid} gap-3`}>
            {data.gallery.map((g) => (
              <figure key={g.id} className="overflow-hidden rounded-lg border bg-card">
                {g.image && <img src={g.image} alt="" className="aspect-[4/3] w-full object-cover" />}
                <figcaption className="p-3 text-sm font-semibold">{g.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {isAcademy && data.facilities.length > 0 && (
        <section id="pv-facilities" className="bg-surface p-6">
          <H2>Facilities</H2>
          <div className={`mt-4 grid ${grid} gap-3`}>
            {data.facilities.map((f) => (
              <div key={f.id} className="relative overflow-hidden rounded-lg">
                {f.image && <img src={f.image} alt="" className="aspect-video w-full object-cover" />}
                <span className="absolute bottom-2 left-2 rounded bg-brand px-2 py-1 text-xs font-semibold text-brand-foreground">{f.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section id="pv-events" className="p-6">
          <H2>Events</H2>
          <div className="mt-4 space-y-3">
            {events.map((e) => (
              <div key={e.id} className="rounded-lg border bg-card p-4">
                <p className="font-semibold">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-brand">
                  <span className="flex items-center gap-1"><Calendar className="size-3" />{e.date}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3" />{e.startTime}–{e.endTime}</span>
                  <span className="flex items-center gap-1"><MapPin className="size-3" />{e.location}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {downloads.length > 0 && (
        <section id="pv-downloads" className="bg-surface p-6">
          <H2>Downloads</H2>
          <div className={`mt-4 grid ${grid2} gap-3`}>
            {downloads.map((d) => (
              <div key={d.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                <FileText className="size-6 text-brand" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{d.title}</p>
                  <p className="text-[11px] text-muted-foreground">{d.category} · {d.fileSize}</p>
                </div>
                <Download className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </section>
      )}

      {isAcademy && exp.length > 0 && (
        <section id="pv-experiences" className="p-6">
          <H2>Players' Experience</H2>
          <div className={`mt-4 grid ${grid} gap-3`}>
            {exp.map((x) => (
              <div key={x.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2">
                  {x.image && <img src={x.image} alt="" className="size-9 rounded-full object-cover" />}
                  <p className="text-sm font-semibold">{x.name}</p>
                </div>
                <div className="mt-2 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-3 ${i < x.rating ? "fill-warning text-warning" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">"{x.experience}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="pv-location" className={`grid ${grid2} gap-6 bg-surface p-6`}>
        <div>
          <H2>Find Us</H2>
          <p className="mt-3 flex gap-2 text-sm"><MapPin className="size-4 shrink-0 text-brand" />{data.location.address}</p>
          <p className="mt-2 flex gap-2 text-sm"><Phone className="size-4 text-brand" />{data.location.contactNumber}</p>
        </div>
        {data.location.mapImage && <img src={data.location.mapImage} alt="" className="aspect-video w-full rounded-lg object-cover" />}
      </section>

      <footer id="pv-footer" className="bg-brand-deep p-6 text-sm text-brand-foreground">
        <p className="font-display text-lg font-bold uppercase">{data.navbar.shortName}</p>
        <p className="mt-2 opacity-80">{data.footer.address}</p>
        <p className="opacity-80">{data.footer.contactNumber}</p>
        <p className="mt-4 text-xs opacity-60">© 2026 {data.navbar.shortName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
