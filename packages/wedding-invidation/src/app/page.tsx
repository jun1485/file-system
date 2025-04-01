"use client";

import Image from "next/image";
import NavigationMenu from "./component/navigation/navigation-menu";
import { useEffect, useState } from "react";

export default function Home() {
  // 결혼식까지 남은 날짜 계산
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const weddingDate = new Date("2026-04-01T14:00:00");

  useEffect(() => {
    const today = new Date();
    const diffTime = weddingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);
  }, []);

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
            2024년 12월 1일 일요일 오후 2시
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

        {/* 메인 이미지 */}
        <div className="relative w-full h-[450px]">
          <Image
            src="/wedding-placeholder.jpg"
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

        {/* 푸터 */}
        <div className="bg-gray-100 p-5 text-center text-sm text-gray-600 border-t border-gray-200">
          <p>© 2024 주정준 & 이인영의 결혼식</p>
          <p className="mt-1 text-xs text-gray-500">함께 해주셔서 감사합니다</p>
        </div>
      </div>
    </main>
  );
}
