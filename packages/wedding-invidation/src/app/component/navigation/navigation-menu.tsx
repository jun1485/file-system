"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationMenu() {
  // 현재 경로 가져오기
  const pathname = usePathname();

  // 네비게이션 항목 정의
  const navItems = [
    { href: "/", label: "홈" },
    { href: "/gallery", label: "갤러리" },
    { href: "/location", label: "오시는 길" },
    { href: "/rsvp", label: "참석 여부" },
  ];

  return (
    <div className="flex justify-center py-1 border-b border-pink-100">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-5 py-4 transition-all relative ${
              isActive
                ? "text-pink-500 font-medium"
                : "text-gray-600 hover:text-pink-400"
            }`}
          >
            {item.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-400"></span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
