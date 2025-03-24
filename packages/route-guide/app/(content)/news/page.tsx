import { NewsList } from "@/app/components/news";
import { getAllNews } from "@/lib/news";

export default function NewsPage() {
  return (
    <>
      <NewsList news={getAllNews()} />
    </>
  );
}
