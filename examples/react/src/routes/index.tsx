import { createFileRoute, useHydrated } from "@tanstack/react-router";
import {
  useTheme,
  setTheme,
  setVariant,
  THEME_MODES,
} from "@tanstack-themes/react";
import { MonitorIcon, MoonIcon, SunIcon } from "../components/icons";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectPopup,
} from "../components/select";
import { THEMES } from "../lib/themes";
import { ColorPreview } from "../components/color-preview";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="p-8 flex flex-col gap-4">
      <div className="flex items-center gap-2 w-fit">
        <ThemeModeSelect />
        <ThemeVariantSelect />
      </div>
      <ColorPreview />
    </main>
  );
}

function ThemeModeSelect() {
  const hydrated = useHydrated();
  const mode = useTheme((state) => state.themeMode);

  return (
    <Select
      disabled={!hydrated}
      items={THEME_MODES.map((mode) => ({ label: mode, value: mode }))}
      defaultValue={mode}
      onValueChange={(value) => setTheme(value)}
    >
      <SelectTrigger>
        <SelectValue>
          {(item) => (
            <div className="[&>svg]:size-4 [&>svg]:scale-0 [&>svg]:absolute [&>svg]:top-1/2 [&>svg]:-translate-y-1/2">
              <SunIcon className="scale-100! dark:scale-0! auto:scale-0! " />
              <MoonIcon className="scale-0! dark:scale-100! auto:scale-0! " />
              <MonitorIcon className="scale-0! dark:scale-0! auto:scale-100! " />
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

function ThemeVariantSelect() {
  const hydrated = useHydrated();
  const variant = useTheme((state) => state.variant);
  return (
    <Select
      disabled={!hydrated}
      defaultValue={variant}
      items={THEMES.map((variant) => ({ label: variant, value: variant }))}
      onValueChange={(value) => setVariant(value)}
    >
      <SelectTrigger>
        <SelectValue>
          {(variant) => (hydrated ? variant : "Select variant")}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {THEMES.map((variant) => (
          <SelectItem key={variant} value={variant}>
            {variant}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
