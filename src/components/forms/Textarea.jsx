import React from "react";

export const Textarea = ({
  label,
  id,
  rows = 4,
  placeholder,
  value,
  onChange,
  error = null,
  required = false,
  disabled = false,
  className = "",
  helperText = null,
  ...props
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
          <span>
            {label} {required && <span className="text-error ml-0.5">*</span>}
          </span>
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full bg-surface-container-lowest border rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline-variant/80 focus:outline-none focus:ring-1 transition-all px-space-md py-2.5 disabled:opacity-50 disabled:bg-surface-container-low ${
          error
            ? "border-error focus:ring-error focus:border-error"
            : "border-outline-variant/60 focus:ring-secondary focus:border-secondary"
        }`}
        {...props}
      />
      {error ? (
        <p className="font-caption text-caption text-error flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[14px]">error</span>
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="font-caption text-caption text-on-surface-variant mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};
