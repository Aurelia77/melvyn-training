"use client";

import { useEffect, useState, useRef } from "react";

// Bonus 3
const handlerSet = new Set();

// EXO 3  :En React, toute logique qui contient des hooks peut être déplacée dans un custom hook. Créer un custom hook qui permet de facilement gérer les event listeners.
const useEventListener = ({
  eventName,
  handler,
  element = window,
  enabled = true,
}) => {
  // Bonus 3 => Problème de référence => Notre méthode useEventListener prend une méthode handler qui est une fonction. Cette méthode handler vient mettre à jour le state count qui est dans notre composant. Ceci provoque un re-render qui va venir modifier la référence de notre handler. La modification de la référence de notre handler va venir provoquer une update de notre useEffect dans useEventListener qui va venir supprimer et ajouter un nouvel event listener.
  // C'est problématique car on va ajouter un event listener à chaque fois qu'on va cliquer.
  // Pour résoudre ce problème, on va utiliser un useRef pour venir sauvegarder une référence de notre handler qui sera stable. Puis, avec un useEffect qui écoute notre handler, on va venir mettre à jour notre refHandler avec notre handler. De cette manière, notre handler ne va jamais changer et notre useEffect ne va re-render que si le eventName, element ou enabled change.
  handlerSet.add(handler);
  console.log("handlerSet SIZE", handlerSet.size); // augmente très vite de taille si on utilise pas le useRef ??????????????????????????? pourtant j'ai testé et c pareil......... Voir solution vidéo 3 vers le milieu

  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    console.log("USE EFFECT");

    if (!enabled) {
      return;
    }
    // le fait de mettre cette condition ici fait qu'on fait le clic up de l'envent quand on clic donc quand isCountingClick est à false
    // => au moi on ajoute (+ supprime) un event listener que si beosin !

    // utile de mettre event ?????????? pas dans sa vidéo de correction
    //const onClick = (event) => handler(event);
    // Bonus 3
    const onClick = (event) => handlerRef.current(event);

    console.log("Adding Event Listener");

    element.addEventListener(eventName, onClick); // Melvin dit : c'est un bonne pratique d'utiliser document plutot que window
    // window : Représente la fenêtre du nav.
    //document : Représente le contenu du document HTML.

    return () => {
      console.log("Removing Event Listener");
      element.removeEventListener(eventName, onClick);
    };
    //}, [eventName, handler, element, enabled]);
    // Bonus 3
  }, [eventName, element, enabled]);
};

export default function App() {
  const [isCountingClick, setIsCountingClick] = useState(false);
  const [count, setCount] = useState(0);

  console.log("count", count);

  // EXO 1 et 2
  //// 🦁 Créer un `useEffect` qui vient écouter les click sur `window`
  // // 🦁 Ensuite il incrémente le state `count` uniquement si `isCountingClick` est `true`
  // useEffect(() => {
  //   if (!isCountingClick) {
  //     return;
  //   }
  //   // le fait de mettre cette condition ici fait qu'on fait le clic up de l'envent quand on clic donc quand isCountingClick est à false
  //   // => au moi on ajoute un event listener que si beosin !

  //   console.log("USE EFFECT");

  //   const onClick = () => {
  //     console.log("count", count);
  //     //setCount(count + 1); // ok mais mieux d'utilise la fonction de call-back pour les performances
  //     setCount((curr) => curr + 1);
  //   };

  //   console.log("Adding Event Listener", count);

  //   document.addEventListener("click", onClick);
  //   // window : Représente la fenêtre du nav.
  //   //document : Représente le contenu du document HTML.

  //   return () => {
  //     console.log("Removing Event Listener", count);
  //     document.removeEventListener("click", onClick);
  //   };
  // }, [isCountingClick]);

  // EXO 3

  useEventListener({
    eventName: "click",
    handler: () => setCount((curr) => curr + 1),
    enabled: isCountingClick,
  });

  return (
    <div className="flex max-w-sm flex-col gap-8">
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Is Counting Click</span>
          <input
            type="checkbox"
            className="toggle"
            checked={isCountingClick}
            onChange={(e) => setIsCountingClick(e.target.checked)}
          />
        </label>
      </div>
      <h2 className="text-2xl font-bold">Click count: {count}</h2>
    </div>
  );
}
