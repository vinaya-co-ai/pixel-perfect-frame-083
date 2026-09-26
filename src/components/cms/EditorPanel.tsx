import { Plus, Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  FieldShell,
  ImageField,
  ItemCard,
  PdfField,
  SectionNote,
  TextField,
} from "./FormFields";
import {
  lengthError,
  moveItem,
  phoneError,
  SECTIONS,
  uid,
  urlError,
  ValidationError,
  type DownloadCategory,
  type WebsiteData,
  type WebsiteType,
} from "@/lib/cms-data";

type Props = {
  data: WebsiteData;
  update: (fn: (draft: WebsiteData) => WebsiteData) => void;
  websiteType: WebsiteType;
  openSections: string[];
  setOpenSections: React.Dispatch<React.SetStateAction<string[]>>;
  errors: ValidationError[];
  onSelectSection?: (sectionId: string) => void;
};

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-dashed text-[12.5px] font-semibold text-brand hover:bg-brand-soft"
      onClick={onClick}
    >
      <Plus className="size-4" /> {label}
    </Button>
  );
}

export function EditorPanel({
  data,
  update,
  websiteType,
  openSections,
  setOpenSections,
  errors,
  onSelectSection,
}: Props) {
  const sections = SECTIONS[websiteType];
  const entityLabel = websiteType === "sub-academy" ? "Academy" : "District";

  const set = <K extends keyof WebsiteData>(key: K, value: WebsiteData[K]) =>
    update((d) => ({ ...d, [key]: value }));

  const sectionErrorsCount = (sectionId: string) =>
    errors.filter((e) => e.sectionId === sectionId).length;

  const panels: Record<string, React.ReactNode> = {
    basic: (
      <div className="space-y-4">
        <ImageField
          id="field-navbar-logoUrl"
          label="Logo"
          required
          aspect="aspect-square"
          hint="PNG or JPEG · 1:1 ratio recommended"
          value={data.navbar.logoUrl}
          onChange={(v) => set("navbar", { ...data.navbar, logoUrl: v })}
          error={data.navbar.logoUrl ? null : "Logo is required"}
        />
        <TextField
          id="field-navbar-shortName"
          label="Short Name"
          required
          max={10}
          placeholder="KSA"
          value={data.navbar.shortName}
          onChange={(v) => set("navbar", { ...data.navbar, shortName: v })}
          error={lengthError(data.navbar.shortName, { required: true, max: 10 })}
          hint="Appears beside the logo in the navbar"
        />
      </div>
    ),
    hero: (
      <div className="space-y-4">
        <TextField
          id="field-hero-title"
          label="Title"
          required
          max={10}
          value={data.hero.title}
          onChange={(v) => set("hero", { ...data.hero, title: v })}
          error={lengthError(data.hero.title, { required: true, max: 10 })}
        />
        <TextField
          id="field-hero-subtitle"
          label="Subtitle"
          required
          min={15}
          max={20}
          value={data.hero.subtitle}
          onChange={(v) => set("hero", { ...data.hero, subtitle: v })}
          error={lengthError(data.hero.subtitle, {
            required: true,
            min: 15,
            max: 20,
          })}
        />
        <FieldShell
          id="field-hero-images"
          label="Hero Images"
          required
          error={
            data.hero.images.filter(Boolean).length !== 4
              ? "Exactly 4 images are required"
              : null
          }
          hint="Exactly 4 images · PNG or JPEG"
          counter={`${data.hero.images.filter(Boolean).length} / 4`}
        >
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <ImageField
                key={i}
                compact
                value={data.hero.images[i] ?? ""}
                onChange={(v) => {
                  const images = [...data.hero.images];
                  images[i] = v;
                  set("hero", { ...data.hero, images });
                }}
              />
            ))}
          </div>
        </FieldShell>
      </div>
    ),
    about: (
      <div className="space-y-4">
        <TextField
          id="field-about-title"
          label="Title"
          required
          max={10}
          value={data.about.title}
          onChange={(v) => set("about", { ...data.about, title: v })}
          error={lengthError(data.about.title, { required: true, max: 10 })}
        />
        <TextField
          id="field-about-description"
          label="Description"
          required
          multiline
          rows={4}
          min={50}
          max={100}
          value={data.about.description}
          onChange={(v) => set("about", { ...data.about, description: v })}
          error={lengthError(data.about.description, {
            required: true,
            min: 50,
            max: 100,
          })}
        />
        <ImageField
          id="field-about-image"
          label="Image"
          required
          value={data.about.image}
          onChange={(v) => set("about", { ...data.about, image: v })}
          error={data.about.image ? null : "An image is required"}
        />
      </div>
    ),
    explore: (
      <div className="space-y-4">
        <TextField
          id="field-explore-title"
          label="Title"
          required
          max={10}
          value={data.explore.title}
          onChange={(v) => set("explore", { ...data.explore, title: v })}
          error={lengthError(data.explore.title, { required: true, max: 10 })}
        />
        <TextField
          id="field-explore-subtitle"
          label="Subtitle"
          required
          min={15}
          max={20}
          value={data.explore.subtitle}
          onChange={(v) => set("explore", { ...data.explore, subtitle: v })}
          error={lengthError(data.explore.subtitle, {
            required: true,
            min: 15,
            max: 20,
          })}
        />
        {data.explore.items.map((item, i) => (
          <ItemCard
            key={item.id}
            index={i}
            total={data.explore.items.length}
            title={item.name || "Untitled card"}
            right={
              <Switch
                checked={item.active}
                onCheckedChange={(c) =>
                  set("explore", {
                    ...data.explore,
                    items: data.explore.items.map((x) =>
                      x.id === item.id ? { ...x, active: c } : x,
                    ),
                  })
                }
              />
            }
            onMove={(d) =>
              set("explore", {
                ...data.explore,
                items: moveItem(data.explore.items, i, d),
              })
            }
            onRemove={() =>
              set("explore", {
                ...data.explore,
                items: data.explore.items.filter((x) => x.id !== item.id),
              })
            }
          >
            {(() => {
              const patch = (p: Partial<typeof item>) =>
                set("explore", {
                  ...data.explore,
                  items: data.explore.items.map((x) =>
                    x.id === item.id ? { ...x, ...p } : x,
                  ),
                });
              return (
                <>
                  <ImageField
                    id={`field-explore-${item.id}-logoUrl`}
                    label="Logo"
                    compact
                    aspect="aspect-square"
                    value={item.logoUrl}
                    onChange={(v) => patch({ logoUrl: v })}
                  />
                  <TextField
                    id={`field-explore-${item.id}-name`}
                    label="Name"
                    required
                    max={15}
                    value={item.name}
                    onChange={(v) => patch({ name: v })}
                    error={lengthError(item.name, { required: true, max: 15 })}
                  />
                  <TextField
                    id={`field-explore-${item.id}-description`}
                    label="Description"
                    required
                    min={30}
                    max={40}
                    value={item.description}
                    onChange={(v) => patch({ description: v })}
                    error={lengthError(item.description, {
                      required: true,
                      min: 30,
                      max: 40,
                    })}
                  />
                  <TextField
                    id={`field-explore-${item.id}-websiteUrl`}
                    label="Website URL"
                    value={item.websiteUrl}
                    onChange={(v) => patch({ websiteUrl: v })}
                    error={urlError(item.websiteUrl)}
                    hint="https://…"
                  />
                </>
              );
            })()}
          </ItemCard>
        ))}
        <AddButton
          label={`Add ${entityLabel === "Academy" ? "Academy" : "District"} Card`}
          onClick={() =>
            set("explore", {
              ...data.explore,
              items: [
                ...data.explore.items,
                {
                  id: uid(),
                  logoUrl: "",
                  name: "",
                  description: "",
                  websiteUrl: "",
                  active: true,
                },
              ],
            })
          }
        />
      </div>
    ),
    gallery: (
      <div className="space-y-4">
        <SectionNote>
          8 images are recommended for initial display. Additional items can be
          added.
        </SectionNote>
        {data.gallery.map((item, i) => {
          const patch = (p: Partial<typeof item>) =>
            set(
              "gallery",
              data.gallery.map((x) => (x.id === item.id ? { ...x, ...p } : x)),
            );
          return (
            <ItemCard
              key={item.id}
              index={i}
              total={data.gallery.length}
              title={item.title || "Untitled item"}
              onMove={(d) => set("gallery", moveItem(data.gallery, i, d))}
              onRemove={() =>
                set(
                  "gallery",
                  data.gallery.filter((x) => x.id !== item.id),
                )
              }
            >
              <ImageField
                id={`field-gallery-${item.id}-image`}
                label="Image"
                compact
                value={item.image}
                onChange={(v) => patch({ image: v })}
                error={item.image ? null : "An image is required"}
              />
              <TextField
                id={`field-gallery-${item.id}-title`}
                label="Title"
                max={10}
                value={item.title}
                onChange={(v) => patch({ title: v })}
                error={lengthError(item.title, { max: 10 })}
              />
              <TextField
                id={`field-gallery-${item.id}-description`}
                label="Description"
                min={20}
                max={30}
                value={item.description}
                onChange={(v) => patch({ description: v })}
                error={item.description ? lengthError(item.description, { min: 20, max: 30 }) : null}
              />
            </ItemCard>
          );
        })}
        <AddButton
          label="Add Gallery Item"
          onClick={() =>
            set("gallery", [
              ...data.gallery,
              { id: uid(), image: "", title: "", description: "" },
            ])
          }
        />
      </div>
    ),
    facilities: (
      <div className="space-y-4">
        {data.facilities.map((item, i) => {
          const patch = (p: Partial<typeof item>) =>
            set(
              "facilities",
              data.facilities.map((x) =>
                x.id === item.id ? { ...x, ...p } : x,
              ),
            );
          return (
            <ItemCard
              key={item.id}
              index={i}
              total={data.facilities.length}
              title={item.title || "Untitled facility"}
              onMove={(d) => set("facilities", moveItem(data.facilities, i, d))}
              onRemove={() =>
                set(
                  "facilities",
                  data.facilities.filter((x) => x.id !== item.id),
                )
              }
            >
              <ImageField
                id={`field-facilities-${item.id}-image`}
                label="Image"
                compact
                value={item.image}
                onChange={(v) => patch({ image: v })}
                error={item.image ? null : "An image is required"}
              />
              <TextField
                id={`field-facilities-${item.id}-title`}
                label="Title"
                required
                min={10}
                max={15}
                value={item.title}
                onChange={(v) => patch({ title: v })}
                error={lengthError(item.title, {
                  required: true,
                  min: 10,
                  max: 15,
                })}
                hint="10–15 characters · e.g. Shooting Range"
              />
            </ItemCard>
          );
        })}
        <AddButton
          label="Add Facility"
          onClick={() =>
            set("facilities", [
              ...data.facilities,
              { id: uid(), image: "", title: "" },
            ])
          }
        />
      </div>
    ),
    events: (
      <div className="space-y-4">
        <SectionNote>
          6–8 upcoming events are recommended for initial display.
        </SectionNote>
        {data.events.map((item, i) => {
          const patch = (p: Partial<typeof item>) =>
            set(
              "events",
              data.events.map((x) => (x.id === item.id ? { ...x, ...p } : x)),
            );
          return (
            <ItemCard
              key={item.id}
              index={i}
              total={data.events.length}
              title={item.title || "Untitled event"}
              right={
                <Switch
                  checked={item.active}
                  onCheckedChange={(c) => patch({ active: c })}
                />
              }
              onMove={(d) => set("events", moveItem(data.events, i, d))}
              onRemove={() =>
                set(
                  "events",
                  data.events.filter((x) => x.id !== item.id),
                )
              }
            >
              <TextField
                id={`field-events-${item.id}-title`}
                label="Event Title"
                required
                max={15}
                value={item.title}
                onChange={(v) => patch({ title: v })}
                error={lengthError(item.title, { required: true, max: 15 })}
              />
              <TextField
                id={`field-events-${item.id}-description`}
                label="Description"
                required
                max={20}
                value={item.description}
                onChange={(v) => patch({ description: v })}
                error={lengthError(item.description, {
                  required: true,
                  max: 20,
                })}
              />
              <TextField
                id={`field-events-${item.id}-location`}
                label="Location"
                required
                value={item.location}
                onChange={(v) => patch({ location: v })}
                error={lengthError(item.location, { required: true })}
              />
              <TextField
                id={`field-events-${item.id}-locationUrl`}
                label="Location URL"
                value={item.locationUrl}
                onChange={(v) => patch({ locationUrl: v })}
                error={urlError(item.locationUrl)}
                hint="Optional map link"
              />
              <div className="grid grid-cols-3 gap-2">
                <TextField
                  id={`field-events-${item.id}-date`}
                  label="Date"
                  required
                  type="date"
                  value={item.date}
                  onChange={(v) => patch({ date: v })}
                  error={item.date ? null : "Date is required"}
                />
                <TextField
                  id={`field-events-${item.id}-startTime`}
                  label="Start"
                  required
                  type="time"
                  value={item.startTime}
                  onChange={(v) => patch({ startTime: v })}
                  error={item.startTime ? null : "Start time is required"}
                />
                <TextField
                  id={`field-events-${item.id}-endTime`}
                  label="End"
                  type="time"
                  value={item.endTime}
                  onChange={(v) => patch({ endTime: v })}
                />
              </div>
            </ItemCard>
          );
        })}
        <AddButton
          label="Add Event"
          onClick={() =>
            set("events", [
              ...data.events,
              {
                id: uid(),
                title: "",
                description: "",
                location: "",
                locationUrl: "",
                date: "",
                startTime: "",
                endTime: "",
                active: true,
              },
            ])
          }
        />
      </div>
    ),
    downloads: (
      <div className="space-y-4">
        <SectionNote>
          Recommended initial content: 5–10 Rules &amp; Regulations, forms as
          required, and other official documents.
        </SectionNote>
        {data.downloads.map((item, i) => {
          const patch = (p: Partial<typeof item>) =>
            set(
              "downloads",
              data.downloads.map((x) => (x.id === item.id ? { ...x, ...p } : x)),
            );
          return (
            <ItemCard
              key={item.id}
              index={i}
              total={data.downloads.length}
              title={item.title || "Untitled document"}
              right={
                <Switch
                  checked={item.active}
                  onCheckedChange={(c) => patch({ active: c })}
                />
              }
              onMove={(d) => set("downloads", moveItem(data.downloads, i, d))}
              onRemove={() =>
                set(
                  "downloads",
                  data.downloads.filter((x) => x.id !== item.id),
                )
              }
            >
              <TextField
                id={`field-downloads-${item.id}-title`}
                label="Title"
                required
                value={item.title}
                onChange={(v) => patch({ title: v })}
                error={lengthError(item.title, { required: true })}
              />
              <TextField
                id={`field-downloads-${item.id}-description`}
                label="Description"
                value={item.description}
                onChange={(v) => patch({ description: v })}
              />
              <FieldShell label="Category" required>
                <Select
                  value={item.category}
                  onValueChange={(v) =>
                    patch({ category: v as DownloadCategory })
                  }
                >
                  <SelectTrigger className="bg-surface">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RULES">RULES</SelectItem>
                    <SelectItem value="FORM">FORM</SelectItem>
                    <SelectItem value="DOCUMENT">DOCUMENT</SelectItem>
                  </SelectContent>
                </Select>
              </FieldShell>
              <PdfField
                id={`field-downloads-${item.id}-fileName`}
                fileName={item.fileName}
                fileSize={item.fileSize}
                onChange={(fileName, fileSize) => patch({ fileName, fileSize })}
                error={item.fileName ? null : "A PDF file is required"}
              />
            </ItemCard>
          );
        })}
        <AddButton
          label="Add Document"
          onClick={() =>
            set("downloads", [
              ...data.downloads,
              {
                id: uid(),
                title: "",
                description: "",
                category: "DOCUMENT",
                fileName: "",
                fileSize: "",
                active: true,
              },
            ])
          }
        />
      </div>
    ),
    experiences: (
      <div className="space-y-4">
        <SectionNote>
          6–8 player experiences are recommended for initial display.
        </SectionNote>
        {data.experiences.map((item, i) => {
          const patch = (p: Partial<typeof item>) =>
            set(
              "experiences",
              data.experiences.map((x) =>
                x.id === item.id ? { ...x, ...p } : x,
              ),
            );
          return (
            <ItemCard
              key={item.id}
              index={i}
              total={data.experiences.length}
              title={item.name || "Untitled player"}
              right={
                <Switch
                  checked={item.active}
                  onCheckedChange={(c) => patch({ active: c })}
                />
              }
              onMove={(d) =>
                set("experiences", moveItem(data.experiences, i, d))
              }
              onRemove={() =>
                set(
                  "experiences",
                  data.experiences.filter((x) => x.id !== item.id),
                )
              }
            >
              <TextField
                id={`field-experiences-${item.id}-name`}
                label="Player Name"
                required
                min={10}
                max={15}
                value={item.name}
                onChange={(v) => patch({ name: v })}
                error={lengthError(item.name, {
                  required: true,
                  min: 10,
                  max: 15,
                })}
              />
              <ImageField
                id={`field-experiences-${item.id}-image`}
                label="Player Image"
                compact
                aspect="aspect-square"
                value={item.image}
                onChange={(v) => patch({ image: v })}
              />
              <TextField
                id={`field-experiences-${item.id}-experience`}
                label="Experience"
                required
                multiline
                rows={3}
                value={item.experience}
                onChange={(v) => patch({ experience: v })}
                error={lengthError(item.experience, { required: true })}
              />
              <FieldShell label="Rating" required>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => patch({ rating: n })}
                      aria-label={`${n} star`}
                    >
                      <Star
                        className={cn(
                          "size-5 transition-colors",
                          n <= item.rating
                            ? "fill-warning text-warning"
                            : "text-muted-foreground/40",
                        )}
                      />
                    </button>
                  ))}
                  <span className="ml-1 text-[11px] text-muted-foreground">
                    {item.rating} / 5
                  </span>
                </div>
              </FieldShell>
              <FieldShell
                label="Display Order"
                hint="Use the arrows above to reorder"
              >
                <Input readOnly value={i + 1} className="w-20 bg-muted/50" />
              </FieldShell>
            </ItemCard>
          );
        })}
        <AddButton
          label="Add Experience"
          onClick={() =>
            set("experiences", [
              ...data.experiences,
              {
                id: uid(),
                name: "",
                image: "",
                experience: "",
                rating: 5,
                active: true,
              },
            ])
          }
        />
      </div>
    ),
    location: (
      <div className="space-y-4">
        <ImageField
          id="field-location-mapImage"
          label="Map Image"
          hint="Optional static map snapshot"
          value={data.location.mapImage}
          onChange={(v) => set("location", { ...data.location, mapImage: v })}
        />
        <TextField
          id="field-location-mapUrl"
          label="Map URL"
          value={data.location.mapUrl}
          onChange={(v) => set("location", { ...data.location, mapUrl: v })}
          error={urlError(data.location.mapUrl)}
          hint="Optional Google Maps link"
        />
        <TextField
          id="field-location-address"
          label="Address"
          required
          multiline
          max={100}
          value={data.location.address}
          onChange={(v) => set("location", { ...data.location, address: v })}
          error={lengthError(data.location.address, {
            required: true,
            max: 100,
          })}
        />
        <TextField
          id="field-location-contactNumber"
          label="Contact Number"
          required
          value={data.location.contactNumber}
          onChange={(v) =>
            set("location", { ...data.location, contactNumber: v })
          }
          error={phoneError(data.location.contactNumber)}
          hint="10 digits, stored as text"
        />
        <div className="grid grid-cols-2 gap-2">
          <TextField
            label="Latitude"
            value={data.location.latitude}
            onChange={(v) => set("location", { ...data.location, latitude: v })}
          />
          <TextField
            label="Longitude"
            value={data.location.longitude}
            onChange={(v) => set("location", { ...data.location, longitude: v })}
          />
        </div>
      </div>
    ),
    contact: (
      <div className="space-y-3">
        <SectionNote>
          The public contact form is fixed. These validation rules are applied
          on submission.
        </SectionNote>
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {[
            ["Name", "10–15 characters"],
            ["Email", "Valid email address"],
            ["Contact Number", "Exactly 10 digits"],
            ["Message", "100–200 characters"],
          ].map(([field, rule]) => (
            <div
              key={field}
              className="flex items-center justify-between border-b border-border px-3 py-2.5 last:border-0"
            >
              <span className="text-[12.5px] font-semibold">
                {field}
                <span className="ml-0.5 text-destructive">*</span>
              </span>
              <span className="text-[11.5px] text-muted-foreground">
                {rule}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11.5px] text-muted-foreground">
          Scroll the preview to the Contact Us section to see the public form.
        </p>
      </div>
    ),
    footer: (
      <div className="space-y-4">
        <SectionNote>Footer logo automatically uses the Navbar logo.</SectionNote>
        <TextField
          id="field-footer-address"
          label="Address"
          required
          multiline
          max={100}
          value={data.footer.address}
          onChange={(v) => set("footer", { ...data.footer, address: v })}
          error={lengthError(data.footer.address, { required: true, max: 100 })}
        />
        <TextField
          id="field-footer-contactNumber"
          label="Contact Number"
          required
          value={data.footer.contactNumber}
          onChange={(v) => set("footer", { ...data.footer, contactNumber: v })}
          error={phoneError(data.footer.contactNumber)}
        />
        {(
          [
            ["youtubeUrl", "YouTube URL"],
            ["facebookUrl", "Facebook URL"],
            ["instagramUrl", "Instagram URL"],
            ["twitterUrl", "X / Twitter URL"],
          ] as const
        ).map(([key, label]) => (
          <TextField
            key={key}
            id={`field-footer-${key}`}
            label={label}
            value={data.footer[key]}
            onChange={(v) => set("footer", { ...data.footer, [key]: v })}
            error={urlError(data.footer[key])}
            hint="Optional"
          />
        ))}
      </div>
    ),
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-lg font-semibold tracking-wide uppercase">
          Admin Editor
        </h2>
        <p className="text-[12px] text-muted-foreground">
          {sections.length} sections · changes appear in the preview instantly
        </p>
      </div>
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={(val) => {
          setOpenSections(val);
          const newlyOpened = val.find((v) => !openSections.includes(v));
          if (newlyOpened) {
            onSelectSection?.(newlyOpened);
          }
        }}
        className="space-y-2.5"
      >
        {sections.map((section, i) => {
          const errCount = sectionErrorsCount(section.id);
          return (
            <AccordionItem
              key={section.id}
              value={section.id}
              id={`accordion-item-${section.id}`}
              className="overflow-hidden rounded-xl border border-border bg-surface px-0 shadow-sm last:border-b"
            >
              <AccordionTrigger
                className="px-3 py-3 hover:no-underline cursor-pointer"
                onClick={() => onSelectSection?.(section.id)}
              >
                <span className="flex items-center gap-2.5 text-left flex-1 min-w-0">
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-brand-soft text-[11px] font-bold text-brand">
                    {i + 1}
                  </span>
                  <span className="text-[13.5px] font-semibold truncate">
                    {section.label}
                  </span>
                  {errCount > 0 && (
                    <span className="ml-auto mr-2 rounded-full bg-destructive/15 px-2 py-0.5 text-[10.5px] font-semibold text-destructive">
                      {errCount} {errCount === 1 ? "error" : "errors"}
                    </span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="border-t border-border bg-background/60 px-3 pt-3 pb-4">
                {panels[section.id]}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <Label className="sr-only">Editor end</Label>
    </div>
  );
}
