"use client";

export default function App() {
  // 🦁 Ajoute un `useState` pour le nom
  // 💡 useState("")

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="card w-96 bg-neutral text-neutral-content">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Name :</h2>
          {/* 🦁 Affiche le `name` juste ici */}
          {/* 🦁 Utilise un opérateur ternaire pour soit afficher "No name" en rouge */}
          {/* 🦁 Soit afficher le `name` */}
          <p className="text-error">No name</p>
        </div>
      </div>
      <div className="divider">Form</div>
      <label className="input input-bordered flex items-center gap-2">
        Name
        {/* 🦁 Transforme cette input en **controlled input** */}
        {/* Il faut ajouter la propriété `value` et `onChange` */}
        {/* 💡 onChange={e => e.target.value} : pour récupérer la value */}
        <input type="text" className="grow" placeholder="Melvynx" />
      </label>
    </div>
  );
}
