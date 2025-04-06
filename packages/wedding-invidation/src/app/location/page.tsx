"use client";

import Image from "next/image";
import { Footer } from "../component/footer";
import { NavigationMenu } from "../component/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    naver: {
      maps: {
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (
          element: HTMLElement,
          options: {
            center: unknown;
            zoom: number;
            zoomControl: boolean;
            zoomControlOptions: {
              position: unknown;
            };
          }
        ) => unknown;
        Marker: new (options: {
          position: unknown;
          map: unknown;
          title: string;
        }) => unknown;
        Position: {
          TOP_RIGHT: unknown;
        };
      };
    };
  }
}

export default function Location() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mapScript = document.createElement("script");
    mapScript.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
    mapScript.async = true;
    document.head.appendChild(mapScript);

    const onLoadMap = () => {
      if (window.naver && mapRef.current) {
        const location = new window.naver.maps.LatLng(
          37.5054782085179,
          126.883956501896
        );

        const mapOptions = {
          center: location,
          zoom: 16,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);

        new window.naver.maps.Marker({
          position: location,
          map: map,
          title: "신도림 더링크 호텔",
        });
      }
    };

    mapScript.addEventListener("load", onLoadMap);

    return () => {
      mapScript.removeEventListener("load", onLoadMap);
      if (document.head.contains(mapScript)) {
        document.head.removeChild(mapScript);
      }
    };
  }, []);

  const transportInfo = [
    {
      type: "지하철",
      details: "1호선 구로역에서 도보 7분",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 2a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H8zm0 2h8v10H8V4zm4 12a1 1 0 100 2 1 1 0 000-2z" />
        </svg>
      ),
    },
    {
      type: "버스",
      details: "구로역 정류장",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v8zm3.5-4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm9 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM4 6c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4z" />
        </svg>
      ),
    },
    {
      type: "자가용",
      details: "호텔 내 지하주차장 이용 가능",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
        </svg>
      ),
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-background">
      <div className="max-w-3xl w-full bg-card-bg rounded-xl shadow-lg overflow-hidden">
        <div className="wedding-gradient text-center p-8 text-white">
          <h1 className="text-3xl font-serif mb-2">오시는 길</h1>
          <p>결혼식장 위치 안내</p>
        </div>

        <NavigationMenu />

        <div className="p-8">
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-md">
            <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>

            <a
              href="https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%20%EA%B5%AC%EB%A1%9C%EA%B5%AC%20%EA%B2%BD%EC%9D%B8%EB%A1%9C%20610/place/36297023?placePath=%3Fentry%253Dpll"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-pink-600 transition-colors"
            >
              길찾기
            </a>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="card p-6 mb-8">
              <h2 className="section-title text-center mb-6">결혼식장 정보</h2>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/3">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/wedding-invitation-c4b0d.firebasestorage.app/o/galleries%2F%EA%B0%80%EB%93%A0%ED%99%80.jpg?alt=media&token=484111f5-9796-44be-bc53-c237dc99a95c"
                      alt="결혼식장 이미지"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
                <div className="w-full md:w-2/3 space-y-2">
                  <h3 className="text-xl font-medium">
                    신도림 더 링크 호텔 웨딩
                  </h3>
                  <p className="text-gray-600">서울 구로구 경인로 610</p>
                  <p className="text-gray-600">
                    <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2 text-sm">
                      전화
                    </span>
                    02-852-5000
                  </p>
                  <div className="pt-2">
                    <a href="tel:02-852-5000" className="btn-primary text-sm">
                      전화하기
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="section-title">교통 안내</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {transportInfo.map((info, index) => (
                  <div key={index} className="card p-5 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center text-pink-500">
                      {info.icon}
                    </div>
                    <h3 className="font-medium mb-2">{info.type}</h3>
                    <p className="text-sm text-gray-600">{info.details}</p>
                  </div>
                ))}
              </div>

              <div className="card p-5 mt-4">
                <h3 className="font-medium mb-2">주차 안내</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2">•</span>
                    호텔 내 지하주차장 이용 가능 (3시간 무료주차)
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2">•</span>
                    발레파킹 서비스 이용 가능
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
