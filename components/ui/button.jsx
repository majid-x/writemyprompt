"use client";

import * as React from "react";
import styles from "./button.module.css";

const Button = React.forwardRef(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      asChild = false,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? React.Fragment : "button";

    const classNames = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <Comp className={classNames} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button };
