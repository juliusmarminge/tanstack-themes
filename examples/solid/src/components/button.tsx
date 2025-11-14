import { type ComponentProps, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

export function Button(props: ComponentProps<"button">) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <button
      class={twMerge(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
        "bg-primary text-primary-foreground shadow-sm",
        "transition-colors hover:bg-primary/90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}
