"use client";

import { useEffect } from "react";
import { useState } from "react";

// EXO 2 => pnpm add swr
// LE MIEU DES 3 !!!!!! exo 1 on utilise le useEffect => pas la meilleure solution
//  "Pas de cache" => une librairie comme useSWR met en cache les données récupérées pour éviter de faire des requêtes réseau répétitives => améliore les performances et réduire la charge sur le serveur.
// Le cache stocke les données localement et les réutilise pour les futures requêtes, ce qui rend l'application plus rapide et plus réactive.
import useSWR from "swr";

// // EXO 3
// import { use, Suspense } from "react";
// import { ErrorBoundaries } from "@/src/utils/ErrorBoundaries";

// const fetchCatFact = async () => {
//   const response = await fetch("https://catfact.ninja/fact");
//   if (!response.ok) {
//     throw new Error("Failed to fetch cat fact");
//   }
//   const json = await response.json();
//   return json;
// };

const CatFact = () => {
  // // EXO 3 : Utiliser use + Suspense + ErrorBoundary + fetch => nouvelle méthode.
  // //const catFact = use(fetchCatFact());
  // const { fact } = use(fetchCatFact());

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // EXO 2 (avec SWR => avec useSWR, tu vas pouvoir supprimer l'intégralité du code qu'on a fait précédemment en gardant exactement les mêmes fonctionnalités.)
  // @ts-ignore
  //const fetcher = (...args) => fetch(...args).then((res) => res.json());
  // idm :
  const fetcher = (...args) => {
    console.log("arg", { ...args });
    // @ts-ignore
    return fetch(...args).then((res) => res.json());
  };
  //useSWR est un hook qui prend deux arguments : une clé (ici, l'URL "https://catfact.ninja/fact") et une fonction de récupération de données (ici, fetcher). useSWR appelle fetcher avec l'URL comme argument.
  const { data, error, isLoading } = useSWR(
    "https://catfact.ninja/fact",
    fetcher
  );

  console.log("error SWR", error);
  console.log("typeof error SWR", typeof error); // typeof error SWR object

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // // EXO 1
  // const [data, setData] = useState(null);
  // //console.log(data);
  // const [isError, setIsError] = useState(false);
  // //console.log("isError", isError);
  // const [isLoading, setIsLoading] = useState(true);

  // // 🦁 Utilise useEffect
  // // Utilise fetch pour récupérer les données de l'API https://catfact.ninja/fact
  // // Utilise .then et si la réponse n'est pas ok, lance une erreur sinon return `res.json`
  // // Rajoute un .then après le premier pour mettre à jour les états (setIsError(false) et setData(data))
  // // Rajoute un .catch pour mettre à jour les états (setIsError(true) et setData(null))
  // // Rajoute un .finally pour mettre à jour l'état isLoading (setIsLoading(false))
  // useEffect(() => {
  //   console.log("USE EFFECT");
  //   // Qd on actualise on voit que le USE EFFECT se fait 2 fois, et donc radidement on voit un texte (data.fact) appareitre puis disparaitre très rapidement puis un autre.
  //   // On voit ausis dans onglet NETWORK que y'a 2 appel à fact => c car le USE EFFECT en STRICT MODE est appelé 2 fois !
  //   // Il faut ajouter un AbortController !!!
  //   const abortController = new AbortController(); // => utilisé dans le FETCH + à la fin du useEFFECT (clean up)
  //   // Mais attention ,en ajoutant un ABORT on passe dans le CATCH !!! Donc bien mettre un return si error === "Abort" (texte qu'on a mis dans le CleanUp) pour pas que ça mette setIsError(true)...

  //   setIsLoading(true);

  //   // Impossible d'avoir des useEffect async donc on utilise une promesse
  //   fetch("https://catfact.ninja/fact", {
  //     signal: abortController.signal,
  //   })
  //     .then((response) => {
  //       //console.log("responses", response);
  //       if (response.ok) {
  //         //setData(response.json());   // La méthode response.json() retourne une promesse, donc vous ne pouvez pas directement passer le résultat de response.json() à setData. Vous devez attendre que la promesse soit résolue avant de pouvoir utiliser les données. C'est pourquoi vous utilisez .then((json) => setData(json)).
  //         return response.json();
  //       }
  //       throw new Error("invalid response");
  //     })
  //     .then((json) => {
  //       setData(json);
  //       setIsError(false);
  //     })
  //     .catch((error) => {
  //       if (error === "Abort") return null;
  //       setIsError(true);
  //       setData(null);
  //       console.error(error.message);
  //     })
  //     .finally(() => setIsLoading(false));

  //   return () => {
  //     abortController.abort("Abort");
  //   };
  // }, []);

  return (
    <div className="card card-compact w-96 max-w-sm bg-base-200 shadow-xl">
      <figure>
        <img
          src="https://cataas.com/cat"
          alt="Shoes"
          className="max-h-32 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Cat fact</h2>
        {/* EXO 1 ET 2 */}
        {isLoading && (
          <span className="loading loading-spinner loading-lg text-primary"></span>
        )}
        {data && <p>{data.fact}</p>}

        {/* EXI 1 */}
        {/* {isError && <p>PROBLEME</p>} */}
        {/* EXO 2 */}
        {error && (
          <p className="text-error">
            Something went wrong while fetching the cat fact
          </p>
        )}
        {/* EXO 3 */}
        {/* {catFact && <p>{catFact.fact}</p>} */}
        {/* <p>{fact}</p> */}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div>
      {/* Exo 3 : Tout Wrapper dans un SUSPENSE et un ErrorBoundaries */}
      {/* <ErrorBoundaries>
        <Suspense fallback={<div>Loading...</div>}> */}
      <CatFact />
      {/* </Suspense>
      </ErrorBoundaries> */}
    </div>
  );
}
