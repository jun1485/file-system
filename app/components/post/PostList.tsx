"use client";

import NewPost from "./NewPost";
import classes from "./PostsList.module.css";
import Modal from "./Modal";

export default function PostList({
  isPosting,
  onStopPosting,
}: {
  isPosting: boolean;
  onStopPosting: () => void;
}) {
  return (
    <>
      {isPosting && (
        <Modal onClose={onStopPosting}>
          <NewPost onCancel={onStopPosting} />
        </Modal>
      )}

      <ul className={classes.posts}>
        <Post author={enteredName} text={enteredText} />
      </ul>
    </>
  );
}
