"use client";

import NewPost from "./NewPost";
import classes from "./PostsList.module.css";
import Modal from "./Modal";
import Post from "./Post";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../shared";

export default function PostList({
  isPosting,
  onStopPosting,
}: {
  isPosting: boolean;
  onStopPosting: () => void;
}) {
  const [posts, setPosts] = useState<{ body: string; author: string }[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const addPostHandler = (postData: { body: string; author: string }) => {
    fetch("http://localhost:8080/posts", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPosts((prevPosts) => [data.post, ...prevPosts]);
      });
  };

  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true);
      const response = await fetch("http://localhost:8080/posts");
      const resData = await response.json();
      setPosts(resData.posts);
      setIsFetching(false);
    }
    fetchPosts();
  }, []);

  return (
    <>
      {isPosting && (
        <Modal onClose={onStopPosting}>
          <NewPost onCancel={onStopPosting} onAddPost={addPostHandler} />
        </Modal>
      )}

      {!isFetching && posts.length > 0 && (
        <ul className={classes.posts}>
          {posts.map((post) => (
            <Post key={post.body} author={post.author} text={post.body} />
          ))}
        </ul>
      )}
      {isFetching && (
        <div className={`${classes.fallback} text-center`}>
          <LoadingSpinner />
          <p className="text-black mt-2">로딩 중...</p>
        </div>
      )}
      {!isFetching && posts.length === 0 && (
        <p className={`${classes.fallback} text-center text-black`}>No Posts</p>
      )}
    </>
  );
}
