import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// DB 연결 객체를 담을 변수
let db;

export async function getPosts(maxNumber) {
  let query = supabase
    .from("posts")
    .select("id, image_url, title, content, created_at")
    .order("created_at", { ascending: false });

  if (maxNumber) {
    query = query.limit(maxNumber);
  }

  // 인위적인 지연 추가 (원래 코드와 동일하게 유지)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching posts:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }

  // null 체크 추가
  if (!data) {
    return [];
  }

  // 응답 데이터 형식 변환
  return data.map((post) => ({
    id: post.id,
    image: post.image_url,
    title: post.title,
    content: post.content,
    createdAt: post.created_at,
    userFirstName: "익명", // 임시값 추가
    userLastName: "", // 임시값 추가
    likes: 0, // 임시값 추가
    isLiked: false, // 임시값 추가
  }));
}

export async function storePost(post) {
  // 변경된 부분: SQL 쿼리 대신 Supabase insert 사용
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 삽입할 데이터 객체 생성
  const insertData = {
    image_url: post.imageUrl,
    title: post.title,
    content: post.content,
  };

  // userId가 유효한 경우에만 user_id 필드 추가
  // null이나 undefined인 경우 필드 자체를 제외
  if (post.userId) {
    insertData.user_id = post.userId;
  }

  const { data, error } = await supabase
    .from("posts")
    .insert(insertData)
    .select();

  if (error) {
    console.error("Error storing post:", error);
    throw new Error("게시물을 저장하는 중 오류가 발생했습니다");
  }

  return data[0];
}

export async function updatePostLikeStatus(postId, userId) {
  // 변경된 부분: 좋아요 상태 확인
  const { data: likes, error: selectError } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", userId)
    .eq("post_id", postId);

  if (selectError) {
    console.error("Error checking like status:", selectError);
    throw new Error("좋아요 상태를 확인하는 중 오류가 발생했습니다");
  }

  const isLiked = likes.length === 0;

  // 인위적인 지연 추가 (원래 코드와 동일하게 유지)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (isLiked) {
    // 좋아요 추가
    const { error: insertError } = await supabase.from("likes").insert({
      user_id: userId,
      post_id: postId,
    });

    if (insertError) {
      console.error("Error adding like:", insertError);
      throw new Error("좋아요를 추가하는 중 오류가 발생했습니다");
    }
  } else {
    // 좋아요 제거
    const { error: deleteError } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (deleteError) {
      console.error("Error removing like:", deleteError);
      throw new Error("좋아요를 제거하는 중 오류가 발생했습니다");
    }
  }

  return { success: true, isLiked };
}
