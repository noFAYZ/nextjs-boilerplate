"use client"

import * as React from "react"
import { useForm, useController, type Control, type FieldValues, type Path } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { FormField, FormSection, FormGrid } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Field types
export type FieldType = 
  | "text"
  | "email" 
  | "password"
  | "number"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "date"
  | "time"
  | "datetime-local"

export interface FormFieldConfig {
  name: string
  type: FieldType
  label: string
  description?: string
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  validation?: z.ZodSchema
  defaultValue?: any
  disabled?: boolean
  hidden?: boolean
  cols?: 1 | 2 | 3 | 4
}

export interface FormSectionConfig {
  title?: string
  description?: string
  fields: FormFieldConfig[]
  cols?: 1 | 2 | 3 | 4
  gap?: "sm" | "md" | "lg"
}

export interface FormConfig {
  title?: string
  description?: string
  sections: FormSectionConfig[]
  submitText?: string
  resetText?: string
  schema: z.ZodSchema
}

interface FormBuilderProps<T extends FieldValues> {
  config: FormConfig
  onSubmit: (data: T) => void | Promise<void>
  defaultValues?: Partial<T>
  loading?: boolean
  className?: string
}

// Field component mapper
function FormFieldRenderer<T extends FieldValues>({
  field,
  control,
}: {
  field: FormFieldConfig
  control: Control<T>
}) {
  const {
    field: controllerField,
    fieldState: { error },
  } = useController({
    name: field.name as Path<T>,
    control,
    defaultValue: field.defaultValue,
  })

  if (field.hidden) return null

  const getFieldState = () => {
    if (error) return "error"
    return "default"
  }

  const renderInputComponent = () => {
    const commonProps = {
      placeholder: field.placeholder,
      disabled: field.disabled,
      value: controllerField.value || "",
      onChange: controllerField.onChange,
      onBlur: controllerField.onBlur,
      state: getFieldState(),
    }

    switch (field.type) {
      case "textarea":
        return <Textarea {...commonProps} />

      case "select":
        return (
          <Select
            value={controllerField.value}
            onValueChange={controllerField.onChange}
            disabled={field.disabled}
          >
            <SelectTrigger state={getFieldState()}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={controllerField.value}
              onCheckedChange={controllerField.onChange}
              disabled={field.disabled}
            />
            <label
              htmlFor={field.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        )

      default:
        return <Input {...commonProps} type={field.type} />
    }
  }

  // Special handling for checkbox - don't wrap in FormField
  if (field.type === "checkbox") {
    return renderInputComponent()
  }

  return (
    <FormField
      label={field.label}
      description={field.description}
      required={field.required}
      state={getFieldState()}
      message={error?.message}
    >
      {renderInputComponent()}
    </FormField>
  )
}

export function FormBuilder<T extends FieldValues>({
  config,
  onSubmit,
  defaultValues,
  loading = false,
  className,
}: FormBuilderProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(config.schema),
    defaultValues,
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  })

  return (
    <Card className={className}>
      {(config.title || config.description) && (
        <CardHeader>
          {config.title && <CardTitle>{config.title}</CardTitle>}
          {config.description && (
            <p className="text-sm text-muted-foreground">{config.description}</p>
          )}
        </CardHeader>
      )}
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {config.sections.map((section, sectionIndex) => (
            <FormSection
              key={sectionIndex}
              title={section.title}
              description={section.description}
            >
              <FormGrid cols={section.cols} gap={section.gap}>
                {section.fields.map((field) => (
                  <div
                    key={field.name}
                    className={
                      field.cols
                        ? {
                            1: "col-span-1",
                            2: "col-span-2",
                            3: "col-span-3", 
                            4: "col-span-4",
                          }[field.cols]
                        : ""
                    }
                  >
                    <FormFieldRenderer field={field} control={form.control} />
                  </div>
                ))}
              </FormGrid>
            </FormSection>
          ))}

          <div className="flex gap-3 pt-6 border-t">
            <Button type="submit" loading={loading}>
              {config.submitText || "Submit"}
            </Button>
            
            {config.resetText && (
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={loading}
              >
                {config.resetText}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Hook for creating form configs with TypeScript safety
export function useFormConfig<T extends FieldValues>(config: FormConfig) {
  return {
    ...config,
    render: (props: Omit<FormBuilderProps<T>, "config">) => (
      <FormBuilder<T> {...props} config={config} />
    ),
  }
}

// Common validation schemas
export const validationSchemas = {
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  required: z.string().min(1, "This field is required"),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),
  url: z.string().url("Please enter a valid URL"),
  number: z.number().min(0, "Please enter a valid number"),
}