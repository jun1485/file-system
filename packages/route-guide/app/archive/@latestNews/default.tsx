import { NewsList } from "@/app/components/news";
import { getLatestNews } from "@/lib/news";

export default function LatestNewsPage() {
  const latestNews = getLatestNews();

  return (
    <div>
      <h1>Latest News</h1>
      <NewsList news={latestNews} />
    </div>
  );
}
