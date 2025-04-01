"use client";

import Image from "next/image";
import NavigationMenu from "../component/navigation/navigation-menu";
import { useState, useEffect } from "react";
import {
  fetchGalleryImages,
  GalleryImage,
} from "../../services/gallery-service";

export default function Gallery() {
  // 이미지 상태 관리
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // 선택된 이미지 상태
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  // 필터 상태
  const [filter, setFilter] = useState("전체");

  // 이미지 불러오기
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      try {
        // Firebase에서 이미지 가져오기
        const fetchedImages = await fetchGalleryImages();
        setImages(fetchedImages);
      } catch (error) {
        console.error("이미지 로딩 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  // 필터링된 이미지
  const filteredImages =
    filter === "전체"
      ? images
      : images.filter((img) => img.category === filter);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-background">
      <div className="max-w-3xl w-full bg-card-bg rounded-xl shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div className="wedding-gradient text-center p-8 text-white">
          <h1 className="text-3xl font-serif mb-2">갤러리</h1>
          <p>우리의 소중한 순간들</p>
        </div>

        {/* 내비게이션 메뉴 */}
        <NavigationMenu />

        {/* 카테고리 필터 */}
        <div className="flex justify-center my-4 space-x-2 p-2">
          {["전체", "프로포즈", "웨딩촬영", "데이트"].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filter === category
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 갤러리 그리드 */}
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <p className="text-gray-500">이미지를 불러오는 중...</p>
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="aspect-square relative rounded-lg overflow-hidden shadow cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  className="hover:opacity-90"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="text-white text-xs font-medium px-2 py-1 rounded-full bg-black/30">
                    {image.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center p-12">
            <p className="text-gray-500">아직 등록된 이미지가 없습니다.</p>
          </div>
        )}

        {/* 이미지 팝업 */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/80"
                onClick={() => setSelectedImage(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 푸터 */}
        <div className="bg-gray-100 p-5 text-center text-sm text-gray-600 border-t border-gray-200">
          <p>© 2024 주정준 & 이인영의 결혼식</p>
          <p className="mt-1 text-xs text-gray-500">함께 해주셔서 감사합니다</p>
        </div>
      </div>
    </main>
  );
}
