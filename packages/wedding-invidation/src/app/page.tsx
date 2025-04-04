"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { NavigationMenu } from "./component/navigation";
import { Footer } from "./component/footer";
import { getMainImageUrl } from "../services/settings-service";

export default function Home() {
  // 결혼식까지 남은 날짜 계산
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const weddingDate = new Date("2026-05-16T14:00:00");
  // 메인 이미지 URL 상태 추가
  const [mainImageUrl, setMainImageUrl] = useState<string>(
    "https://firebasestorage.googleapis.com/v0/b/wedding-invitation-c4b0d.firebasestorage.app/o/galleries%2FChatGPT_Image_2025_1743585856385?alt=media&token=bd8de381-2c1e-424b-b6e2-81f2b57aa1e4"
  );

  useEffect(() => {
    // 결혼식까지 남은 날짜 계산
    const today = new Date();
    const diffTime = weddingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);

    // 메인 이미지 URL 가져오기
    const loadMainImageUrl = async () => {
      try {
        const url = await getMainImageUrl();
        if (url) {
          setMainImageUrl(url);
        }
      } catch (error) {
        console.error("메인 이미지 URL 로딩 오류:", error);
      }
    };

    loadMainImageUrl();
  }, [weddingDate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-background text-foreground">
      <div className="max-w-3xl w-full bg-card-bg rounded-xl shadow-lg overflow-hidden">
        {/* 청첩장 헤더 */}
        <div className="wedding-gradient text-center p-10 text-white shadow-inner">
          <h1 className="text-4xl font-serif mb-3 font-medium">
            주정준 & 이인영
          </h1>
          <p className="text-lg">우리의 결혼을 알려드립니다</p>
          <div className="mt-6 inline-block px-6 py-2 bg-white/30 backdrop-blur-sm rounded-full text-white">
            2026년 5월 16일 토요일 오후 3시
          </div>
        </div>

        {/* 결혼식까지 남은 날짜 */}
        <div className="bg-pink-50 py-3 text-center">
          <span className="text-pink-500 font-medium">
            {daysLeft > 0
              ? `결혼식까지 ${daysLeft}일 남았습니다.`
              : "오늘이 결혼식입니다!"}
          </span>
        </div>

        {/* 메인 이미지 - 동적 URL 사용 */}
        <div className="relative w-full h-[450px]">
          <Image
            src={mainImageUrl}
            alt="웨딩 이미지"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* 내비게이션 메뉴 */}
        <NavigationMenu />

        {/* 메인 콘텐츠 */}
        <div className="p-10">
          <div className="section-title">초대합니다</div>
          <p className="my-8 text-center leading-7 text-gray-700">
            서로 다른 길을 걸어온 저희 두 사람이
            <br />
            이제 같은 길을 함께 걷고자 합니다.
            <br />
            <br />
            귀한 걸음 하시어 축복해 주시면
            <br />
            더없는 기쁨으로 간직하겠습니다.
          </p>

          <div className="mt-16 flex flex-col md:flex-row gap-8 justify-center">
            <div className="flex-1 card p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-pink-100 mx-auto mb-4 flex items-center justify-center">
                <span className="text-pink-500 text-2xl font-serif">신랑</span>
              </div>
              <p className="font-medium text-lg">주정준</p>
              <p className="mt-1 text-gray-500">### & ### 의 아들</p>
              <a
                href="tel:010-6307-1485"
                className="mt-4 inline-block btn-secondary text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                연락하기
              </a>
            </div>

            <div className="flex-1 card p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-purple-100 mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-500 text-2xl font-serif">
                  신부
                </span>
              </div>
              <p className="font-medium text-lg">이인영</p>
              <p className="mt-1 text-gray-500">### & ### 의 딸</p>
              <a
                href="tel:010-0000-0000"
                className="mt-4 inline-block btn-secondary text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                연락하기
              </a>
            </div>
          </div>
        </div>

        {/* 결혼식장 정보 섹션 추가 */}
        <div className="p-10 bg-pink-50">
          <div className="section-title relative">
            오시는 길{/* 제목 데코레이션 */}
            <div className="absolute -top-4 -right-6 w-12 h-12 opacity-70 pointer-events-none rotate-45">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/wedding-invitation-c4b0d.firebasestorage.app/o/decorations%2Fflower4.png?alt=media"
                alt="꽃 데코"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="font-serif text-xl text-center mb-4 text-pink-600">
              구로 웨딩홀
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {/* 지도 이미지 - 네이버 지도 스크린샷으로 교체 */}
                <div className="relative w-full h-60 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/wedding-invitation-c4b0d.firebasestorage.app/o/maps%2Fnaver_map.jpg?alt=media"
                    alt="네이버 지도 - 결혼식장 위치"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/wedding-invitation-c4b0d.firebasestorage.app/o/logos%2Fnaver_map_logo.png?alt=media"
                      alt="네이버 지도 로고"
                      width={60}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">주소</h4>
                  <p className="text-gray-600">서울특별시 구로구 경인로 610</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">지하철</h4>
                  <p className="text-gray-600">
                    1호선 구로역 1번 출구 도보 5분
                    <br />
                    2호선 신도림역 2번 출구에서 버스 이용
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">버스</h4>
                  <p className="text-gray-600">
                    구로역 정류장 하차
                    <br />
                    간선: 160, 260, 600
                    <br />
                    지선: 5614, 6512
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">주차</h4>
                  <p className="text-gray-600">
                    건물 내 주차 가능 (2시간 무료)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="https://map.naver.com/v5/search/서울특별시%20구로구%20경인로%20610"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-colors"
              >
                네이버 지도로 보기
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
