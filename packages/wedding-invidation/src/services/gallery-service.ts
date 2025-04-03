"use client";

import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { initializeApp, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// 클라이언트에서 Firebase 초기화
function initClientFirebase() {
  if (typeof window === "undefined") {
    return { storage: null, db: null };
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

    const storage = getStorage(app);
    const db = getFirestore(app);
    return { storage, db };
  } catch (error) {
    console.error("Firebase 초기화 오류:", error);
    return { storage: null, db: null };
  }
}

// Firebase 서비스 초기화
const { storage, db } = initClientFirebase();

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  createdAt: number;
}

// 로컬 테스트 모드 설정 (true면 Firebase 사용 안함)
// 수정: 실제 Firebase 사용을 위해 false로 변경
const useLocalDataMode = false;

// 로컬 개발 환경에서 임시 이미지 데이터
const LOCAL_IMAGES: GalleryImage[] = [
  {
    id: "local-1",
    src: "https://via.placeholder.com/800x600",
    alt: "웨딩 사진 1",
    category: "웨딩촬영",
    createdAt: Date.now(),
  },
  {
    id: "local-2",
    src: "https://via.placeholder.com/800x600",
    alt: "프로포즈 사진",
    category: "프로포즈",
    createdAt: Date.now() - 86400000,
  },
  {
    id: "local-3",
    src: "https://via.placeholder.com/800x600",
    alt: "데이트 사진",
    category: "데이트",
    createdAt: Date.now() - 172800000,
  },
];

// 로컬 더미 이미지 생성 함수
function createLocalDummyImage(
  file: File,
  category: string,
  alt: string
): GalleryImage {
  const timestamp = Date.now();
  return {
    id: `local-${timestamp}`,
    src: `https://via.placeholder.com/800x600?text=${encodeURIComponent(
      file.name
    )}`,
    alt: alt || "웨딩 사진",
    category: category || "웨딩촬영",
    createdAt: timestamp,
  };
}

// CORS 우회를 위해 프록시 URL 생성
const createProxyUrl = (originalUrl: string): string => {
  // 개발 환경이면 프록시 API 사용
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "localhost"
  ) {
    return `/api/storage-proxy?url=${encodeURIComponent(originalUrl)}`;
  }
  // 프로덕션 환경이면 원본 URL + alt=media 사용
  return originalUrl + "?alt=media";
};

// 이미지 업로드 함수
export async function uploadImage(
  file: File,
  category: string,
  alt: string
): Promise<GalleryImage> {
  console.log("Gallery Service: 이미지 업로드 시작", { category, alt });

  // 로컬 테스트 모드
  if (useLocalDataMode) {
    console.log("로컬 데이터 모드: 더미 이미지 생성");
    // 지연시간 추가 (업로드 시뮬레이션)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const dummyImage = createLocalDummyImage(file, category, alt);
    console.log("로컬 더미 이미지 생성 완료:", dummyImage);
    return dummyImage;
  }

  // 타임아웃 프로미스 생성
  // 수정: 타임아웃 시간을 30초로 늘림
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("업로드 시간 초과")), 30000); // 30초 타임아웃
  });

  try {
    // Promise.race로 타임아웃 적용
    return await Promise.race([
      // 실제 업로드 로직을 비동기 함수로 래핑
      (async () => {
        // 수정: Firebase 서비스 유효성 검사 추가
        if (!storage || !db) {
          console.error("Firebase 서비스가 초기화되지 않았습니다");
          throw new Error("Firebase 서비스 초기화 실패");
        }

        // 실제 Firebase 로직
        // 1. Storage에 이미지 업로드
        const timestamp = Date.now();
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const fileName = `galleries/${safeFileName.split(".")[0]}-${timestamp}`;
        console.log("파일 경로:", fileName);

        const storageRef = ref(storage, fileName);
        console.log("스토리지 참조 생성");

        // 파일 업로드
        console.log("스토리지에 파일 업로드 시작...");
        const uploadResult = await uploadBytes(storageRef, file);
        console.log("스토리지 업로드 완료:", uploadResult.ref.fullPath);

        // 다운로드 URL 가져오기
        console.log("다운로드 URL 가져오기 시작...");
        const downloadURL = await getDownloadURL(storageRef);
        console.log("다운로드 URL 획득:", downloadURL);

        // CORS 우회를 위한 URL 처리
        const corsProofURL = createProxyUrl(downloadURL);
        console.log("CORS 우회 URL:", corsProofURL);

        // 이미지 문서 데이터 준비
        const docData = {
          src: corsProofURL,
          alt: alt || "웨딩 사진",
          category: category || "웨딩촬영",
          createdAt: timestamp,
        };
        console.log("문서 데이터 준비됨:", JSON.stringify(docData));

        // 2. Firestore에 메타데이터 저장
        try {
          console.log("Firestore에 문서 저장 시작...");
          const docRef = await addDoc(collection(db, "gallery"), docData);
          console.log("Firestore 문서 생성됨, ID:", docRef.id);

          // 새로 생성된 문서 반환
          const newImage = {
            id: docRef.id,
            ...docData,
          };

          console.log("최종 이미지 데이터:", newImage);
          return newImage;
        } catch (firestoreError) {
          console.error("Firestore 저장 오류:", firestoreError);
          // Firestore 저장 실패해도 이미지는 업로드됨
          return {
            id: `storage-${timestamp}`,
            ...docData,
          };
        }
      })(),
      timeoutPromise,
    ]);
  } catch (error) {
    console.error("Firebase 업로드 오류:", error);
    // 오류 발생시 로컬 더미 이미지로 대체
    console.warn("Firebase 실패, 로컬 더미 이미지로 대체");
    return createLocalDummyImage(file, category, alt);
  }
}

// 모든 갤러리 이미지 가져오기
export const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
  // 디버깅: 함수 호출 확인
  console.log("fetchGalleryImages 함수 호출됨");

  if (useLocalDataMode) {
    console.log("로컬 데이터 모드 - 이미지 목록 반환");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return LOCAL_IMAGES;
  }

  // 먼저 로컬 이미지 준비 (오류 발생 시 반환)
  const localBackupImages = LOCAL_IMAGES;

  try {
    console.log("Firestore에서 갤러리 이미지 조회 시도");

    // 1. Firestore 연결 확인
    if (!db) {
      console.error("Firestore db 객체가 없습니다");
      return localBackupImages;
    }

    // 2. 콜렉션 참조 생성
    const galleryCollectionRef = collection(db, "gallery");
    console.log("갤러리 콜렉션 참조 생성:", galleryCollectionRef);

    // 3. 쿼리 실행
    console.log("Firestore 쿼리 실행 시작");
    const querySnapshot = await getDocs(galleryCollectionRef);
    console.log("Firestore 쿼리 완료:", querySnapshot.size, "개 문서");

    // 4. 결과 처리
    if (querySnapshot.empty) {
      console.log("조회된 문서가 없음, 로컬 이미지 반환");
      return localBackupImages;
    }

    // 5. 문서 데이터 변환
    const images: GalleryImage[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      images.push({
        id: doc.id,
        src: data.src || "https://via.placeholder.com/800x600",
        alt: data.alt || "웨딩 사진",
        category: data.category || "웨딩촬영",
        createdAt: data.createdAt || Date.now(),
      });
    });

    console.log("변환된 이미지 데이터:", images.length, "개");

    // 6. 이미지 배열 반환
    return images.length > 0 ? images : localBackupImages;
  } catch (error) {
    console.error("Firestore 데이터 가져오기 오류:", error);

    // 오류 발생 시 Storage에서 직접 조회 시도
    try {
      console.log("Storage에서 직접 이미지 목록 조회");

      if (!storage) {
        console.error("Storage 객체가 없습니다");
        return localBackupImages;
      }

      const galleryRef = ref(storage, "galleries");
      const listResult = await listAll(galleryRef);

      console.log("Storage 조회 결과:", listResult.items.length, "개 파일");

      if (listResult.items.length === 0) {
        return localBackupImages;
      }

      const storageImages = await Promise.all(
        listResult.items.map(async (item, index) => {
          try {
            const url = await getDownloadURL(item);
            return {
              id: `storage-${index}`,
              src: url,
              alt: "Storage 이미지",
              category: "웨딩촬영",
              createdAt: Date.now() - index * 86400000,
            };
          } catch (dlError) {
            console.error("이미지 URL 가져오기 오류:", dlError);
            return null;
          }
        })
      );

      // null 값 필터링
      const validImages = storageImages.filter(
        (img) => img !== null
      ) as GalleryImage[];

      return validImages.length > 0 ? validImages : localBackupImages;
    } catch (storageError) {
      console.error("Storage 조회 오류:", storageError);
      return localBackupImages;
    }
  }
};
