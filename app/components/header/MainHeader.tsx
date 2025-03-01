import Link from "next/link";

import classes from "./MainHeader.module.css";
import Image from "next/image";
import logo from "@/app/assets/logo.png";

function MainHeader() {
  return (
    <header className={classes.header}>
      <Link className={classes.logo} href="/">
        <Image src={logo} alt="logo" width={100} height={100} priority />
        Foodie
      </Link>

      <nav className={classes.nav}>
        <ul>
          <li>
            <Link href="/meals">Meals</Link>
          </li>
          <li>
            <Link href="/community">Community</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainHeader;
