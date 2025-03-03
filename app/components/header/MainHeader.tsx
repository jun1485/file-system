import Link from "next/link";

import classes from "./MainHeader.module.css";
import Image from "next/image";
import logo from "@/app/assets/logo.png";
import NavLink from "./NavLink";

function MainHeader() {
  return (
    <header className={classes.header}>
      <Link className={classes.logo} href="/">
        <Image src={logo} alt="logo" priority />
        Foodie
      </Link>

      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink href="/meals">Meals</NavLink>
          </li>
          <li>
            <NavLink href="/community">Community</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainHeader;
