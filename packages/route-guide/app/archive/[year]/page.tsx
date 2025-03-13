import { NewsList } from "@/app/components/news";
import { getNewsForYear } from "@/lib/news";

export default function FilteredNewsPage({
  params,
}: {
  params: { year: string };
}) {
  const newsYear = params.year;
  const filteredNews = getNewsForYear(newsYear);

  return (
    <div>
      <h1></h1>
      <NewsList news={filteredNews} />
    </div>
  );
}
