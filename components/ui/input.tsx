import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  interface?: "parent" | "child";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, interface: interfaceType = "parent", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          interfaceType === "parent" && "font-parent text-parent-base",
          interfaceType === "child" &&
            "font-child text-child-base tracking-child letter-spacing-child font-medium",
          "hover:border-primary/50 focus:border-primary focus:scale-105",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
