import { atom, selector } from "recoil";

export const weddingDateState = atom<Date>({
  key: "weddingDate",
  default: new Date("2026-05-16T14:00:00"),
});

export const remainingDaysState = selector<number>({
  key: "remainingDays",
  get: ({ get }) => {
    const weddingDate = get(weddingDateState);
    const today = new Date();
    const diffTime = weddingDate.getTime() - today.getTime();

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
});
