import Link from "next/link";

export default function NewsPage() {
  return (
    <>
      <Link href="/news/news1">
        <p>News1</p>
      </Link>
      <Link href="/news/news2">
        <p>News2</p>
      </Link>
      <Link href="/news/news3">
        <p>News3</p>
      </Link>
    </>
  );
}
