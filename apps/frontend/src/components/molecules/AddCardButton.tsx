"use client";

import { Icon } from "@/components/atoms/Icon";

interface AddCardButtonProps {
  onClick: () => void;
}

export function AddCardButton({ onClick }: AddCardButtonProps) {
  return (
    <button
      onClick={onClick}
      className="gap-sm px-sm py-sm text-body-sm text-on-surface-variant/70 hover:bg-surface-container-low hover:text-on-surface flex w-full items-center rounded-lg transition-colors"
    >
      <Icon name="add" size={18} />
      Add card
    </button>
  );
}
