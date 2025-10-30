import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useTheme, setVariant, setTheme } from "@tanstack-themes/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/dropdown-menu";
import { Button } from "../components/button";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { NativeSelect, NativeSelectOption } from "../components/native-select";
import { ThemeVariant, THEMES } from "../themes";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Hello world!</h1>
      <ClientOnly>
        <ThemeToggle />
        <VariantSelect />
      </ClientOnly>
    </main>
  );
}

function VariantSelect() {
  const variant = useTheme((state) => state.variant);
  return (
    <NativeSelect
      value={variant}
      onChange={(e) => setVariant(e.target.value as ThemeVariant)}
    >
      {THEMES.map((theme) => (
        <NativeSelectOption key={theme} value={theme}>
          {theme}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}

export function ThemeToggle() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="[&>svg]:absolute [&>svg]:size-5 [&>svg]:scale-0"
        >
          <SunIcon className="light:scale-100! auto:scale-0!" />
          <MoonIcon className="auto:scale-0! dark:scale-100!" />
          <DesktopIcon className="auto:scale-100!" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("auto")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
