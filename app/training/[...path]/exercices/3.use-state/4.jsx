// @ts-nocheck
"use client";

import clsx from "clsx";

const Button = ({ children, variant, id, onClick }) => {
  const buttonClass = clsx("btn ring-offset-2 ring-offset-base-100", {
    "btn-primary": variant === "primary",
    "btn-error": variant === "error",
    "btn-success": variant === "success",
    "btn-warning": variant === "warning",
  });

  return (
    <button className={buttonClass} id={id} onClick={() => onClick(id)}>
      {children}
    </button>
  );
};

export default function App() {
  // Grâce aux EVENT (par ex onCLick, onHover, etc) on peut récupérer des informations sur l'élément qui a déclenché l'event => on fait remonter des infos de l'élément enfant à l'élément parent

  const handleClickButton = (id) => {
    // if (target === e.currentTarget) {
    //   alert(`You clicked on the container`);
    // } else {
    alert(`You clicked on ${id}`); // si je met pas // @ts-nocheck en haut, j'ai une erreur sur id : La propriété 'id' n'existe pas sur le type 'EventTarget'.ts(2339)
    //}
    //setCurrentTarget(id);
  };

  return (
    <div
      //// 1
      // onClick={(e) => {
      //   const target = e.target;

      //   if (target === e.currentTarget) {    // e.currentTarget est l'élément sur lequel on a mis l'eventListener
      //     alert(`You clicked on the container`);
      //   } else {
      //     alert(`You clicked on ${target.id}`); // si je met pas // @ts-nocheck en haut, j'ai une erreur sur id : La propriété 'id' n'existe pas sur le type 'EventTarget'.ts(2339)
      //   }
      // }}
      className="flex flex-wrap gap-4 p-4"
    >
      <Button variant={"primary"} id="eat-me" onClick={handleClickButton}>
        Eat me
      </Button>
      <Button variant={"error"} id="love-me" onClick={handleClickButton}>
        Love me
      </Button>
      <Button variant={"success"} id="drink-me" onClick={handleClickButton}>
        Drink me
      </Button>
      <Button variant={"warning"} id="leave-me" onClick={handleClickButton}>
        Eat me
      </Button>
    </div>
  );
}
