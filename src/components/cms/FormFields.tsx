import { useRef, useState, type ReactNode } from "react";
import { AlertCircle, ArrowDown, ArrowUp, GripVertical, ImagePlus, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function FieldShell({
  label,
  required,
  hint,
  error,
  counter,
  id,
  children,
}: {
  label: string;
  required?: boolean | undefined;
  hint?: string | undefined;
  error?: string | null | undefined;
  counter?: string | undefined;
  id?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div id={id} className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <Label className="text-[13px] font-semibold text-foreground">
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        {counter && (
          <span
            className={cn(
              "text-[11px] tabular-nums",
              error ? "text-warning" : "text-muted-foreground",
            )}
          >
            {counter}
          </span>
        )}
      </div>
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-[11.5px] text-warning">
          <AlertCircle className="size-3" /> {error}
        </p>
      ) : hint ? (
        <p className="text-[11.5px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  min?: number;
  max?: number;
  hint?: string;
  placeholder?: string;
  error?: string | null;
  type?: string;
  multiline?: boolean;
  rows?: number;
  id?: string;
};

export function TextField({
  label,
  value,
  onChange,
  required,
  min,
  max,
  hint,
  placeholder,
  error,
  type = "text",
  multiline,
  rows = 3,
  id,
}: TextFieldProps) {
  const counter = max ? `${value.length} / ${max}` : undefined;
  const invalid = Boolean(error);
  const shared = {
    id,
    value,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    className: cn(
      "bg-surface",
      invalid && "border-warning/70 focus-visible:ring-warning/40",
    ),
  };
  return (
    <FieldShell
      label={label}
      required={required}
      hint={hint ?? (min && max ? `${min}–${max} characters` : undefined)}
      error={error}
      counter={counter}
    >
      {multiline ? (
        <Textarea rows={rows} {...shared} />
      ) : (
        <Input type={type} {...shared} />
      )}
    </FieldShell>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  required,
  hint,
  error,
  aspect = "aspect-video",
  expectedRatio,
  compact,
  id,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hint?: string;
  error?: string | null;
  aspect?: string;
  expectedRatio?: "1:1" | "4:3";
  compact?: boolean;
  id?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const validateAndPick = (file?: File | null) => {
    if (!file) return;

    // 1. File type validation (PNG or JPEG only)
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    const isExtValid = /\.(png|jpe?g)$/i.test(file.name);
    if (!validTypes.includes(file.type) && !isExtValid) {
      setLocalError("Only PNG or JPEG images are allowed.");
      return;
    }

    // 2. Aspect ratio / dimension validation
    const objectUrl = URL.createObjectURL(file);
    if (expectedRatio) {
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const ratio = width / height;

        if (expectedRatio === "1:1") {
          // Allow 8% tolerance for minor rounding
          if (Math.abs(ratio - 1.0) > 0.08) {
            setLocalError(
              `Required ratio: 1:1 (square). Your image is ${width}×${height} (ratio ${ratio.toFixed(2)}:1).`,
            );
            URL.revokeObjectURL(objectUrl);
            return;
          }
        } else if (expectedRatio === "4:3") {
          // 4/3 = 1.3333... Allow 8% tolerance
          if (Math.abs(ratio - 4 / 3) > 0.08) {
            setLocalError(
              `Required ratio: 4:3. Your image is ${width}×${height} (ratio ${ratio.toFixed(2)}:1).`,
            );
            URL.revokeObjectURL(objectUrl);
            return;
          }
        }

        setLocalError(null);
        onChange(objectUrl);
      };

      img.onerror = () => {
        setLocalError("Could not read image dimensions.");
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    } else {
      setLocalError(null);
      onChange(objectUrl);
    }
  };

  const displayError = localError || error;

  const defaultHint = expectedRatio
    ? `Required ratio: ${expectedRatio} · PNG or JPEG`
    : "PNG or JPEG only";

  const effectiveHint = hint || defaultHint;

  const body = (
    <div id={id} className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          validateAndPick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {value ? (
        <div className="group relative overflow-hidden rounded-lg border border-border">
          <img
            src={value}
            alt={label ?? "Preview"}
            loading="lazy"
            className={cn("w-full object-cover", aspect)}
          />
          <div className="absolute inset-x-0 bottom-0 flex gap-1.5 bg-brand-deep/70 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-7 flex-1 text-[11px] cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-7 text-[11px] cursor-pointer"
              onClick={() => {
                setLocalError(null);
                onChange("");
              }}
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            validateAndPick(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-input bg-muted/40 px-3 text-center transition-colors hover:border-brand hover:bg-brand-soft cursor-pointer",
            compact ? "py-3.5" : "py-6",
            displayError && "border-destructive/70 bg-destructive/5",
          )}
        >
          <ImagePlus className={cn("size-4", displayError ? "text-destructive" : "text-muted-foreground")} />
          <span className="text-[12px] font-medium text-foreground">
            Drop image or click to upload
          </span>
          <span className="text-[11px] text-muted-foreground">
            {expectedRatio ? `Ratio ${expectedRatio} · PNG or JPEG` : "PNG or JPEG"}
          </span>
        </button>
      )}
      {displayError && !label && (
        <p className="flex items-center gap-1 text-[11.5px] text-destructive font-medium">
          <AlertCircle className="size-3 shrink-0" />
          <span>{displayError}</span>
        </p>
      )}
    </div>
  );

  if (!label) return body;
  return (
    <FieldShell
      label={label}
      required={required}
      hint={effectiveHint}
      error={displayError}
      id={id ? `${id}-container` : undefined}
    >
      {body}
    </FieldShell>
  );
}

export function PdfField({
  fileName,
  fileSize,
  onChange,
  error,
  id,
}: {
  fileName: string;
  fileSize: string;
  onChange: (name: string, size: string) => void;
  error?: string | null;
  id?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pick = (file?: File | null) => {
    if (!file) return;
    onChange(file.name, `${(file.size / 1024).toFixed(0)} KB`);
  };
  return (
    <FieldShell label="PDF File" required error={error} id={id ? `${id}-container` : undefined}>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {fileName ? (
        <div id={id} className="flex items-center gap-2 rounded-lg border border-border bg-surface p-2">
          <div className="grid size-8 shrink-0 place-items-center rounded bg-brand-soft text-[10px] font-bold text-brand">
            PDF
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium">{fileName}</p>
            <p className="text-[11px] text-success">Uploaded · {fileSize}</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-[11px]"
            onClick={() => inputRef.current?.click()}
          >
            Replace
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-muted-foreground"
            onClick={() => onChange("", "")}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ) : (
        <button
          id={id}
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            pick(e.dataTransfer.files?.[0]);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/40 py-4 text-[12px] font-medium transition-colors hover:border-brand hover:bg-brand-soft"
        >
          <Upload className="size-3.5" /> Upload PDF
        </button>
      )}
    </FieldShell>
  );
}

export function ItemCard({
  index,
  total,
  title,
  onMove,
  onRemove,
  children,
  right,
}: {
  index: number;
  total: number;
  title: string;
  onMove: (delta: number) => void;
  onRemove: () => void;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <GripVertical className="size-4 cursor-grab text-muted-foreground/70" />
        <span className="flex-1 truncate text-[12.5px] font-semibold">
          {index + 1}. {title}
        </span>
        {right}
        <div className="flex items-center">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="size-7 p-0"
            disabled={index === 0}
            onClick={() => onMove(-1)}
          >
            <ArrowUp className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="size-7 p-0"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
          >
            <ArrowDown className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="size-7 p-0 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
      <div className="space-y-3 p-3">{children}</div>
    </div>
  );
}

export function SectionNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-accent bg-accent/50 px-3 py-2 text-[11.5px] text-accent-foreground">
      {children}
    </p>
  );
}
