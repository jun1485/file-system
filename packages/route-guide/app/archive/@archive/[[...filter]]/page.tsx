import { NewsList } from "@/app/components/news";
import {
  getAvailableNewsMonths,
  getNewsForYear,
  getNewsForYearAndMonth,
} from "@/lib/news";
import Link from "next/link";

export default function FilteredNewsPage({
  params,
}: {
  params: { filter: string[] };
}) {
  const filter = params.filter;
  const selectedYear = filter?.[0];
  const selectedMonth = filter?.[1];

  let news;
  let months = getAvailableNewsMonths(selectedYear);

  if (selectedYear && !selectedMonth) {
    news = getNewsForYear(selectedYear);
    months = getAvailableNewsMonths(selectedYear);
  }

  if (selectedYear && selectedMonth) {
    news = getNewsForYearAndMonth(selectedYear, selectedMonth);
    months = [];
  }

  let newsContent = <p>뉴스가 없습니다.</p>;

  if (news && news.length > 0) {
    newsContent = <NewsList news={news} />;
  }

  return (
    <>
      <header id="archive-header">
        <nav>
          <ul>
            {months?.map((month) => {
              const href = selectedYear
                ? `/archive/${selectedYear}/${month}`
                : `/archive/${month}`;
              return (
                <li key={month}>
                  <Link href={href}>{month}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      {newsContent}
    </>
  );
}
