import slugify from "slugify";
import xss from "xss";
import fs from "node:fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const mealsFile = path.join(dataDir, "meals.json");

// 데이터 디렉토리 확인 및 생성
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 초기 meals.json 파일이 없으면 샘플 데이터로 생성
if (!fs.existsSync(mealsFile)) {
  fs.writeFileSync(mealsFile, JSON.stringify([]), "utf8");
}

function readMealsData() {
  const fileData = fs.readFileSync(mealsFile, "utf8");
  return JSON.parse(fileData);
}

function writeMealsData(data) {
  fs.writeFileSync(mealsFile, JSON.stringify(data), "utf8");
}

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return readMealsData();
}

export async function getMeal(slug) {
  const meals = readMealsData();
  return meals.find((meal) => meal.slug === slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  // public/images 디렉토리 확인 및 생성
  const imagesDir = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw error;
    }
  });

  meal.image = `/images/${fileName}`;

  const meals = readMealsData();
  meals.push(meal);
  writeMealsData(meals);
}
