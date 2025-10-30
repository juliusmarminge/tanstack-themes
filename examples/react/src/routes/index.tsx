import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@tanstack-themes/react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { themeMode, variant } = useTheme();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Hello world!</h1>
      <p>Theme mode: {themeMode}</p>
      <p>Variant: {variant}</p>
      <p>
        Tailwind Active Variant:
        <span className="hidden light:inline mr-1">light</span>
        <span className="hidden dark:inline mr-1">dark</span>
        <span className="hidden auto:inline mr-1">auto</span>
      </p>
    </main>
  );
}
