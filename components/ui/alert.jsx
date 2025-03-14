"use client";

import * as React from "react";
import styles from "./alert.module.css";

const Alert = React.forwardRef(
  ({ className = "", variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={`${styles.alert} ${styles[variant]} ${className}`}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h5 ref={ref} className={`${styles.alertTitle} ${className}`} {...props} />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`${styles.alertDescription} ${className}`}
      {...props}
    />
  )
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
