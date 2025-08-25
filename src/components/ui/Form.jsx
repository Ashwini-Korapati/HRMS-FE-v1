import React from 'react'
import { cn } from '@/utils/cn'

const Input = React.forwardRef(({ className, type = "text", error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "form-input",
        error && "border-error-500 focus-visible:ring-error-500",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

const Label = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "form-label",
        error && "text-error-600",
        className
      )}
      {...props}
    />
  )
})

Label.displayName = "Label"

const FormField = ({ label, error, children, required, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label error={!!error}>
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "form-input min-h-[80px] resize-y",
        error && "border-error-500 focus-visible:ring-error-500",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

const Select = React.forwardRef(({ className, error, children, placeholder, ...props }, ref) => {
  return (
    <select
      className={cn(
        "form-input",
        error && "border-error-500 focus-visible:ring-error-500",
        className
      )}
      ref={ref}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  )
})

Select.displayName = "Select"

const Checkbox = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500",
          error && "border-error-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {label && (
        <Label htmlFor={props.id} className="text-sm font-normal">
          {label}
        </Label>
      )}
    </div>
  )
})

Checkbox.displayName = "Checkbox"

const Radio = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        className={cn(
          "h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500",
          error && "border-error-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {label && (
        <Label htmlFor={props.id} className="text-sm font-normal">
          {label}
        </Label>
      )}
    </div>
  )
})

Radio.displayName = "Radio"

export { Input, Label, FormField, Textarea, Select, Checkbox, Radio }
