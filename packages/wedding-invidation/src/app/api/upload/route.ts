import { NextRequest, NextResponse } from "next/server";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage,
} from "firebase/storage";
import { collection, addDoc, Firestore } from "firebase/firestore";
import { initializeApp, getApp, FirebaseApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// API 라우트에서만 사용할 Firebase 초기화 (서버 사이드)
function initServerFirebase() {
  // 환경 변수에서 Firebase 설정 값 가져오기
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  let app: FirebaseApp;

  try {
    app = getApp();
  } catch {
    app = initializeApp(firebaseConfig);
  }

  // Firebase 서비스 초기화
  const storage = getStorage(app);
  const db = getFirestore(app);

  return { storage, db };
}

// 서버 사이드에서 Firebase 초기화
const { storage, db } = initServerFirebase();

// 로컬 개발 테스트용 API 엔드포인트
export async function POST(request: NextRequest) {
  console.log("API 라우트: 업로드 요청 시작");

  // 타임아웃 처리
  const TIMEOUT_MS = 120000; // 120초로 증가
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(
      () => reject(new Error("API 업로드 처리 시간 초과")),
      TIMEOUT_MS
    );
  });

  try {
    // Promise.race로 타임아웃 적용
    return await Promise.race([
      // 실제 업로드 처리 로직
      (async () => {
        try {
          // 폼 데이터 파싱
          const formData = await request.formData();
          const { file, category, alt } = await parseMultipartForm(formData);

          // 추가: 파일 유효성 검사 강화
          if (!file) {
            return NextResponse.json(
              {
                error: "파일이 제공되지 않았습니다.",
                code: "FILE_MISSING",
              },
              { status: 400 }
            );
          }

          // 추가: 파일 타입 검사
          const validImageTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
          ];
          if (!validImageTypes.includes(file.type)) {
            return NextResponse.json(
              {
                error:
                  "유효하지 않은 이미지 파일 형식입니다. JPEG, PNG, GIF, WEBP 파일만 허용됩니다.",
                code: "INVALID_FILE_TYPE",
              },
              { status: 400 }
            );
          }

          // 추가: 파일 크기 검사 (10MB 제한)
          const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
          if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
              {
                error: "파일 크기가 너무 큽니다. 최대 10MB까지 허용됩니다.",
                code: "FILE_TOO_LARGE",
              },
              { status: 400 }
            );
          }

          console.log("파일 정보:", {
            이름: file.name,
            타입: file.type,
            크기: `${Math.round(file.size / 1024)} KB`,
            카테고리: category,
            설명: alt,
          });

          try {
            // 수정: Firebase 서비스 유효성 검사
            if (!storage || !db) {
              console.error("Firebase 서비스가 초기화되지 않았습니다");
              throw new Error("Firebase 서비스 초기화 실패");
            }

            // Firebase Storage에 업로드 시도
            // 파일 읽기 (Buffer로 변환)
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // 스토리지 참조 생성
            const timestamp = Date.now();
            const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
            const fileName = `galleries/${
              safeFileName.split(".")[0]
            }-${timestamp}`;
            const storageRef = ref(storage as FirebaseStorage, fileName);

            console.log("스토리지 참조 생성:", fileName);

            // 버퍼를 사용하여 스토리지에 업로드
            console.log("서버에서 Storage에 업로드 시작");
            const uploadResult = await uploadBytes(storageRef, buffer, {
              contentType: file.type,
            });
            console.log(
              "서버에서 Storage 업로드 완료:",
              uploadResult.ref.fullPath
            );

            // 다운로드 URL 가져오기
            console.log("다운로드 URL 가져오기");
            const downloadURL = await getDownloadURL(uploadResult.ref);
            console.log("다운로드 URL:", downloadURL);

            // Firestore에 메타데이터 저장
            const docData = {
              src: downloadURL,
              alt: alt || "웨딩 사진",
              category: category || "웨딩촬영",
              createdAt: timestamp,
            };

            console.log("Firestore 문서 데이터:", docData);
            const docRef = await addDoc(
              collection(db as Firestore, "gallery"),
              docData
            );
            console.log("Firestore 문서 ID:", docRef.id);

            // 이미지 데이터 반환
            const imageData = {
              id: docRef.id,
              ...docData,
            };

            return NextResponse.json(imageData, { status: 201 });
          } catch (firebaseError) {
            // 로깅 개선
            console.error("Firebase 업로드 오류:", firebaseError);

            // 추가: Firebase 에러 구분
            if (firebaseError instanceof Error) {
              // Firebase 인증 관련 오류인 경우
              if (
                firebaseError.message.includes("auth") ||
                firebaseError.message.includes("permission-denied")
              ) {
                return NextResponse.json(
                  {
                    error: "업로드 권한이 없습니다.",
                    code: "PERMISSION_DENIED",
                  },
                  { status: 403 }
                );
              }

              // 스토리지 쿼터 초과 오류인 경우
              if (
                firebaseError.message.includes("quota") ||
                firebaseError.message.includes("storage")
              ) {
                return NextResponse.json(
                  {
                    error: "스토리지 용량 한도에 도달했습니다.",
                    code: "STORAGE_QUOTA_EXCEEDED",
                  },
                  { status: 507 }
                );
              }
            }

            // Firebase 실패 시 로컬 더미 이미지로 대체
            console.warn("Firebase 업로드 실패, 로컬 더미 이미지 사용");

            // 로컬 더미 URL 생성 (개발용)
            const timestamp = Date.now();
            const imageData = {
              id: `local-${timestamp}`,
              src: `https://via.placeholder.com/800x600?text=${encodeURIComponent(
                file.name
              )}`,
              alt: alt || "웨딩 사진",
              category: category || "웨딩촬영",
              createdAt: timestamp,
            };

            // 지연 시간 추가 (업로드 시뮬레이션)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log("로컬 더미 이미지 생성 완료:", imageData);
            return NextResponse.json(imageData, { status: 201 });
          }
        } catch (parseError) {
          // 추가: 폼 데이터 파싱 오류 처리
          console.error("폼 데이터 파싱 오류:", parseError);
          return NextResponse.json(
            {
              error: "요청 데이터 처리 중 오류가 발생했습니다.",
              code: "FORM_PARSE_ERROR",
            },
            { status: 400 }
          );
        }
      })(),
      timeoutPromise,
    ]);
  } catch (error) {
    // 오류 유형에 따른 상세 로깅
    if (error instanceof Error && error.message.includes("시간 초과")) {
      console.error("API 타임아웃:", error.message);
      // 추가: 타임아웃은 408 상태 코드 사용
      return NextResponse.json(
        {
          error:
            "업로드 처리 시간이 초과되었습니다. 네트워크 상태를 확인하고 다시 시도해 주세요.",
          code: "REQUEST_TIMEOUT",
        },
        { status: 408 }
      );
    } else {
      console.error("서버 업로드 오류:", error);
    }

    // 사용자 친화적인 오류 메시지
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 업로드 오류가 발생했습니다.";

    // 추가: 에러 코드 포함
    return NextResponse.json(
      {
        error: `업로드 실패: ${errorMessage}`,
        code: "UPLOAD_FAILED",
      },
      { status: 500 }
    );
  }
}

// 멀티파트 요청 처리를 위한 함수
async function parseMultipartForm(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;
    const alt = formData.get("alt") as string;

    return { file, category, alt };
  } catch (error) {
    console.error("multipart 양식 처리 오류:", error);
    throw new Error("잘못된 양식 데이터입니다.");
  }
}
