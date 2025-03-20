import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainHeader() {
  const pathname = usePathname();
  return (
    <header id="main-header">
      <div id="logo">
        <Link href="/">News</Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/" className={pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/news" className={pathname === "/news" ? "active" : ""}>
              News
            </Link>
          </li>
          <li>
            <Link
              href="/archive"
              className={pathname === "/archive" ? "active" : ""}
            >
              Archive
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
