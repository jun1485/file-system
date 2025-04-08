"use client";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApp } from "firebase/app";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getStorage } from "firebase/storage";
import { SiteSettings } from "@/app/recoil/atoms/siteSettings";
import { DEFAULT_SETTINGS } from "@/app/recoil/atoms/siteSettings";

// 클라이언트에서 Firebase 초기화
function initClientFirebase() {
  if (typeof window === "undefined") {
    return { db: null, storage: null };
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
    const storage = getStorage(app);
    return { db, storage };
  } catch (error) {
    console.error("Firebase 초기화 오류:", error);
    return { db: null, storage: null };
  }
}

// Firestore 서비스 초기화
const { db, storage } = initClientFirebase();

// 메인 이미지 경로 상수
const MAIN_IMAGE_PATH = "main/main-image";

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

// 메인 이미지 파일 업로드
export async function uploadMainImage(file: File): Promise<string> {
  try {
    if (!storage || !db) {
      console.error("Firebase 서비스 초기화 실패");
      throw new Error("Firebase 서비스가 초기화되지 않았습니다");
    }

    // 이전 설정에서 이미지 URL 가져오기
    const currentSettings = await getSettings();
    const previousUrl = currentSettings.mainImageUrl;
    let previousRef = null;

    // 이전 이미지 참조 가져오기 (URL에서 경로 추출)
    if (
      previousUrl &&
      previousUrl.includes("o/") &&
      previousUrl.includes("?")
    ) {
      try {
        const pathPart = previousUrl.split("o/")[1].split("?")[0];
        const decodedPath = decodeURIComponent(pathPart);
        if (decodedPath !== MAIN_IMAGE_PATH) {
          // 기본 이미지가 아닌 경우만 삭제
          previousRef = ref(storage, decodedPath);
        }
      } catch (e) {
        console.log("이전 이미지 경로 추출 실패:", e);
      }
    }

    // 메인 이미지를 항상 동일한 경로에 저장 - 이름 고정
    const storageRef = ref(storage, MAIN_IMAGE_PATH);

    // 새 이미지 업로드
    console.log("메인 이미지 업로드 시작...");
    await uploadBytes(storageRef, file);
    console.log("메인 이미지 업로드 완료");

    // 이미지 URL 가져오기
    const downloadURL = await getDownloadURL(storageRef);
    console.log("새 메인 이미지 URL:", downloadURL);

    // 설정에 새 URL 저장
    await saveSettings({ mainImageUrl: downloadURL });

    // 이전 이미지 삭제 시도 (있는 경우)
    if (previousRef) {
      try {
        console.log("이전 메인 이미지 삭제 시도...");
        await deleteObject(previousRef);
        console.log("이전 메인 이미지 삭제 완료");
      } catch (deleteError) {
        console.warn("이전 이미지 삭제 실패:", deleteError);
        // 삭제 실패는 업로드 성공에 영향을 주지 않음
      }
    }

    return downloadURL;
  } catch (error) {
    console.error("메인 이미지 업로드 오류:", error);
    throw error;
  }
}
