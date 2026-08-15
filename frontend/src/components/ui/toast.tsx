import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

type ToastProps = {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function Toast({ title, description, open, onOpenChange }: ToastProps) {
  return (
    <ToastPrimitive.Provider>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        duration={3000}
        className="rounded-lg border bg-background p-4 shadow-lg"
      >
        <ToastPrimitive.Title className="font-semibold">{title}</ToastPrimitive.Title>

        {description && (
          <ToastPrimitive.Description className="text-sm text-muted-foreground">
            {description}
          </ToastPrimitive.Description>
        )}
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport className="fixed right-4 top-4 z-50 w-96 max-w-[calc(100vw-2rem)]" />
    </ToastPrimitive.Provider>
  );
}
