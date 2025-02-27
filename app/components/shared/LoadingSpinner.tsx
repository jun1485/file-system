"use client";

import React from "react";
import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div className={`${styles.spinnerContainer} ${className || ""}`}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;
