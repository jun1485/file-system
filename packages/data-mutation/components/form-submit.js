"use client";

import { useFormState } from "react-dom";

export default function FormSubmit() {
  const status = useFormState();

  if (status === "pending") {
    return <p>Submitting...</p>;
  }

  return (
    <>
      <button type="reset" disabled={status === "pending"}>
        reset
      </button>
      <button type="submit" disabled={status === "pending"}>
        Submit
      </button>
    </>
  );
}
