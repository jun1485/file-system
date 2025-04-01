import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { storage, db } from "../firebase/config";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  createdAt: number;
}

// 이미지 파일 업로드 함수
export const uploadImage = async (
  file: File,
  category: string,
  alt: string
): Promise<GalleryImage> => {
  try {
    // 파일 경로 생성 (galleries/파일명-타임스탬프)
    const timestamp = Date.now();
    const fileName = `${file.name.split(".")[0]}-${timestamp}`;
    const storageRef = ref(storage, `galleries/${fileName}`);

    // 파일 업로드
    await uploadBytes(storageRef, file);

    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(storageRef);

    // Firestore에 이미지 정보 저장
    const imageData = {
      src: downloadURL,
      alt: alt || "웨딩 사진",
      category,
      createdAt: timestamp,
    };

    const docRef = await addDoc(collection(db, "gallery"), imageData);

    return {
      id: docRef.id,
      ...imageData,
    };
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    throw error;
  }
};

// 모든 갤러리 이미지 가져오기
export const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    // 최신순으로 정렬하여 가져오기
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const images = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as GalleryImage)
    );

    return images;
  } catch (error) {
    console.error("갤러리 이미지 가져오기 오류:", error);
    return [];
  }
};
