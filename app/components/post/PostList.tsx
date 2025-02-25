"use client";
import { useState } from "react";

import NewPost from "./NewPost";
import Post from "./Post";
import classes from "./PostsList.module.css";
import Modal from "./Modal";

export default function PostList() {
  const [showModal, setShowModal] = useState(true);
  const [enteredName, setEnteredName] = useState("");
  const [enteredText, setEnteredText] = useState("");

  const changeNameHandler = (name: string) => {
    setEnteredName(name);
  };

  const changeTextHandler = (text: string) => {
    setEnteredText(text);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <Modal onClose={hideModalHandler}>
          <NewPost
            onNameChange={changeNameHandler}
            onTextChange={changeTextHandler}
          />
        </Modal>
      )}

      <ul className={classes.posts}>
        <Post author={enteredName} text={enteredText} />
        <Post author="Jun2" text="Hello2" />
      </ul>
    </>
  );
}
