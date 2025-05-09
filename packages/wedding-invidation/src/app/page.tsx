"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { NavigationMenu } from "./component/navigation";
import { Footer } from "./component/footer";
import { getMainImageUrl } from "../services/settings-service";
import { AudioPlayBtn } from "./component/button";
import { weddingDateState, remainingDaysState } from "./recoil/atoms/wedding";
import { useRecoilValue } from "recoil";

export default function Home() {
  const weddingDate = useRecoilValue(weddingDateState);
  const remainingDays = useRecoilValue(remainingDaysState);
  // 메인 이미지 URL 상태 추가
  const [mainImageUrl, setMainImageUrl] = useState<string>(
    "https://firebasestorage.googleapis.com/v0/b/wedding-invitation-c4b0d.firebasestorage.app/o/galleries%2FChatGPT_Image_2025_1743585856385?alt=media&token=bd8de381-2c1e-424b-b6e2-81f2b57aa1e4"
  );

  useEffect(() => {
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

        <AudioPlayBtn />

        {/* 결혼식까지 남은 날짜 */}
        <div className="bg-pink-50 py-3 text-center">
          <span className="text-pink-500 font-medium">
            {remainingDays > 0
              ? `결혼식까지 ${remainingDays}일 남았습니다.`
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

        <Footer />
      </div>
    </main>
  );
}
