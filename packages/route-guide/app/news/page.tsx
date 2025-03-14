import { getAllNews } from "@/lib/news";
import { NewsList } from "../components/news";

export default function NewsPage() {
  return (
    <>
      <NewsList news={getAllNews()} />
    </>
  );
}
