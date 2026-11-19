"use client";

import { useFieldControl } from "@ui-sdk/react/field";
import type { ComponentProps } from "react";
import { Input as InputControl } from "@/components/ui/input";
import { Textarea as TextareaControl } from "@/components/ui/textarea";

function useBoundControl<T extends object>(props: T) {
  const field = useFieldControl();
  if (!field) {
    return props;
  }
  const control = field.props({ name: field.name, ...props }) as unknown as T & {
    "data-slot"?: string;
  };
  if (control["data-slot"] == null) {
    delete control["data-slot"];
  }
  return control;
}

function Input(props: ComponentProps<typeof InputControl>) {
  return <InputControl {...useBoundControl(props)} />;
}

function Textarea(props: ComponentProps<typeof TextareaControl>) {
  return <TextareaControl {...useBoundControl(props)} />;
}

export { Input, Textarea };
