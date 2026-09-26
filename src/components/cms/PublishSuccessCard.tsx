import { useState } from "react";
import { Sparkles, Check, Copy, ExternalLink, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  siteName: string;
  websiteType: string;
}

export function PublishSuccessCard({ open, onClose, siteName, websiteType }: Props) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const slug = (siteName || "academy")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const siteUrl = `https://ksra.org/${websiteType === "sub-academy" ? "academy" : "state"}/${slug || "demo"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    toast.success("Link copied to clipboard", {
      description: siteUrl,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpen = () => {
    window.open(siteUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-card p-5 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
        {/* Subtle accent glow */}
        <div className="absolute -right-12 -top-12 size-36 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 size-36 rounded-full bg-brand/10 blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/25">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base text-foreground tracking-tight">
                  Website Published!
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10.5px] font-bold text-emerald-600">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your academy website is now live and accessible.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* URL Card Box */}
        <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-surface px-3.5 py-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Globe className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-xs font-mono font-medium text-foreground">
              {siteUrl}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs font-semibold hover:bg-brand-soft hover:text-brand cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="size-3.5 mr-1 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5 mr-1" />
                <span>Copy Link</span>
              </>
            )}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs font-medium cursor-pointer"
          >
            Done
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleOpen}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-sm shadow-emerald-600/20 cursor-pointer"
          >
            <ExternalLink className="size-3.5" />
            Open Website
          </Button>
        </div>
      </div>
    </div>
  );
}
