import type { SelectItem } from "@nuxt/ui";

export type FieldType = "input" | "textarea" | "select" | "switch";

export interface BaseField {
  type: FieldType;
  name: string;
  label: string;
  description?: string;
  hint?: string;
  help?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  class?: string;
}

export interface InputField extends BaseField {
  type: "input";
}

export interface TextareaField extends BaseField {
  type: "textarea";
  rows?: number;
}

export interface SelectField extends BaseField {
  type: "select";
  valueKey?: string;
  items: SelectItem[] | SelectItem[][];
}

export interface SwitchField extends BaseField {
  type: "switch";
}

export type FormField = InputField | TextareaField | SelectField | SwitchField;
