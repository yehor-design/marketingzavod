"use client";

import { useFieldControl } from "@ui-sdk/react/field";
import type { ComponentProps } from "react";
import { Input as InputControl } from "@/components/ui/input";
import { Textarea as TextareaControl } from "@/components/ui/textarea";

function Input(props: ComponentProps<typeof InputControl>) {
  const field = useFieldControl();
  const control = field ? field.props({ name: field.name, ...props }) : props;
  return <InputControl {...control} />;
}

function Textarea(props: ComponentProps<typeof TextareaControl>) {
  const field = useFieldControl();
  const control = field ? field.props({ name: field.name, ...props }) : props;
  return <TextareaControl {...control} />;
}

export { Input, Textarea };
