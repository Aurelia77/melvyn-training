"use client";

import { Search } from "lucide-react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// Pk le debounce se fait que qd on arrête d'écrire ?
// => Le comportement de la fonction de debounce est conçu pour retarder l'exécution de la fonction jusqu'à ce qu'un certain délai se soit écoulé depuis la dernière fois que la fonction a été invoquée. Cela signifie que la fonction ne sera exécutée qu'une fois que l'utilisateur a cessé de taper pendant le délai spécifié
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

const useDebounceFn = (callback, time) => {
  // 💡 timeout correspond à la référence de notre timeout.
  //   Quand tu fais un setTimeout, il return une valeur que
  //   tu peux clear afin de l'annuler. https://developer.mozilla.org/fr/docs/Web/API/setTimeout#valeur_de_retour
  const timeout = useRef(null);

  const onDebounce = (...args) => {
    console.log("Clear Timeout", args);

    // 🦁 Annule le timeout https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout
    clearTimeout(timeout.current);

    console.log("Create Timeout", args);

    // ℹ️ Cette fonction sera appelée à chaque fois que l'user tape un caractère, on veut donc clear
    //    le dernier timeout pour relancer un nouveau timeout.
    // 🦁 Crée un nouveau timeout https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
    // a la fin il doit appeler la callback avec les arguments et le temps est défini par le paramètre `time`
    timeout.current = setTimeout(() => {
      console.log("CALL Callback", args);
      callback(...args);
    }, time);
  };

  return onDebounce;
};

const fetchAgeByName = (name) => {
  return fetch(`https://api.agify.io/?name=${name}`).then((res) => res.json());
};

// Exo 3 :
const useRenderCount = () => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return renderCount;
};
// const useRenderCount = () => {
//   const renderCount = useRef(0);
//   renderCount.current += 1;
//   return renderCount.current;
// };

// ***TEST fin VIDEO solution 3
const obj = { current: null };

// Test vidéo cours suivant (https://codeline.app/cdly/courses/beginreact/lessons/clgvxr2b30001l008g8brbpw8)
const Input = () => {
  const inputRef = useRef(null);

  return (
    <div>
      <input ref={inputRef} />
      <button
        onClick={() => {
          inputRef.current.style.background = "red";
        }}
      >
        Change color
      </button>
    </div>
  );
};

export default function App() {
  const [result, setResult] = useState(null);

  // Exo 2 : inputRef
  const inputRef = useRef(null);

  //const onSearch = (value) => {
  const onSearch = useDebounceFn((value) => {
    //const onSearch = useDebounceFn(() => {
    // fetchAgeByName(inputRef.current?.value).then((data) => {
    fetchAgeByName(value).then((data) => {
      setResult(data);
      // On pt aussi focus à la fin
      inputRef.current.focus();
    });
    //};
  }, 500);

  // Exo 3 :
  const renderCount = useRenderCount();

  // ***TEST fin VIDEO solution 3
  console.log("OBJ = ", obj);

  return (
    <div className="flex flex-col items-center gap-4">
      <div style={{ color: "red", padding: 16 }}>
        The component render ${renderCount.current} times
      </div>
      <label
        // ***Fin vidéo solution 3 => juste pour tester : ici le label se supprime qd on raffraichit
        // ref={(r) => {
        //   console.log("LABEL = ", r);
        //   r?.remove();
        // }}
        // Qd on passe un objet
        ref={obj}
        // Donc la ref est une PROPS spéciale :
        // si elle prend un OBJET elle vient modifier la valeur de CURRENT
        // si elle prend une fonction elle vient appeler cette fonction
        className="input input-bordered flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search bar"
          onChange={(event) => {
            // onSearch(event.target.value);
            // Exo 2
            onSearch(inputRef.current.value);
            // OU ca mais on voit plus dans les log les ...args
            //onSearch();
          }}
        />
        <Search size={16} />
      </label>
      {result ? (
        <div style={{ padding: 16 }}>
          The age for <b>{result.name}</b> is <b>{result.age}</b> and there is{" "}
          <b>{result.count}</b> people with this name.
        </div>
      ) : null}
      <p>TEST avec une fonction dans la ref pour mettre l'input en rouge</p>
      {/* idem : style={{ backgroundColor: "red" }} */}
      <input
        ref={(input) => {
          input.style.background = "red";
          console.log(input);
        }}
      />
      <p>Test vidéo cours suivant mais à ne PAS FAIRE</p>
      <div>
        <Input />
        <Input />
        <Input />
      </div>
    </div>
  );
}
