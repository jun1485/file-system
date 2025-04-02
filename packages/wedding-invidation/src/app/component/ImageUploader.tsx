"use client";

import { useState } from "react";

interface ImageUploaderProps {
  onUploadSuccess?: () => void;
}

export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("웨딩촬영");
  const [alt, setAlt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // 이미지 선택 시 메시지 초기화
      setMessage({ text: "", type: "" });
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
      setUploadProgress(10);
      setMessage({ text: "업로드 중...", type: "info" });

      console.log("파일 정보:", {
        이름: file.name,
        타입: file.type,
        크기: `${Math.round(file.size / 1024)} KB`,
        카테고리: category,
        설명: alt,
      });

      // 타임아웃 설정
      const timeoutId = setTimeout(() => {
        if (uploadProgress < 100) {
          console.error("업로드 시간 초과");
          setMessage({
            text: "업로드 시간이 초과되었습니다. 다시 시도해주세요.",
            type: "error",
          });
          setIsUploading(false);
        }
      }, 20000); // 20초 타임아웃

      // API 라우트로 데이터 전송
      setUploadProgress(30);

      // Firebase 직접 호출 대신 API 라우트 사용
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      formData.append("alt", alt || "웨딩 사진");

      setUploadProgress(50);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearTimeout(timeoutId); // 타임아웃 취소

      setUploadProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "업로드 실패");
      }

      const result = await response.json();
      console.log("업로드 결과:", result);

      setUploadProgress(100);
      setMessage({
        text: "이미지가 성공적으로 업로드되었습니다.",
        type: "success",
      });

      // 폼 초기화
      setFile(null);
      setCategory("");
      setAlt("");
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // 성공 콜백 호출
      if (onUploadSuccess) {
        setTimeout(() => {
          onUploadSuccess();
        }, 500);
      }

      // 2초 후에 업로드 상태 리셋
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      console.error("업로드 오류:", error);
      setMessage({
        text: `업로드 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`,
        type: "error",
      });
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
              : message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {isUploading && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-center mt-1 text-gray-500">
            {uploadProgress}% 완료
          </p>
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
          <p className="mt-1 text-xs text-gray-500">
            권장: 2MB 이하의 JPG 또는 PNG 파일
          </p>
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
