"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./NavLink.module.css";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const isActive = (_path: string) => {
    return _path.startsWith(path)
      ? `${classes.link} ${classes.active}`
      : classes.link;
  };

  return (
    <Link href={href} className={isActive(href)}>
      {children}
    </Link>
  );
}
