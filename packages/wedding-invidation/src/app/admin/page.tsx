"use client";

import { useState, useEffect } from "react";
import {
  fetchGalleryImages,
  GalleryImage,
} from "../../services/gallery-service";
import ImageUploader from "../component/ImageUploader";
import NavigationMenu from "../component/navigation/navigation-menu";

export default function AdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("전체");
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // 이미지 불러오기
  const loadImages = async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo("이미지 로딩 중...");

    try {
      const fetchedImages = await fetchGalleryImages();
      setImages(fetchedImages);
      setDebugInfo(`${fetchedImages.length}개의 이미지를 로드했습니다.`);
    } catch (error) {
      console.error("이미지 로딩 오류:", error);
      setError("이미지를 불러오는 중 오류가 발생했습니다.");
      setDebugInfo(
        `오류: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 로드 시 이미지 불러오기
  useEffect(() => {
    loadImages();
  }, []);

  // 필터링된 이미지
  const filteredImages =
    filter === "전체"
      ? images
      : images.filter((img) => img.category === filter);

  // 개발 환경 체크
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 bg-background">
      <div className="max-w-5xl w-full bg-card-bg rounded-xl shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div className="wedding-gradient text-center p-8 text-white">
          <h1 className="text-3xl font-serif mb-2">관리자 페이지</h1>
          <p>갤러리 이미지 관리</p>
        </div>

        {/* 내비게이션 메뉴 */}
        <NavigationMenu />

        {/* 환경 정보 */}
        {isDevelopment && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 mx-6 mt-4">
            <p className="text-yellow-700 font-medium">
              개발 환경 (Development)
            </p>
            <p className="text-sm text-yellow-600">{debugInfo}</p>
          </div>
        )}

        {/* 오류 표시 */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4 mx-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* 이미지 업로더 */}
          <div className="md:col-span-1">
            <ImageUploader onUploadSuccess={loadImages} />
            <button
              onClick={loadImages}
              className="mt-4 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              이미지 목록 새로고침
            </button>
          </div>

          {/* 이미지 목록 */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">갤러리 이미지 목록</h2>

              {/* 카테고리 필터 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {["전체", "프로포즈", "웨딩촬영", "데이트"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      filter === category
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <p>이미지를 불러오는 중...</p>
                </div>
              ) : filteredImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-center">
                          <span className="inline-block px-2 py-1 text-xs bg-gray-200 rounded-full">
                            {image.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(image.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-2 text-sm truncate">{image.alt}</p>
                        {isDevelopment && (
                          <p className="mt-1 text-xs text-gray-400 truncate">
                            ID: {image.id}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>이미지가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="bg-gray-100 p-5 text-center text-sm text-gray-600 border-t border-gray-200">
          <p>© 2024 주정준 & 이인영의 결혼식</p>
          <p className="mt-1 text-xs text-gray-500">관리자 페이지</p>
        </div>
      </div>
    </main>
  );
}
