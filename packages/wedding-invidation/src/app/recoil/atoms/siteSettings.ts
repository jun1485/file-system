import { atom } from "recoil";

// 사이트 설정 인터페이스
export interface SiteSettings {
  mainImageUrl: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  mainImageUrl:
    "https://firebasestorage.googleapis.com/v0/b/wedding-invitation-c4b0d.firebasestorage.app/o/galleries%2FChatGPT_Image_2025_1743585856385?alt=media&token=bd8de381-2c1e-424b-b6e2-81f2b57aa1e4",
};

export const siteSettingsState = atom<SiteSettings>({
  key: "siteSettings",
  default: DEFAULT_SETTINGS,
});

export const mainImageUrlState = atom<string>({
  key: "mainImageUrl",
  default: DEFAULT_SETTINGS.mainImageUrl,
});
