"use client";

import { useFormState } from "react-dom";
import FormSubmit from "./form-submit";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PostForm({ action }) {
  const [state, formAction, isPending] = useFormState(action, null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const file = formData.get("image");
      if (file) {
        const filename = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("posts")
          .upload(filename, file);

        if (error) throw error;

        formData.append("imageUrl", data.path);
      }

      return action(formData);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <h1>Create a new post</h1>
      <form action={handleSubmit}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </p>
        <p className="form-control">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
            onChange={handleImageChange}
          />
        </p>
        {previewImage && (
          <div style={{ marginBottom: "1rem" }}>
            <img
              src={previewImage}
              alt="미리보기"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          </div>
        )}
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows="5" />
        </p>
        <p className="form-actions">
          <FormSubmit />
        </p>
        {state?.errors && (
          <p className="form-error">
            {state.errors.map((error) => error).join(", ")}
          </p>
        )}
      </form>
    </>
  );
}
