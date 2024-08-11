// @ts-nocheck
"use client";

import { User2 } from "lucide-react";
import { useEffect, useState } from "react";

// 🦁 Créer une clé `STORAGE_KEY` qui est égale à `storage-name`
const STORAGE_KEY = "storage-name";

///////// => !!!!!!!!! voir le local storage dans l'inspecteur du nav => onglet APPLICATION => Local Storage (ouvrir l'onglet et cliquer sur Localhost)

//Mieux d'ajouter cette ofnciton au cas où ça plante...
//Le bloc try...catch dans la fonction getInitialLocalStorageValue est utilisé pour gérer les erreurs potentielles qui pourraient survenir lors de l'accès au localStorage
const getInitialLocalStorageValue = (key, initialValue) => {
  console.log(localStorage.getItem(key));

  try {
    //const value = localStorage.getItem(key); // localStorage.getItem(key) peut potentiellement lancer une exception (erreur) si, par exemple, l'accès au localStorage est désactivé ou si le navigateur ne supporte pas localStorage.

    // EXO 3
    const value = localStorage.getItem(key);

    //const value = localStorage.getItem(JSON.parse(key));

    console.log(value);
    console.log(JSON.parse(value));

    return value !== null ? JSON.parse(value) : initialValue;
  } catch {
    return initialValue;
  }
};

const useStickyState = (key, initialValue) => {
  console.log(getInitialLocalStorageValue(key, initialValue));

  const [value, setValue] = useState(() =>
    getInitialLocalStorageValue(key, initialValue)
  );

  //console.log("value", value);

  useEffect(() => {
    // 🦁 Sauvegarde le `name` dans le localStorage avec la clé définie dans `STORAGE_KEY`
    // localStorage.setItem(key, value);
    // console.log(value, localStorage.getItem(key));

    // EXO 3
    localStorage.setItem(key, JSON.stringify(value));

    console.log(localStorage);
  }, [value, key]);

  return [value, setValue];
};

const NameForm = ({ initialName }) => {
  // // EXO 1
  // // 🦁 Comme valeur initiale, récupère la valeur dans le localStorage
  // const [name, setName] = useState(
  //   () => getInitialLocalStorageValue(STORAGE_KEY) || initialName
  // );
  // // const [name, setName] = useState(initialName);

  // console.log("name", name); // 1

  // // effacer le localStorage
  // //localStorage.clear();

  // // 🦁 Créer un `useEffect` avec `name` comme dépendance
  // useEffect(() => {
  //   // 🦁 Sauvegarde le `name` dans le localStorage avec la clé définie dans `STORAGE_KEY`
  //   localStorage.setItem(STORAGE_KEY, name);

  //   console.log(name, localStorage.getItem(STORAGE_KEY)); // 3 (se fait après ce qu'il y a dans le corps de la fonction)
  // }, [name]);

  // console.log("localStorage", localStorage.getItem(STORAGE_KEY)); // 2

  // EXO 2
  // const [name, setName] = useStickyState(STORAGE_KEY, initialName);

  // EXO 3
  const [user, setUser] = useStickyState(STORAGE_KEY, initialName);

  console.log("user", user);

  return (
    <div className="flex flex-col items-center justify-center">
      <label className="input input-bordered flex items-center gap-2">
        <User2 size={16} />
        <input
          type="text"
          className="grow"
          placeholder="Enter your name"
          //value={name}
          // onChange={(e) => setName(e.target.value)}
          // EXO 3
          value={user.name}
          onChange={(e) => setUser({ name: e.target.value })}
        />
      </label>
    </div>
  );
};

export default function App() {
  return (
    <div className="flex flex-col gap-8">
      {/* <NameForm initialName={"Jean"} /> */}
      {/* EXO 3 */}
      <NameForm initialName={{ name: "Jean" }} />
    </div>
  );
}
