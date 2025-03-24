import { NewsList } from "@/app/components/news";
import {
  getAvailableNewsMonths,
  getAvailableNewsYears,
  getAllNews,
  getNewsForYear,
  getNewsForYearAndMonth,
} from "@/lib/news";
import Link from "next/link";

export default function FilteredNewsPage({
  params,
}: {
  params: { filter?: string[] };
}) {
  const filter = params.filter || [];
  const selectedYear = filter[0];
  const selectedMonth = filter[1];

  let news;
  let years = [];
  let months = [];

  // 초기 상태 (필터 없음): 모든 뉴스와 연도 목록 표시
  if (!selectedYear) {
    news = getAllNews();
    years = getAvailableNewsYears();
  }
  // 연도만 선택된 상태: 해당 연도의 뉴스와 월 목록 표시
  else if (selectedYear && !selectedMonth) {
    news = getNewsForYear(selectedYear);
    months = getAvailableNewsMonths(selectedYear);
  }
  // 연도와 월 모두 선택: 해당 연도/월의 뉴스 표시
  else if (selectedYear && selectedMonth) {
    news = getNewsForYearAndMonth(selectedYear, selectedMonth);
  }

  let newsContent = <p>뉴스가 없습니다.</p>;
  if (news && news.length > 0) {
    newsContent = <NewsList news={news} />;
  }

  return (
    <>
      <header id="archive-header">
        <nav>
          {/* 연도 목록 표시 (필터가 없을 때) */}
          {!selectedYear && years.length > 0 && (
            <ul>
              {years.map((year) => (
                <li key={year}>
                  <Link href={`/archive/${year}`}>{year}년</Link>
                </li>
              ))}
            </ul>
          )}

          {/* 월 목록 표시 (연도만 선택되었을 때) */}
          {selectedYear && months.length > 0 && (
            <ul>
              {months.map((month) => (
                <li key={month}>
                  <Link href={`/archive/${selectedYear}/${month}`}>
                    {month}월
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </header>
      {newsContent}
    </>
  );
}
