import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Monitor, Smartphone, Tablet, Save, Rocket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { EditorPanel } from "@/components/cms/EditorPanel";
import { WebsitePreview } from "@/components/cms/WebsitePreview";
import { initialData, type WebsiteData, type WebsiteType } from "@/lib/cms-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Website Builder — Academy CMS" },
      { name: "description", content: "Edit your academy, state or district website with a live preview." },
      { property: "og:title", content: "Website Builder — Academy CMS" },
      { property: "og:description", content: "Edit your academy, state or district website with a live preview." },
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
  { id: "desktop", icon: Monitor, width: "100%" },
  { id: "tablet", icon: Tablet, width: "768px" },
  { id: "mobile", icon: Smartphone, width: "390px" },
] as const;

function Builder() {
  const [type, setType] = useState<WebsiteType>("sub-academy");
  const [data, setData] = useState<WebsiteData>(initialData);
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("desktop");
  const [dirty, setDirty] = useState(false);
  const [published, setPublished] = useState(false);

  const update = (fn: (d: WebsiteData) => WebsiteData) => {
    setData(fn);
    setDirty(true);
  };
  const width = DEVICES.find((d) => d.id === device)!.width;

  return (
    <div className="flex h-screen flex-col bg-surface">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-card px-5 py-3">
        <div className="flex items-center gap-4">
          <span className="font-display text-xl font-extrabold uppercase text-brand-deep">Website Builder</span>
          <div className="flex rounded-lg border p-0.5">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold ${type === t.id ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {dirty ? "Unsaved changes" : published ? "Published" : "All changes saved"}
          </span>
          <Button variant="outline" size="sm" disabled={!dirty} onClick={() => { setDirty(false); toast.success("Draft saved"); }}>
            <Save className="size-4" /> Save
          </Button>
          <Button size="sm" className="bg-brand text-brand-foreground hover:bg-brand-deep" onClick={() => { setDirty(false); setPublished(true); toast.success("Website published"); }}>
            <Rocket className="size-4" /> Publish
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="w-[440px] shrink-0 overflow-y-auto border-r bg-card">
          <EditorPanel data={data} update={update} websiteType={type} />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-center gap-1 border-b bg-card py-2">
            {DEVICES.map((d) => (
              <button
                key={d.id}
                aria-label={d.id}
                onClick={() => setDevice(d.id)}
                className={`rounded-md p-2 ${device === d.id ? "bg-brand-soft text-brand" : "text-muted-foreground"}`}
              >
                <d.icon className="size-4" />
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto overflow-hidden rounded-xl bg-card shadow-frame transition-all" style={{ width, maxWidth: "100%" }}>
              <WebsitePreview data={data} websiteType={type} compact={device === "mobile"} />
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
