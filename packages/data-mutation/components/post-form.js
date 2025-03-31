"use client";

import { useFormState } from "react-dom";
import FormSubmit from "./form-submit";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PostForm({ action }) {
  const [state, formAction, isPending] = useFormState(action, null);
  const [previewImage, setPreviewImage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("확인 중...");

  useEffect(() => {
    // 서버 연결 확인을 위한 비동기 함수
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("id")
          .limit(1);

        if (error) {
          console.error("Supabase 연결 오류:", error);
          setConnectionStatus(`연결 실패: ${error.message}`);
        } else {
          console.log("Supabase 연결 성공! 데이터:", data);
          setConnectionStatus("연결 성공");
        }
      } catch (e) {
        console.error("예상치 못한 오류 발생:", e);
        setConnectionStatus(`오류 발생: ${e.message}`);
      }
    };

    checkConnection();
  }, []);

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
      console.log(action(formData));

      return action(formData);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <h1>Create a new post</h1>
      <p>Supabase 상태: {connectionStatus}</p>
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
