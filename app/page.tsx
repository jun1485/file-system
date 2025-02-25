"use client";
import { useState } from "react";
import MainHeader from "./components/header/MainHeader";
import PostList from "./components/post/PostList";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };

  return (
    <div>
      <MainHeader onCreatePost={showModalHandler} />
      <PostList isPosting={showModal} onStopPosting={hideModalHandler} />
    </div>
  );
}
