import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "./MealsGrid";
import { getMeals } from "@/lib/meals";

export default async function MealsPage() {
  const meals = await getMeals();

  return (
    <>
      <header className={classes.header}>
        <main>
          <h1>
            delicious meals
            <span className={classes.highlight}> by you</span>
          </h1>
          <p>
            Choose your favorite meal from our broad selection of available
            meals and enjoy a delicious lunch or dinner at home.
          </p>
          <p className={classes.cta}>
            <Link href="/meals/share">
              <span>Share your favorite recipe</span>
            </Link>
          </p>
        </main>
      </header>

      <main className={classes.main}>
        <MealsGrid meals={meals} />
      </main>
    </>
  );
}
