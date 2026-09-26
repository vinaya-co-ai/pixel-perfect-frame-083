import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Monitor, Smartphone, Tablet, Save, Rocket, Sparkles, CheckCircle2, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { EditorPanel } from "@/components/cms/EditorPanel";
import { WebsitePreview } from "@/components/cms/WebsitePreview";
import { PublishSuccessCard } from "@/components/cms/PublishSuccessCard";
import { initialData, validateWebsite, type WebsiteData, type WebsiteType } from "@/lib/cms-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KSRA Website Builder — Academy CMS" },
      { name: "description", content: "Kerala State Rifle Association (KSRA) Academy Website CMS and live content builder." },
      { property: "og:title", content: "KSRA Website Builder — Academy CMS" },
      { property: "og:description", content: "Kerala State Rifle Association (KSRA) Academy Website CMS and live content builder." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Builder,
});

const TYPES: { id: WebsiteType; label: string }[] = [
  { id: "sub-academy", label: "Sub-Academy" },
  { id: "state", label: "State" },
  { id: "district", label: "District" },
];
const DEVICES = [
  {
    id: "desktop",
    label: "Desktop",
    resolution: "100%",
    icon: Monitor,
    width: "100%",
    maxWidth: "1120px",
  },
  {
    id: "tablet",
    label: "Tablet",
    resolution: "768px",
    icon: Tablet,
    width: "768px",
    maxWidth: "768px",
  },
  {
    id: "mobile",
    label: "Mobile",
    resolution: "390px",
    icon: Smartphone,
    width: "390px",
    maxWidth: "390px",
  },
] as const;

type PublishStatus = "saved" | "unsaved" | "draft" | "just_published" | "live";

function Builder() {
  const [type, setType] = useState<WebsiteType>("sub-academy");
  const [data, setData] = useState<WebsiteData>(initialData);
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("desktop");
  const [dirty, setDirty] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishStatus, setPublishStatus] = useState<PublishStatus>("saved");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingPhase, setPublishingPhase] = useState<0 | 1 | 2>(0);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [previewGlow, setPreviewGlow] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["basic", "hero"]);

  const update = (fn: (d: WebsiteData) => WebsiteData) => {
    setData(fn);
    setDirty(true);
    setPublishStatus("unsaved");
  };

  const currentDevice = DEVICES.find((d) => d.id === device) || DEVICES[0];

  const errors = useMemo(() => validateWebsite(data, type), [data, type]);

  const scrollToPreviewSection = (sectionId: string) => {
    const previewIdMap: Record<string, string> = {
      basic: "pv-hero",
      hero: "pv-hero",
      about: "pv-about",
      explore: "pv-explore",
      gallery: "pv-gallery",
      facilities: "pv-facilities",
      events: "pv-events",
      downloads: "pv-downloads",
      experiences: "pv-experiences",
      location: "pv-location",
      contact: "pv-location",
      footer: "pv-footer",
    };
    const targetId = previewIdMap[sectionId] || `pv-${sectionId}`;
    const scrollContainer = document.getElementById("pv-scroll-container");
    const target = document.getElementById(targetId);
    if (scrollContainer && target) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const targetScrollTop = targetRect.top - containerRect.top + scrollContainer.scrollTop;
      scrollContainer.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });
    }
  };

  const handlePreviewNavigate = (sectionId: string) => {
    const cmsSectionMap: Record<string, string> = {
      hero: "hero",
      about: "about",
      explore: "explore",
      gallery: "gallery",
      facilities: "facilities",
      events: "events",
      downloads: "downloads",
      experiences: "experiences",
      location: "location",
      contact: "location",
      footer: "footer",
    };
    const cmsSec = cmsSectionMap[sectionId] || sectionId;
    setOpenSections((prev) => Array.from(new Set([...prev, cmsSec])));
  };

  const handlePublish = () => {
    const currentErrors = validateWebsite(data, type);
    const first = currentErrors[0];
    if (first) {
      toast.error("Please fix the highlighted fields before publishing.", {
        description: `${first.sectionLabel} → ${first.fieldLabel}: ${first.message}`,
      });

      // Automatically navigate/open the first section containing an error
      setOpenSections((prev) => Array.from(new Set([...prev, first.sectionId])));

      // Scroll editor panel to the invalid field and focus it
      setTimeout(() => {
        const el = document.getElementById(first.elementId || `field-${first.key}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus?.();
        } else {
          const secEl = document.getElementById(`accordion-item-${first.sectionId}`);
          if (secEl) {
            secEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 120);

      return;
    }

    // Start polished publish launch transition (1.35s total)
    setIsPublishing(true);
    setPublishingPhase(0);

    setTimeout(() => {
      setPublishingPhase(1);
    }, 450);

    setTimeout(() => {
      setPublishingPhase(2);
    }, 900);

    setTimeout(() => {
      setIsPublishing(false);
      setDirty(false);
      setPublished(true);
      setPublishStatus("just_published");
      setShowSuccessCard(true);
      setPreviewGlow(true);

      // Turn off preview glow after 3.5s
      setTimeout(() => {
        setPreviewGlow(false);
      }, 3500);

      // Transition status from "LIVE · Just published" to "LIVE" after 4.5s
      setTimeout(() => {
        setPublishStatus((prev) => (prev === "just_published" ? "live" : prev));
      }, 4500);
    }, 1350);
  };

  const handleSaveDraft = () => {
    setDirty(false);
    setPublishStatus("draft");
    toast.success("Draft saved");
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b bg-card px-5 py-3 shadow-2xs">
        <div className="flex items-center gap-4">
          <span className="font-display text-xl font-extrabold uppercase text-brand-deep">Website Builder</span>
          <div className="flex rounded-lg border p-0.5 bg-muted/30">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  type === t.id
                    ? "bg-brand text-brand-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          {isPublishing ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
              {publishingPhase === 0 && (
                <>
                  <Loader2 className="size-3.5 animate-spin text-brand" />
                  <span>Publishing your website...</span>
                </>
              )}
              {publishingPhase === 1 && (
                <>
                  <CheckCircle2 className="size-3.5 text-emerald-600 animate-in zoom-in-50" />
                  <span className="text-emerald-600">Content published</span>
                </>
              )}
              {publishingPhase === 2 && (
                <>
                  <Sparkles className="size-3.5 text-emerald-600 animate-in zoom-in-50" />
                  <span className="text-emerald-600">Your website is live!</span>
                </>
              )}
            </span>
          ) : publishStatus === "unsaved" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Unsaved changes</span>
            </span>
          ) : publishStatus === "draft" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full border border-border">
              <span className="size-2 rounded-full bg-slate-400" />
              <span>Saved draft</span>
            </span>
          ) : publishStatus === "just_published" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30 animate-in fade-in zoom-in-95">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE · Just published</span>
            </span>
          ) : publishStatus === "live" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>LIVE</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-slate-400" />
              <span>All changes saved</span>
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={!dirty || isPublishing}
            onClick={handleSaveDraft}
          >
            <Save className="size-4" /> Save
          </Button>

          <Button
            size="sm"
            disabled={isPublishing}
            className={`cursor-pointer font-semibold transition-all ${
              isPublishing
                ? "bg-brand text-brand-foreground opacity-90 cursor-wait"
                : "bg-brand text-brand-foreground hover:bg-brand-deep"
            }`}
            onClick={handlePublish}
          >
            {isPublishing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Rocket className="size-4" />
                <span>Publish</span>
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        <aside className="w-full lg:w-[440px] shrink-0 border-r bg-card p-4">
          <EditorPanel
            data={data}
            update={update}
            websiteType={type}
            openSections={openSections}
            setOpenSections={setOpenSections}
            errors={errors}
            onSelectSection={scrollToPreviewSection}
          />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col bg-muted/20 relative">
          {/* Device Switcher Bar */}
          <div className="sticky top-[57px] z-20 flex items-center justify-between border-b bg-card px-6 py-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Live Preview
              </span>
              {publishStatus === "just_published" || publishStatus === "live" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-600 border border-emerald-500/20">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>● LIVE</span>
                </span>
              ) : (
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10.5px] font-semibold text-success">
                  ● Connected
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 rounded-lg border bg-surface p-1">
              {DEVICES.map((d) => (
                <button
                  key={d.id}
                  aria-label={d.label}
                  onClick={() => setDevice(d.id)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    device === d.id
                      ? "bg-brand text-brand-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <d.icon className="size-3.5" />
                  <span>{d.label}</span>
                  <span className={`text-[10.5px] opacity-75 hidden sm:inline ${device === d.id ? "text-white" : ""}`}>
                    ({d.resolution})
                  </span>
                </button>
              ))}
            </div>

            <div className="text-xs text-muted-foreground hidden md:block">
              {currentDevice.label} Viewport ({currentDevice.resolution})
            </div>
          </div>

          {/* Preview Viewport Frame */}
          <div className="flex-1 p-4 sm:p-6 flex justify-center items-start">
            <div
              className={`flex flex-col transition-all duration-500 mx-auto overflow-hidden bg-card ${
                previewGlow
                  ? "ring-4 ring-emerald-500/70 shadow-[0_0_40px_rgba(16,185,129,0.35)] scale-[1.002]"
                  : ""
              } ${
                device === "mobile"
                  ? "w-[390px] h-[780px] rounded-3xl border-8 border-border/80 shadow-2xl"
                  : device === "tablet"
                    ? "w-[768px] h-[880px] rounded-2xl border-4 border-border/80 shadow-xl"
                    : "w-full max-w-[1120px] min-h-[720px] h-[calc(100vh-140px)] rounded-xl border border-border shadow-md"
              }`}
              style={{
                width: currentDevice.width,
                maxWidth: currentDevice.maxWidth,
              }}
            >
              {/* Device Notch simulation on Mobile */}
              {device === "mobile" && (
                <div className="shrink-0 bg-border/60 py-1 flex justify-center items-center">
                  <div className="h-1.5 w-16 rounded-full bg-muted-foreground/40" />
                </div>
              )}

              <WebsitePreview
                data={data}
                websiteType={type}
                device={device}
                onNavigateSection={handlePreviewNavigate}
              />
            </div>
          </div>

          {/* Polished Website Published Launch Popover */}
          <PublishSuccessCard
            open={showSuccessCard}
            onClose={() => setShowSuccessCard(false)}
            siteName={data.navbar.shortName || "Academy"}
            websiteType={type}
          />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
