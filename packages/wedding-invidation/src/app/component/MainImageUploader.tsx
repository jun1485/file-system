"use client";

import { useState } from "react";
import { uploadMainImage } from "../../services/settings-service";
import Image from "next/image";

interface MainImageUploaderProps {
  onUploadSuccess?: (imageUrl: string) => void;
  currentImageUrl?: string;
}

export default function MainImageUploader({
  onUploadSuccess,
  currentImageUrl = "https://firebasestorage.googleapis.com/v0/b/wedding-invitation-c4b0d.firebasestorage.app/o/galleries%2FChatGPT_Image_2025_1743585856385?alt=media&token=bd8de381-2c1e-424b-b6e2-81f2b57aa1e4",
}: MainImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);

      // 메시지 초기화
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
      setMessage({ text: "메인 이미지 업로드 중...", type: "info" });

      // settings-service의 uploadMainImage 사용하여 메인 이미지 교체
      const imageUrl = await uploadMainImage(file);

      setMessage({
        text: "메인 이미지가 성공적으로 업로드되었습니다.",
        type: "success",
      });

      // 성공 콜백 호출
      if (onUploadSuccess) {
        onUploadSuccess(imageUrl);
      }

      // 폼 초기화 (미리보기는 유지)
      setFile(null);
      const fileInput = document.getElementById(
        "main-image-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("메인 이미지 업로드 오류:", error);
      setMessage({
        text: `업로드 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`,
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 현재 표시할 이미지 (미리보기 또는 현재 설정된 이미지)
  const displayImage = previewUrl || currentImageUrl;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">메인 이미지 변경</h2>

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

      {/* 현재 이미지 미리보기 */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          {previewUrl ? "새 이미지 미리보기" : "현재 메인 이미지"}
        </p>
        <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={displayImage}
            alt="메인 이미지"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            새 메인 이미지 선택
          </label>
          <input
            id="main-image-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          <p className="mt-1 text-xs text-gray-500">
            권장: 가로로 긴 고화질 이미지 (2MB 이하)
          </p>
        </div>

        <button
          type="submit"
          disabled={isUploading || !file}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${
              isUploading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
        >
          {isUploading ? "업로드 중..." : "메인 이미지 변경하기"}
        </button>
      </form>
    </div>
  );
}
