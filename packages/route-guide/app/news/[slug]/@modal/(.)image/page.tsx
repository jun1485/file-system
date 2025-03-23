"use client";

import { DUMMY_NEWS } from "@/app/dummy/dummy-news";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

export default function InterceptedNewsImagePage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const newsItemSlug = params.slug;
  const newsItem = DUMMY_NEWS.find((news) => news.slug === newsItemSlug);

  if (!newsItem) {
    return notFound();
  }

  return (
    <>
      <div className="modal-backdrop" onClick={() => router.back()}>
        <dialog className="modal" open>
          <img
            src={`/images/news/${newsItemSlug}.jpg`}
            className="fullscreen-image"
          />
        </dialog>
      </div>
    </>
  );
}
