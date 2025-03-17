import Link from "next/link";
import { News } from "./type";

export default function NewsList({ news }: { news: News[] }) {
  return (
    <ul className="news-list">
      {news.map((news) => (
        <li key={news.id}>
          <Link href={`/news/${news.slug}`}>
            <img src={`/images/news/${news.slug}.jpg`} alt={news.title} />
            <p>{news.title}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
