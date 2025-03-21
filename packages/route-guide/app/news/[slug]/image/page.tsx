import { DUMMY_NEWS } from "@/app/dummy/dummy-news";
import { notFound } from "next/navigation";

export default function NewsImagePage({
  params,
}: {
  params: { slug: string };
}) {
  const newsItemSlug = params.slug;
  const newsItem = DUMMY_NEWS.find((news) => news.slug === newsItemSlug);

  if (!newsItem) {
    return notFound();
  }

  return (
    <div className="fullscreen-image">
      <img src={`/images/news/${newsItemSlug}.jpg`} />
    </div>
  );
}
