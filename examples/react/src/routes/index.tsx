import { createFileRoute, useHydrated } from "@tanstack/react-router";
import {
  useTheme,
  setThemeBase,
  setThemeMode,
  setThemeAccent,
  THEME_MODES,
} from "@tanstack-themes/react";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectPopup,
} from "../components/select";
import { BASE_COLORS, ACCENT_COLORS } from "../lib/themes";
import { ColorPreview } from "../components/color-preview";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="p-8 flex flex-col gap-4">
      <div className="flex items-center gap-2 w-fit">
        <ThemeModeSelect />
        <ThemeBaseSelect />
        <ThemeAccentSelect />
      </div>
      <ColorPreview />
    </main>
  );
}

function ThemeModeSelect() {
  const hydrated = useHydrated();
  const mode = useTheme((state) => state.mode);

  return (
    <Select
      disabled={!hydrated}
      items={THEME_MODES.map((mode) => ({ label: mode, value: mode }))}
      defaultValue={mode}
      onValueChange={(value) => setThemeMode(value)}
    >
      <SelectTrigger>
        <SelectValue>
          {(item) => (
            <div className="[&>svg]:size-4 [&>svg]:scale-0 [&>svg]:absolute [&>svg]:top-1/2 [&>svg]:-translate-y-1/2">
              <SunIcon className="scale-100! dark:scale-0! auto:scale-0! " />
              <MoonIcon className="scale-0! dark:scale-100! auto:scale-0! " />
              <DesktopIcon className="scale-0! dark:scale-0! auto:scale-100! " />
              <span className="pl-6">{hydrated ? item : "Mode"}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectPopup>
        {THEME_MODES.map((mode) => (
          <SelectItem key={mode} value={mode}>
            {mode}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}

function ThemeBaseSelect() {
  const hydrated = useHydrated();
  const base = useTheme((state) => state.base);
  return (
    <Select
      disabled={!hydrated}
      defaultValue={base}
      items={BASE_COLORS.map((base) => ({ label: base, value: base }))}
      onValueChange={(value) => setThemeBase(value)}
    >
      <SelectTrigger>
        <SelectValue>{(base) => (hydrated ? base : "Select base")}</SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {BASE_COLORS.map((variant) => (
          <SelectItem key={variant} value={variant}>
            {variant}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}

function ThemeAccentSelect() {
  const hydrated = useHydrated();
  const accent = useTheme((state) => state.accent);

  return (
    <Select
      disabled={!hydrated}
      defaultValue={accent}
      items={ACCENT_COLORS.map((accent) => ({ label: accent, value: accent }))}
      onValueChange={(value) => setThemeAccent(value)}
    >
      <SelectTrigger>
        <SelectValue>
          {(accent) => (hydrated ? accent : "Select accent")}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {ACCENT_COLORS.map((accent) => (
          <SelectItem key={accent} value={accent}>
            {accent}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
