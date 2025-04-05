"use client";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApp } from "firebase/app";

// 클라이언트에서 Firebase 초기화
function initClientFirebase() {
  if (typeof window === "undefined") {
    return { db: null };
  }

  // 환경 변수에서 Firebase 설정 값 가져오기
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  try {
    let app;
    try {
      app = getApp();
    } catch {
      app = initializeApp(firebaseConfig);
    }

    const db = getFirestore(app);
    return { db };
  } catch (error) {
    console.error("Firebase 초기화 오류:", error);
    return { db: null };
  }
}

// Firestore 서비스 초기화
const { db } = initClientFirebase();

// 사이트 설정 인터페이스
export interface SiteSettings {
  mainImageUrl: string;
}

// 기본 설정 값
const DEFAULT_SETTINGS: SiteSettings = {
  mainImageUrl:
    "https://firebasestorage.googleapis.com/v0/b/wedding-invitation-c4b0d.firebasestorage.app/o/galleries%2FChatGPT_Image_2025_1743585856385?alt=media&token=bd8de381-2c1e-424b-b6e2-81f2b57aa1e4",
};

// 설정 저장하기
export async function saveSettings(
  settings: Partial<SiteSettings>
): Promise<boolean> {
  try {
    if (!db) {
      console.error("Firestore 초기화 실패");
      return false;
    }

    // 기존 설정을 먼저 가져옴
    const currentSettings = await getSettings();

    // 새 설정과 병합
    const updatedSettings = {
      ...currentSettings,
      ...settings,
    };

    // Firestore에 저장
    const settingsRef = doc(db, "settings", "site");
    await setDoc(settingsRef, updatedSettings);

    console.log("설정이 저장되었습니다:", updatedSettings);
    return true;
  } catch (error) {
    console.error("설정 저장 오류:", error);
    return false;
  }
}

// 설정 가져오기
export async function getSettings(): Promise<SiteSettings> {
  try {
    if (!db) {
      console.error("Firestore 초기화 실패");
      return DEFAULT_SETTINGS;
    }

    const settingsRef = doc(db, "settings", "site");
    const docSnap = await getDoc(settingsRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as SiteSettings;
      return {
        ...DEFAULT_SETTINGS, // 기본값 포함
        ...data, // 저장된 데이터로 덮어씀
      };
    } else {
      // 설정이 존재하지 않으면 기본값 반환
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error("설정 가져오기 오류:", error);
    return DEFAULT_SETTINGS;
  }
}

// 메인 이미지 URL 저장
export async function saveMainImageUrl(url: string): Promise<boolean> {
  return await saveSettings({ mainImageUrl: url });
}

// 메인 이미지 URL 가져오기
export async function getMainImageUrl(): Promise<string> {
  const settings = await getSettings();
  return settings.mainImageUrl;
}
