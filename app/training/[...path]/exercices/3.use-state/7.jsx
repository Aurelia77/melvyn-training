"use client";

import { Mail, User2 } from "lucide-react";
import { useState } from "react";

//// eslint-disable-next-line no-unused-vars    => à mettre juste avant la var
export const LoginForm = ({ onSubmit }) => {
  //Utiliser les states n'est pas toujours la meilleure approche pour les formulaires. Par défaut, le DOM maintient un "state" pour chaque input même sans React.
  // mais useState permet de créer des INPUTS CONTROLLES par React + en utilisant les attributs "value" et "onChange" pour les inputs contrôlés.
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // 🦁 Crée une méthode "handleSubmit" qui sera passée au `onSubmit` de `form`
  const handleSubmit = (e) => {
    console.log("form", e);
    e.preventDefault();

    const currentTarget = e.currentTarget;
    console.log("currentTarget", currentTarget); // on voit l'HTML du form
    const children = currentTarget.children;
    console.log("children", children); // on voit les enfants du form

    const formData = new FormData(e.target);

    const formValues = {
      email: formData.get("email"), // bien mettre l'attribut name dans l'input
      name: formData.get("name"),
    };
    console.log(formValues);

    onSubmit(formValues);
  };
  // - Commence par empêcher le comportement par défaut du formulaire
  // - Puis appelle `onSubmit` avec un objet contenant le mail et le name
  return (
    // Ajoute la props `onSubmit`
    <form
      className="flex flex-col gap-2"
      //onSubmit={handleSubmit}   => en Vanilla JS, sans les states
    >
      <label className="input input-bordered flex items-center gap-2 has-[:valid]:input-success has-[:invalid]:input-error">
        <Mail size={16} />
        {/* 🦁 Contrôle cette input */}
        <input
          id="email"
          type="email" // bien d'ajouter le type
          required // on veut qu'il soit obligatoire
          name="email"
          className="grow"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2 has-[:valid]:input-success has-[:invalid]:input-error">
        <User2 size={16} />
        {/* 🦁 Contrôle cette input */}
        <input
          id="name"
          minLength={3} // bien d'ajouter un min
          type="text"
          required // on veut qu'il soit obligatoire
          name="name"
          className="grow"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="btn btn-primary"
        onClick={() => onSubmit({ email, name })}
      >
        Submit
      </button>
    </form>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  if (user) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Logged in !</h2>
          <p>Email : {user.email}</p>
          <p>Name : {user.name}</p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={() => {
                setUser(null);
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <LoginForm
        onSubmit={(values) => {
          setUser(values);
        }}
      />
    </div>
  );
}
