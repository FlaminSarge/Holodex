import { ReactNode } from "react";

interface SettingsItemProps {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}

export function SettingsItem({
  label,
  children,
  fullWidth,
}: SettingsItemProps) {
  return (
    <div className="flex justify-between gap-4 my-2 flex-wrap first:mt-0 last:mb-4 last:border-b-0">
      <h3
        className={
          "mb-2 mt-3 text-2xl tracking-tight md:text-3xl ml-4 md:ml-0" +
          (fullWidth && " w-full")
        }
      >
        {label}
      </h3>
      <div className="grid w-full gap-2 rounded-lg border p-2 md:p-4">
        {children}
      </div>
    </div>
  );
}
