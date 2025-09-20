import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import React from "react";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "small" | "large";
  theme?: "dark" | "light";
  to?: string;
  onClick?: () => void;
  className?: string;
}

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  (
    { variant = "default", theme = "light", to, onClick, className, ...props },
    ref,
  ) => {
    const isClickable = onClick || to;

    const sizeClasses = {
      small: "h-8 w-auto",
      default: "h-10 w-auto",
      large: "h-12 w-auto",
    }[variant];

    const content = (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          "h-full w-auto",
          !isClickable && "cursor-default",
          className,
        )}
        onClick={onClick}
        {...props}
      >
        {theme === "dark" ? (
          <img
            src="/logo_dark.png"
            alt="Yomi Logo"
            className="h-full w-auto object-contain"
          />
        ) : (
          <img
            src="/logo_light.png"
            alt="Yomi Logo"
            className="h-full w-auto object-contain"
          />
        )}
      </div>
    );

    if (to) {
      return (
        <Link
          to={to}
          className={cn("inline-block", sizeClasses, className)}
          aria-label="Home"
        >
          {content}
        </Link>
      );
    }

    return (
      <div className={cn("inline-block", sizeClasses, className)}>
        {content}
      </div>
    );
  },
);

Logo.displayName = "Logo";

export default Logo;
