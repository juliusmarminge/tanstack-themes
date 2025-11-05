import { ClientOnly, createFileRoute } from "@tanstack/solid-router";
import { setTheme, setVariant, useTheme } from "@tanstack-themes/solid";
import { For } from "solid-js";
import { NativeSelect, NativeSelectOption } from "~/components/native-select";
import { THEMES, type ThemeVariant } from "~/lib/themes";
import { Button } from "~/components/button";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main class="min-h-screen bg-background text-foreground">
      <div class="container mx-auto max-w-4xl px-4 py-12">
        <div class="space-y-8">
          <header class="text-center">
            <h1 class="text-4xl font-bold tracking-tight">
              TanStack Themes Preview
            </h1>
          </header>
          <ClientOnly>
            <div class="space-y-6">
              <VariantSelect />
              <ThemeModes />
            </div>
          </ClientOnly>
        </div>
      </div>
    </main>
  );
}

function VariantSelect() {
  const variant = useTheme((state) => state.variant);

  return (
    <div class="space-y-3 rounded-lg border border-foreground/20 bg-card p-6 shadow-md">
      <h2 class="text-lg font-semibold">Switch theme variant</h2>
      <NativeSelect
        value={variant()}
        onChange={(e) => setVariant(e.target.value as ThemeVariant)}
        class="border-foreground/20"
      >
        <For each={THEMES} fallback="Loading">
          {(theme) => (
            <NativeSelectOption value={theme}>{theme}</NativeSelectOption>
          )}
        </For>
      </NativeSelect>
    </div>
  );
}

function ThemeModes() {
  return (
    <div class="space-y-3 rounded-lg border border-foreground/20 bg-card p-6 shadow-md">
      <h2 class="text-lg font-semibold">Toggle theme mode</h2>
      <div class="flex flex-wrap gap-2">
        <Button onClick={() => setTheme("light")}>Light</Button>
        <Button onClick={() => setTheme("dark")}>Dark</Button>
        <Button onClick={() => setTheme("auto")}>System</Button>
      </div>
    </div>
  );
}
