"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
    return (
        <Sonner
            theme="dark"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-slate-950 group-[.toaster]:text-slate-50 group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-slate-400",
                    actionButton:
                        "group-[.toast]:bg-teal-500 group-[.toast]:text-slate-950",
                    cancelButton:
                        "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-400",
                },
            }}
            {...props}
        />
    );
}
