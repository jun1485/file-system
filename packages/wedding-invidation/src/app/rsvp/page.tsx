"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import NavigationMenu from "../component/navigation/navigation-menu";

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: "",
    guests: "1",
    attending: "yes",
    message: "",
    phone: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("제출된 데이터:", formData);
    // 여기에 실제 폼 제출 로직 구현 (이메일 발송, DB 저장 등)
    setSubmitted(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-background">
      <div className="max-w-3xl w-full bg-card-bg rounded-xl shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div className="wedding-gradient text-center p-8 text-white">
          <h1 className="text-3xl font-serif mb-2">참석 여부</h1>
          <p>소중한 날에 함께해 주세요</p>
        </div>

        {/* 내비게이션 메뉴 */}
        <NavigationMenu />

        {/* 폼 */}
        <div className="p-8 md:p-10">
          {!submitted ? (
            <>
              <div className="max-w-md mx-auto">
                <p className="text-center text-gray-600 mb-8">
                  2024년 12월 1일 일요일 오후 2시
                  <br />
                  신도림 더 링크 호텔
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      이름 <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="이름을 입력해주세요"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      연락처 <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="010-0000-0000"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="guests"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      참석 인원 <span className="text-pink-500">*</span>
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}명
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-3">
                      참석 여부 <span className="text-pink-500">*</span>
                    </span>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-pink-50 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="attending"
                          value="yes"
                          checked={formData.attending === "yes"}
                          onChange={handleChange}
                          className="text-pink-500 focus:ring-pink-400 mr-3"
                        />
                        <div>
                          <p className="font-medium">참석합니다</p>
                          <p className="text-sm text-gray-500">
                            초대해 주셔서 감사합니다
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-pink-50 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="attending"
                          value="no"
                          checked={formData.attending === "no"}
                          onChange={handleChange}
                          className="text-pink-500 focus:ring-pink-400 mr-3"
                        />
                        <div>
                          <p className="font-medium">불참합니다</p>
                          <p className="text-sm text-gray-500">
                            일정이 맞지 않아 참석하지 못합니다
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      축하 메시지 (선택사항)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="축하 메시지를 남겨주세요"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                  >
                    제출하기
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-serif mb-2">감사합니다!</h2>
              <p className="text-gray-600 mb-8">
                {formData.attending === "yes"
                  ? "참석 의사가 성공적으로 전달되었습니다."
                  : "참석 여부가 성공적으로 전달되었습니다."}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary"
              >
                다시 작성하기
              </button>
            </div>
          )}
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
