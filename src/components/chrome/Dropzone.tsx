import React, { useRef, useState } from "react";
import { Check, FileText, Upload, X } from "lucide-react";
import { brand, colors, radii, type } from "../../theme";
import { SecondaryButton } from "./Buttons";

interface DropzoneProps {
  onFile: (file: File) => void;
  file?: File | null;
  onClear?: () => void;
  accept?: string;
  error?: string;
  /** "panel" is the big offer-letter target; "inline" is the compact ID row. */
  variant?: "panel" | "inline";
  label?: string;
  title?: string;
  caption?: string;
}

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)}KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

const Dropzone: React.FC<DropzoneProps> = ({
  onFile,
  file,
  onClear,
  accept = ".pdf,.jpg,.jpeg,.png",
  error,
  variant = "panel",
  label,
  title = "Drag & drop your file here",
  caption = "or click to browse from your device",
}) => {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const pick = () => input.current?.click();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onFile(dropped);
  };

  const borderColor = error
    ? colors.status.error
    : over
    ? colors.primary.main
    : colors.border.light;

  const hidden = (
    <input
      ref={input}
      type="file"
      accept={accept}
      onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) onFile(f);
        e.target.value = "";
      }}
      style={{ display: "none" }}
    />
  );

  const chosen = file && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px 18px",
        background: colors.status.successLight,
        border: `1px solid #C6DACC`,
        borderRadius: `${radii.md}px`,
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: `${radii.sm + 2}px`,
          background: colors.status.success,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Check size={20} strokeWidth={2.6} color="#FFFFFF" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", flexGrow: 1, minWidth: 0 }}>
        <span
          style={{
            font: `600 14px/1.3 ${type.body}`,
            color: colors.text.primary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {file.name}
        </span>
        <span style={{ font: `400 12px/1.3 ${type.body}`, color: colors.text.secondary }}>
          {formatSize(file.size)} · ready to submit
        </span>
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Remove file"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: colors.text.secondary,
            display: "flex",
            padding: "6px",
          }}
        >
          <X size={18} strokeWidth={1.8} />
        </button>
      )}
      {hidden}
    </div>
  );

  if (file) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {label && (
          <span style={{ font: `600 14px/1 ${type.body}`, color: colors.text.primary }}>{label}</span>
        )}
        {chosen}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {label && (
          <span style={{ font: `600 14px/1 ${type.body}`, color: colors.text.primary }}>{label}</span>
        )}
        <button
          type="button"
          onClick={pick}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={handleDrop}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            padding: "18px 20px",
            width: "100%",
            textAlign: "left",
            border: `2px dashed ${borderColor}`,
            borderRadius: `${radii.lg - 2}px`,
            background: over ? colors.primary[100] : brand.wash,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: `${radii.md}px`,
              background: colors.primary.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText size={22} strokeWidth={1.7} color="#E6BE58" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ font: `600 15px/1.2 ${type.body}`, color: colors.text.primary }}>
              {title}
            </span>
            <span style={{ font: `400 13px/1.3 ${type.body}`, color: colors.text.secondary }}>
              {caption}
            </span>
          </div>
        </button>
        {hidden}
        {error && (
          <span style={{ font: `400 13px/1.45 ${type.body}`, color: colors.status.error }}>
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "9px", flexGrow: 1 }}>
      {label && (
        <span style={{ font: `600 14px/1 ${type.body}`, color: colors.text.primary }}>{label}</span>
      )}
      <div
        onClick={pick}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={handleDrop}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          flexGrow: 1,
          minHeight: "260px",
          padding: "28px",
          border: `2px dashed ${borderColor}`,
          borderRadius: `${radii.lg + 2}px`,
          background: over ? colors.primary[100] : brand.wash,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: `${radii.lg}px`,
            background: colors.primary.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px",
          }}
        >
          <Upload size={28} strokeWidth={1.8} color="#E6BE58" />
        </div>
        <div
          style={{
            font: `700 clamp(19px, 2.4vw, 24px)/1.2 ${type.display}`,
            letterSpacing: "-0.02em",
            color: colors.text.primary,
            textAlign: "center",
          }}
        >
          {title}
        </div>
        <div
          style={{
            font: `400 14px/1.4 ${type.body}`,
            color: colors.text.secondary,
            marginBottom: "18px",
            textAlign: "center",
          }}
        >
          {caption}
        </div>
        <SecondaryButton icon={FileText} onClick={pick}>
          Choose file
        </SecondaryButton>
      </div>
      {hidden}
      {error && (
        <span style={{ font: `400 13px/1.45 ${type.body}`, color: colors.status.error }}>{error}</span>
      )}
    </div>
  );
};

export default Dropzone;
