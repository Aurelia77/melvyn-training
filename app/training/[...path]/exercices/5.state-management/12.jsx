"use client";

import { User2, X } from "lucide-react";
import { cloneElement } from "react";
import { useRef } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { useState } from "react";

// 🦁 Crée un contexte `DialogContext` avec une valeur par défaut `null`
const DialogContext = createContext(null);

// 🦁 Crée une fonction `useDialogContext` qui va retourner le contexte `DialogContext`
// 💡 Utilise `useContext` pour récupérer le contexte `DialogContext`
// ❌ Si le contexte renvoie null, on va renvoyer une erreur
// ✅ Sinon on va renvoyer le contexte
const useDialogContext = () => {
  if (!useContext(DialogContext))
    throw new Error("useDialogContext must be used within a DialogProvider");
  return useContext(DialogContext);
};

// EXO 3/2 => je copie le hook qu'on a fait dans EXO 9
const handlerSet = new Set();
// En React, toute logique qui contient des hooks peut être déplacée dans un custom hook. Créer un custom hook qui permet de facilement gérer les event listeners.
const useEventListener = ({
  eventName,
  handler,
  element = window,
  enabled = true,
}) => {
  // PAS INDISPENSABLE de gérer ça... surtout que j'ai pas compris !!!
  // Bonus 3 exo 9
  //Problème de référence => Notre méthode useEventListener prend une méthode handler qui est une fonction. Cette méthode handler vient mettre à jour le state count qui est dans notre composant. Ceci provoque un re-render qui va venir modifier la référence de notre handler. La modification de la référence de notre handler va venir provoquer une update de notre useEffect dans useEventListener qui va venir supprimer et ajouter un nouvel event listener.
  // C'est problématique car on va ajouter un event listener à chaque fois qu'on va cliquer.
  // Pour résoudre ce problème, on va utiliser un useRef pour venir sauvegarder une référence de notre handler qui sera stable. Puis, avec un useEffect qui écoute notre handler, on va venir mettre à jour notre refHandler avec notre handler. De cette manière, notre handler ne va jamais changer et notre useEffect ne va re-render que si le eventName, element ou enabled change.
  handlerSet.add(handler);
  //console.log("handlerSet SIZE", handlerSet.size); // augmente très vite de taille si on utilise pas le useRef ??????????????????????????? pourtant j'ai testé et c pareil......... Voir solution vidéo 3 de exo9 vers le milieu

  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    //console.log("USE EFFECT");

    if (!enabled) {
      return;
    }
    // le fait de mettre cette condition ici fait qu'on fait le clic up de l'envent quand on clic donc quand isCountingClick est à false
    // => au moi on ajoute (+ supprime) un event listener que si beosin !

    // utilise pour exo 3/4 (ajout de useFocusTrap)
    if (!element) {
      return;
    }
    // utile de mettre event ?????????? pas dans sa vidéo de correction
    //const onClick = (event) => handler(event);
    // Bonus 3 exo 9
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

// Exo 3/3
const useClickOutside = (ref, handler) => {
  // Si le click est fait en dehors du ref, on appelle le handler
  const listener = (event) => {
    if (!ref.current) return;
    if (ref.current.contains(event.target)) return;
    handler();
  };

  useEventListener({
    handler: listener,
    eventName: "mousedown",
  });
  // Si on est sur un mobile
  useEventListener({
    handler: listener,
    eventName: "touchstart",
  });
};

// Exo 3/4
const getFocusableElements = (ref) =>
  Array.from(
    ref.current.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    )
  );
// Exo 3/4
// rajouter un hook useFocusTrap(ref, isEnable) qui va venir empêcher l'utilisateur de sortir du dialog. (on veut que le focuse se faisse que sur les éléments du dialog)
const useFocusTrap = (ref, isEnabled) => {
  useEventListener({
    eventName: "keydown",
    enabled: isEnabled,
    handler: (event) => {
      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements(ref);

      const activeElement = document.activeElement;

      let nextActiveElementIndex = event.shiftKey
        ? focusableElements.indexOf(activeElement) - 1
        : focusableElements.indexOf(activeElement) + 1;

      const toFocusElement = focusableElements[nextActiveElementIndex];

      if (toFocusElement) {
        console.log("Return nothing");
        return;
      }

      nextActiveElementIndex =
        nextActiveElementIndex < 0 ? focusableElements.length - 1 : 0;

      focusableElements[nextActiveElementIndex].focus();
      event.preventDefault();
      return;
    },
  });
};

// Modifie Dialog pour qu'il injecte le `open, setOpen` dans notre `DialogContext.Provider`
// https://react.dev/reference/react/createContext#provider
const Dialog = ({ children, buttonText }) => {
  const [open, setOpen] = useState(false);

  // Si on veut voir pour le useMemo d'u cours suivant...
  //const value = { open, setOpen };
  //const value = useMemo(() => ({ open, setOpen }), [open]);

  //const DialogContext = useDialogContext();

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {/* On met ça dans le coposant DialogTrigger */}
      {/* <button onClick={() => setOpen(true)} className="btn">
        {buttonText}
      </button> */}
      {/* <DialogContent open={open} setOpen={setOpen}>
        {children}
      </DialogContent> */}
      {/* Et on affiche seulement {children} */}
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children }) => {
  const { setOpen } = useDialogContext();

  // Vérifiez que children n'est pas de type string et est un élément React valide
  if (typeof children !== "string") {
    return cloneElement(children, {
      onClick: (e) => {
        setOpen(true);
        children.props.onClick?.(e); // si jamais on a déjà un ONCLICK dans le composant enfant il faut l'ajouter ici sinon ça prend que celui qu'on a ici
      },
      className: "btn",
    });
  }
  return (
    <button onClick={() => setOpen(true)} className="btn">
      {children}
    </button>
  );
};

////EXO 1
// const DialogClose = ({ children }) => {
//   const { setOpen } = useDialogContext();

//   return (
//     <button onClick={() => setOpen(false)} className="btn">
//       {children}
//     </button>
//   );
// };

// EXO 2
const DialogClose = ({ children }) => {
  const { setOpen } = useContext(DialogContext);

  if (typeof children !== "string") {
    return cloneElement(children, { onClick: () => setOpen(false) });
  }

  return (
    <button onClick={() => setOpen(false)} className="btn btn-primary">
      {children}
    </button>
  );
};

const DialogContent = ({ children }) => {
  console.log("DialogContent RENDER");
  const { open, setOpen } = useDialogContext();

  // EXO 3/3
  const ref = useRef(null);
  useClickOutside(ref, () => {
    setOpen(false);
  });

  useEventListener({
    eventName: "keydown",
    handler: (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
  });

  // Exo 3/4
  useFocusTrap(ref, open);

  if (!open) return null;

  return (
    // on ajoute les aira de DIALOG ici
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-50"
    >
      <div
        // EXO 3/3
        ref={ref}
        className="card w-96 bg-base-200 shadow-xl animate-in fade-in-50 slide-in-from-bottom-3"
      >
        <div className="card-body">
          {children}
          {/* 🦁 Enlève ce code */}
          {/* <div className="card-actions justify-end">
            <button onClick={() => setOpen(false)} className="btn btn-primary">
              Close
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

/////////////////////////////////////////////////////////////////////////////////////////////
// AJOUTE POUR TEST (vidéo cours Fonctionnement useContext  https://codeline.app/cdly/courses/beginreact/lessons/ysR6MKSerVI)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// On ajoute un contexte pour tester les RENDER des composants
const OpenContext = createContext(null);

const Provider = ({ children }) => {
  const [open, setOpen] = useState(false);
  console.log("CONTEXT Provider Re-render");

  const value = { open, setOpen };
  const memorizedValue = useMemo(() => value, [open]);

  return (
    // Si on ne passe pas un MEMO alors qd on clic sur COUNT (de CountRenderProvider) => l'élément ToggleOpen est aussi RERENDER !!!!
    // Car ToggleOpen est à l'intérieur de CountRenderProvider donc c son enfant dc c normal !?
    <OpenContext.Provider value={memorizedValue}>
      {/* <OpenContext.Provider value={value}> */}
      {children}
    </OpenContext.Provider>
  );
};

const CountRenderProvider = ({ children }) => {
  const [counter, setCounter] = useState(0);
  console.log("CountRenderProvider Re-render");
  return (
    <div>
      {/* !!! Cliquer ici  */}
      <button
        onClick={() => setCounter(counter + 1)}
        className=" bg-cyan-800 p-1"
      >
        Count {counter}
      </button>
      <Provider>{children}</Provider>
    </div>
  );
};

const ToggleOpen = () => {
  console.log("Toggle Open Re-render");
  const { open, setOpen } = useContext(OpenContext);
  return (
    <button onClick={() => setOpen(!open)} className="ml-4 bg-yellow-600 p-1 ">
      Toggle {open ? "Open" : "Close"}
    </button>
  );
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function App() {
  console.log("App Re-render");

  const [aaa, setAaa] = useState("coucou");

  // Maintenant <DialogTrigger>, <DialogTrigger> et <DialogClose> sont enfants de App et non de Dialog, et communiquent avec <Dialog> via le contexte.
  return (
    <div>
      <input
        type="text"
        value={aaa}
        onChange={(e) => {
          console.log("CHANGE");
          setAaa(e.target.value);
        }}
      />
      {/* <CountRenderProvider>
        <ToggleOpen />
      </CountRenderProvider> */}

      {/* 🦁 Mets ensemble nos components pour avoir un Dialog fonctionnel */}
      <Dialog buttonText="Open dialog">
        {/* <DialogTrigger>Open dialog</DialogTrigger> */}
        {/* Exo 2 */}
        <DialogTrigger>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => alert("coucou")}
          >
            Open Dialog Now!
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogClose>
            {/* On peut mettre du texte et c géré ! (if (typeof children !== "string")) */}
            {/* coucou */}
            <button className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-lg bg-base-100">
              <X size={12} />
            </button>
          </DialogClose>

          <p>What is your name ?</p>

          <label className="input input-bordered flex items-center gap-2">
            <User2 scale={16} />
            <input type="text" className="grow" placeholder="Username" />
          </label>
          <div className="card-actions">
            <button className="btn btn-primary">Submit</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
