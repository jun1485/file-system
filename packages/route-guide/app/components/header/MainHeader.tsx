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
            <HeaderLink href="/" pathname={pathname}>
              Home
            </HeaderLink>
          </li>
          <li>
            <HeaderLink href="/news" pathname={pathname}>
              News
            </HeaderLink>
          </li>
          <li>
            <HeaderLink href="/archive" pathname={pathname}>
              Archive
            </HeaderLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function HeaderLink({
  href,
  children,
  pathname,
}: {
  href: string;
  children: React.ReactNode;
  pathname: string;
}) {
  return (
    <Link href={href} className={pathname === href ? "active" : ""}>
      {children}
    </Link>
  );
}
