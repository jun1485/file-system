"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  fetchGalleryImages,
  GalleryImage,
} from "../../services/gallery-service";
import { Footer } from "../component/footer";
import { NavigationMenu } from "../component/navigation";

export default function Gallery() {
  // 이미지 상태 관리
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // 선택된 이미지 상태
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  // 필터 상태
  const [filter, setFilter] = useState("전체");
  // 에러 상태 추가
  const [error, setError] = useState<string | null>(null);
  // 이미지 로딩 상태 관리
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // 이미지 불러오기
  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("갤러리 이미지 로딩 시작");
        const images = await fetchGalleryImages();
        console.log("갤러리 이미지 로딩 완료:", images);
        setGalleryImages(images);
      } catch (err) {
        console.error("갤러리 이미지 로딩 실패:", err);
        setError("이미지를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  // 필터링된 이미지
  const filteredImages =
    filter === "전체"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  // 이미지 클릭 핸들러
  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  // Next.js의 Image 컴포넌트를 위한 오류 처리 설정
  const imageProps = {
    unoptimized: true, // 외부 이미지 최적화 문제를 방지
    onError: () => {
      console.error("이미지 로드 실패");
    },
  };

  // 날짜를 문자열로 변환하는 함수
  const getDateString = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 이미지 로딩 완료 핸들러
  const handleImageLoaded = (id: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  // 로딩 및 오류 UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg">이미지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

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
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <div className="relative w-full h-64">
                  {!loadedImages[image.id] && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-50">
                      <div className="w-10 h-10 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={500}
                    height={350}
                    className={`w-full h-full object-cover hover:scale-105 transition duration-300 ${
                      !loadedImages[image.id] ? "opacity-0" : "opacity-100"
                    }`}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZkZTZmMSIvPjwvc3ZnPg=="
                    onLoadingComplete={() => handleImageLoaded(image.id)}
                    {...imageProps}
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-700">{image.alt}</p>
                  <p className="text-sm text-gray-500">
                    {getDateString(image.createdAt)}
                  </p>
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
              <div className="relative w-full h-full flex items-center justify-center">
                {!loadedImages[`popup-${selectedImage.id}`] && (
                  <div className="absolute inset-0 flex justify-center items-center">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
                  </div>
                )}
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={1000}
                  height={800}
                  className={`max-w-full max-h-full object-contain ${
                    !loadedImages[`popup-${selectedImage.id}`]
                      ? "opacity-0"
                      : "opacity-100"
                  }`}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZkZTZmMSIvPjwvc3ZnPg=="
                  onLoadingComplete={() =>
                    handleImageLoaded(`popup-${selectedImage.id}`)
                  }
                  {...imageProps}
                />
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </main>
  );
}
