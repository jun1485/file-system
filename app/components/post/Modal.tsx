import classes from "./Modal.module.css";

export default function Modal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={classes.backdrop} />
      <dialog open className={classes.modal}>
        {children}
      </dialog>
    </>
  );
}
