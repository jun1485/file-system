import Link from "next/link";
import PostList from "./components/post/PostList";

export default function Home() {
  return (
    <div>
      <Link href="/main">Go to route</Link>

      <PostList />
    </div>
  );
}
