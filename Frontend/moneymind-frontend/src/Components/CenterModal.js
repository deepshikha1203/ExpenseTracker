import React from "react";

const variantStyles = {
  info: {
    icon: "i",
    iconClass: "bg-blue-100 text-blue-700",
    buttonClass: "bg-purple-600 hover:bg-purple-700",
  },
  success: {
    icon: "✓",
    iconClass: "bg-green-100 text-green-700",
    buttonClass: "bg-green-600 hover:bg-green-700",
  },
  danger: {
    icon: "!",
    iconClass: "bg-red-100 text-red-700",
    buttonClass: "bg-red-600 hover:bg-red-700",
  },
};

function CenterModal({
  open,
  title,
  message,
  variant = "info",
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const style = variantStyles[variant] || variantStyles.info;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold ${style.iconClass}`}
          >
            {style.icon}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {cancelText && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow ${style.buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CenterModal;
