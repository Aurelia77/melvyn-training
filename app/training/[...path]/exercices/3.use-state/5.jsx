"use client";

import { User2 } from "lucide-react";
import { useState } from "react";

function NameForm({ initialName }) {
  // 🦁 Ajoute un `useState` pour le nom
  // 💡 useState("")

  const [name, setName] = useState(initialName ?? "");

  console.log(name, initialName);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="card w-full max-w-96 bg-neutral text-neutral-content">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Name :</h2>
          {/* 🦁 Affiche le `name` juste ici */}
          {/* 🦁 Utilise un opérateur ternaire pour soit afficher "No name" en rouge */}
          {/* 🦁 Soit afficher le `name` */}
          {name ? <p>{name}</p> : <p className="text-error">No name</p>}
          {name !== initialName && (
            <button
              className="btn btn-warning btn-sm"
              onClick={() => setName(initialName)}
            >
              Reset
            </button>
          )}
        </div>
      </div>
      <div className="divider">Form</div>
      <label className="input input-bordered flex items-center gap-2">
        <User2 size={16} />
        {/* 🦁 Transforme cette input en **controlled input** */}
        {/* Il faut ajouter la propriété `value` et `onChange` */}
        {/* 💡 onChange={e => e.target.value} : pour récupérer la value */}
        <input
          type="text"
          className="grow"
          placeholder="Melvynx"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <NameForm initialName="nom !!!" />
      <hr className="my-4" />
      <NameForm initialName="nom2" />
    </div>
  );
}
