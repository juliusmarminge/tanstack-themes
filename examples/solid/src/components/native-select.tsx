import { splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";
import { twMerge } from "tailwind-merge";

function NativeSelect(props: ComponentProps<"select">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      class="group/native-select relative w-fit has-[select:disabled]:opacity-50"
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        class={twMerge(
          "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          local.class,
        )}
        {...rest}
      />
      <ChevronDownIcon
        class="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}

function NativeSelectOption(props: ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />;
}

function NativeSelectOptGroup(props: ComponentProps<"optgroup">) {
  const [local, rest] = splitProps(props, ["class"]);
  return <optgroup data-slot="native-select-optgroup" class={twMerge(local.class)} {...rest} />;
}

function ChevronDownIcon(props: ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <title>Arrow Down</title>
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="m6 9l6 6l6-6"
      />
    </svg>
  );
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
