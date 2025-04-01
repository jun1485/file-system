"use client";

import { useState } from "react";
import { uploadImage } from "../../services/gallery-service";

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("웨딩촬영");
  const [alt, setAlt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage({ text: "파일을 선택해주세요.", type: "error" });
      return;
    }

    try {
      setIsUploading(true);
      await uploadImage(file, category, alt);
      setMessage({
        text: "이미지가 성공적으로 업로드되었습니다.",
        type: "success",
      });

      // 폼 초기화
      setFile(null);
      setAlt("");
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setMessage({ text: "업로드 중 오류가 발생했습니다.", type: "error" });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">이미지 업로드</h2>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이미지 파일
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            카테고리
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="프로포즈">프로포즈</option>
            <option value="웨딩촬영">웨딩촬영</option>
            <option value="데이트">데이트</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="이미지에 대한 설명을 입력하세요"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
        >
          {isUploading ? "업로드 중..." : "이미지 업로드"}
        </button>
      </form>
    </div>
  );
}
