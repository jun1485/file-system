import sqlite3 from "sqlite3";
import { open } from "sqlite";

// DB 연결 객체를 담을 변수
let db;

// DB 초기화 함수를 비동기로 변경
async function initDb() {
  // SQLite 연결 초기화
  db = await open({
    filename: "posts.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, 
      first_name TEXT, 
      last_name TEXT,
      email TEXT
    )`);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY, 
      image_url TEXT NOT NULL,
      title TEXT NOT NULL, 
      content TEXT NOT NULL, 
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER, 
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER, 
      post_id INTEGER, 
      PRIMARY KEY(user_id, post_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
      FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
    )`);

  // 사용자 수 확인
  const userCount = await db.get("SELECT COUNT(*) AS count FROM users");

  if (userCount.count === 0) {
    await db.exec(`
    INSERT INTO users (first_name, last_name, email)
    VALUES ('John', 'Doe', 'john@example.com')
    `);

    await db.exec(`
    INSERT INTO users (first_name, last_name, email)
    VALUES ('Max', 'Schwarz', 'max@example.com')
    `);
  }
}

// 초기화 함수 실행
(async () => {
  await initDb();
})();

export async function getPosts(maxNumber) {
  let limitClause = "";

  if (maxNumber) {
    limitClause = "LIMIT ?";
  }

  const query = `
    SELECT posts.id, image_url AS image, title, content, created_at AS createdAt, first_name AS userFirstName, last_name AS userLastName, COUNT(likes.post_id) AS likes, EXISTS(SELECT * FROM likes WHERE likes.post_id = posts.id and likes.user_id = 2) AS isLiked
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id
    ORDER BY createdAt DESC
    ${limitClause}`;

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return maxNumber ? await db.all(query, [maxNumber]) : await db.all(query);
}

export async function storePost(post) {
  const query = `
    INSERT INTO posts (image_url, title, content, user_id)
    VALUES (?, ?, ?, ?)`;

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await db.run(query, [
    post.imageUrl,
    post.title,
    post.content,
    post.userId,
  ]);
}

export async function updatePostLikeStatus(postId, userId) {
  const result = await db.get(
    `
    SELECT COUNT(*) AS count
    FROM likes
    WHERE user_id = ? AND post_id = ?`,
    [userId, postId]
  );

  const isLiked = result.count === 0;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (isLiked) {
    return await db.run(
      `
      INSERT INTO likes (user_id, post_id)
      VALUES (?, ?)`,
      [userId, postId]
    );
  } else {
    return await db.run(
      `
      DELETE FROM likes
      WHERE user_id = ? AND post_id = ?`,
      [userId, postId]
    );
  }
}
