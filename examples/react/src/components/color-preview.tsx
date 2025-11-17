export const ColorPreview: React.FC<{ themeClass?: string }> = ({
  themeClass,
}) => {
  return (
    <div
      className={`${themeClass ?? ""} @container grid grid-cols-1 gap-4 md:gap-8`}
    >
      {/* Primary Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Primary Theme Colors
        </h3>
        <div className="@6xl grid grid-cols-1 gap-2 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem label="Background" className="bg-background" />
          <ColorPreviewItem label="Foreground" className="bg-background" />
          <ColorPreviewItem label="Primary" className="bg-primary" />
          <ColorPreviewItem
            label="Primary Foreground"
            className="bg-primary-foreground"
          />
        </div>
      </div>

      {/* Secondary & Accent Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Secondary & Accent Colors
        </h3>
        <div className="@6xl grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem label="Accent" className="bg-accent" />
          <ColorPreviewItem
            label="Accent Foreground"
            className="bg-accent-foreground"
          />
        </div>
      </div>

      {/* UI Component Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          UI Component Colors
        </h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem label="Popover" className="bg-popover" />
          <ColorPreviewItem
            label="Popover Foreground"
            className="bg-popover-foreground"
          />
        </div>
      </div>

      {/* Utility & Form Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Utility & Form Colors
        </h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem label="Border" className="bg-border" />
          <ColorPreviewItem label="Input" className="bg-input" />
          <ColorPreviewItem label="Ring" className="bg-ring" />
        </div>
      </div>
    </div>
  );
};

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

      {/* <div className="hidden flex-col opacity-0 transition-opacity group-hover/color-preview:opacity-100 md:flex">
          <TooltipWrapper label="Edit color" asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => focusColor(name as FocusColorId)}
              className="size-7 @max-3xl:size-6 [&>svg]:size-3.5"
            >
              <SquarePen />
            </Button>
          </TooltipWrapper>
          <CopyButton textToCopy={color} className="size-7 @max-3xl:size-6" />
        </div> */}
    </div>
  );
}
