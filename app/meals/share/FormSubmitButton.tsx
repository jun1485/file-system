"use client";

import { useFormStatus } from "react-dom";

export default function FormSubmitButton() {
  const status = useFormStatus();

  return (
    <button disabled={status.pending}>
      {status.pending ? "Sharing..." : "Share Meal"}
    </button>
  );
}
