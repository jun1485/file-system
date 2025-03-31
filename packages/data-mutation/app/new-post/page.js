import PostForm from "@/components/post-form";
import { storePost } from "@/lib/posts";
import { redirect } from "next/navigation";

export default async function NewPostPage() {
  async function createPost(formData) {
    "use server";

    try {
      if (!formData) {
        return { errors: ["폼 데이터가 없습니다"] };
      }

      const title = formData.get("title");
      const content = formData.get("content");
      const imageUrl = formData.get("imageUrl");

      if (!title || !content) {
        return { errors: ["제목과 내용은 필수입니다"] };
      }

      const result = await storePost({
        title,
        content,
        imageUrl,
        userId: "anonymous",
      });

      return { success: true };
    } catch (error) {
      console.error("Post creation error:", error);
      return { errors: [error.message] };
    }
  }

  return <PostForm action={createPost} />;
}
