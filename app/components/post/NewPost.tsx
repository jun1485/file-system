"use client";
import { useState } from "react";
import classes from "./NewPost.module.css";

function NewPost({
  onCancel,
  onAddPost,
}: {
  onCancel: () => void;
  onAddPost: (postData: { body: string; author: string }) => void;
}) {
  const [enteredBody, setEnteredName] = useState("");
  const [enteredAuthor, setEnteredText] = useState("");

  const changeBodyHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredName(event.target.value);
  };

  const changeTextHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEnteredText(event.target.value);
  };

  function onSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const postData = {
      body: enteredBody,
      author: enteredAuthor,
    };
    onAddPost(postData);
    onCancel();
  }
  return (
    <form className={classes.form} onSubmit={onSubmitHandler}>
      <p>
        <label htmlFor="name">Your name</label>
        <input type="text" id="name" required onChange={changeBodyHandler} />
      </p>
      <p>
        <label htmlFor="body">Text</label>
        <textarea id="body" required rows={3} onChange={changeTextHandler} />
      </p>
      <p className={classes.actions}>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button>Submit</button>
      </p>
    </form>
  );
}

export default NewPost;
