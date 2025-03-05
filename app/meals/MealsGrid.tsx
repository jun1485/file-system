import MealItem from "./MealItem";
import classes from "./MealsGrid.module.css";

interface MealItemProps {
  id: string;
  title: string;
  slug: string;
  image: string;
  summary: string;
  creator: string;
}
export default function MealsGrid({ meals }: { meals: MealItemProps[] }) {
  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
}
