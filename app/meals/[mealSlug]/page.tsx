import Image from "next/image";
import classes from "./page.module.css";
import { getMeal } from "@/lib/meals";
import MealNotFound from "../NotFound";

export default function MealDetailPage({
  params,
}: {
  params: { mealSlug: string };
}) {
  const meal = getMeal(params.mealSlug);
  if (!meal) {
    return <MealNotFound />;
  }

  meal.instructions = meal.instructions.replace(/\n/g, "<br>");
  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>
        <div className={classes.headerText}>
          <h2>{meal.title}</h2>
          <p className={classes.creator}>
            by <a href={`mailTo:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{
            __html: meal.instructions,
          }}
        ></p>
      </main>
    </>
  );
}
