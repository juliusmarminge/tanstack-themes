export const ColorPreview: React.FC<{ themeClass?: string }> = ({
  themeClass,
}) => {
  return (
    <div
      className={`${themeClass ?? ""} @container grid grid-cols-1 gap-4 md:gap-8`}
    >
      {/* Primary Colors */}
      <ColorPreviewGroup label="Primary Theme Colors">
        <ColorPreviewItem label="Background" className="bg-background" />
        <ColorPreviewItem label="Foreground" className="bg-background" />
        <ColorPreviewItem label="Primary" className="bg-primary" />
        <ColorPreviewItem
          label="Primary Foreground"
          className="bg-primary-foreground"
        />
      </ColorPreviewGroup>

      {/* Secondary & Accent Colors */}
      <ColorPreviewGroup label="Secondary & Accent Colors">
        <ColorPreviewItem label="Secondary" className="bg-secondary" />
        <ColorPreviewItem
          label="Secondary Foreground"
          className="bg-secondary-foreground"
        />
        <ColorPreviewItem label="Accent" className="bg-accent" />
        <ColorPreviewItem
          label="Accent Foreground"
          className="bg-accent-foreground"
        />
      </ColorPreviewGroup>

      {/* UI Component Colors */}
      <ColorPreviewGroup label="UI Component Colors">
        <ColorPreviewItem label="Card" className="bg-card" />
        <ColorPreviewItem
          label="Card Foreground"
          className="bg-card-foreground"
        />
        <ColorPreviewItem label="Popover" className="bg-popover" />
        <ColorPreviewItem
          label="Popover Foreground"
          className="bg-popover-foreground"
        />
        <ColorPreviewItem label="Muted" className="bg-muted" />
        <ColorPreviewItem
          label="Muted Foreground"
          className="bg-muted-foreground"
        />
      </ColorPreviewGroup>

      {/* Utility & Form Colors */}
      <ColorPreviewGroup label="Utility & Form Colors">
        <ColorPreviewItem label="Border" className="bg-border" />
        <ColorPreviewItem label="Input" className="bg-input" />
        <ColorPreviewItem label="Ring" className="bg-ring" />
      </ColorPreviewGroup>

      {/* Status & Feedback Colors */}
      <ColorPreviewGroup label="Status & Feedback Colors">
        <ColorPreviewItem label="Info" className="bg-info" />
        <ColorPreviewItem
          label="Info Foreground"
          className="bg-info-foreground"
        />
        <ColorPreviewItem label="Success" className="bg-success" />
        <ColorPreviewItem
          label="Success Foreground"
          className="bg-success-foreground"
        />
        <ColorPreviewItem label="Warning" className="bg-warning" />
        <ColorPreviewItem
          label="Warning Foreground"
          className="bg-warning-foreground"
        />
        <ColorPreviewItem label="Destructive" className="bg-destructive" />
        <ColorPreviewItem
          label="Destructive Foreground"
          className="bg-destructive-foreground"
        />
      </ColorPreviewGroup>
    </div>
  );
};

function ColorPreviewGroup({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="space-y-4 @max-3xl:space-y-2">
      <h3 className="text-muted-foreground text-sm font-semibold">{label}</h3>
      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

function ColorPreviewItem({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div className="group/color-preview hover:bg-muted/60 relative flex items-center gap-2 rounded-md p-1 transition-colors">
      <div
        className={`size-14 shrink-0 rounded-md border @max-3xl:size-12 ${className}`}
      />
      <div className="flex-1 space-y-1 overflow-hidden">
        <p className="line-clamp-2 text-sm leading-tight font-medium @max-3xl:text-xs">
          {label}
        </p>
        <p className="text-muted-foreground truncate font-mono text-xs">
          {className}
        </p>
      </div>
    </div>
  );
}
