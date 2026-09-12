import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary", // "primary" | "danger" | "secondary"
  loading = false,
  icon = "help"
}) => {
  const iconConfig = {
    danger: {
      name: icon === "help" ? "delete_forever" : icon,
      bg: "bg-error-container text-error"
    },
    primary: {
      name: icon === "help" ? "info" : icon,
      bg: "bg-surface-container text-primary"
    },
    secondary: {
      name: icon === "help" ? "verified" : icon,
      bg: "bg-secondary-fixed text-on-secondary-fixed"
    }
  };

  const currentIcon = iconConfig[variant] || iconConfig.primary;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} size="sm" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-space-md py-space-xs">
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${currentIcon.bg}`}>
          <span className="material-symbols-outlined text-[24px]">{currentIcon.name}</span>
        </div>
        <div className="flex-1">
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};
