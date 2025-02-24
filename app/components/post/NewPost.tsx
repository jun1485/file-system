"use client";
import classes from "./NewPost.module.css";

function NewPost(props: {
  onNameChange: (name: string) => void;
  onTextChange: (text: string) => void;
}) {
  function changeTextHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    props.onTextChange(event.target.value);
  }

  function changeNameHandler(event: React.ChangeEvent<HTMLInputElement>) {
    props.onNameChange(event.target.value);
  }

  return (
    <form className={classes.form}>
      <p>
        <label htmlFor="name">Your name</label>
        <input type="text" id="name" required onChange={changeNameHandler} />
      </p>
      <p>
        <label htmlFor="body">Text</label>
        <textarea id="body" required rows={3} onChange={changeTextHandler} />
      </p>
    </form>
  );
}

export default NewPost;
