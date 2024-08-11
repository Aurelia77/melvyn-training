"use client";

import { Mail, User2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

//// eslint-disable-next-line no-unused-vars    => à mettre juste avant la var
export const LoginForm = ({ onSubmit }) => {
  //1-Utiliser les states n'est pas toujours la meilleure approche pour les formulaires. Par défaut, le DOM maintient un "state" pour chaque input même sans React.
  //2- mais useState permet de créer des INPUTS CONTROLLES par React + en utilisant les attributs "value" et "onChange" pour les inputs contrôlés.
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  // 3-useRef permet de référencer des éléments DOM sans provoquer de re-render. Utilisons useRef pour accéder aux valeurs des inputs sans utiliser de state.
  // Ici le STATE ne sert à rien car on a pas besoin de rerender à chaque modif des input
  // => useRef est un Hook React qui vous permet de référencer une valeur qui n’est pas nécessaire au code du rendu lui-même.
  const emailRef = useRef(null);
  const nameRef = useRef(null);

  // 🦁 Crée une méthode "handleSubmit" qui sera passée au `onSubmit` de `form`
  const handleSubmitForm = (e) => {
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

  // 4- On utilise React-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log("register", register("coucou"));
  console.log("errors", errors);

  return (
    // Ajoute la props `onSubmit`
    <div>
      <form
        className="flex flex-col gap-2"
        //onSubmit={handleSubmitForm}   => en Vanilla JS, sans les states
      >
        <label className="input input-bordered flex items-center gap-2 has-[:valid]:input-success has-[:invalid]:input-error">
          <Mail size={16} />
          <input
            id="email"
            type="email" // bien d'ajouter le type
            required // on veut qu'il soit obligatoire
            name="email"
            className="grow"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={emailRef}
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
            ref={nameRef}
          />
        </label>
        {/* On met le onSubmit quandon utilise des input controllés ou des ref */}
        {/* Sinon, en Vanilla JS et quand on utilise React-hook-form, on le met sur le form (obligé ???) */}
        <button
          type="submit"
          className="btn btn-primary"
          // onClick={() => onSubmit({ email, name })}    // ou onSubmit({ email: email, name: name })
          // en utilisant les ref
          onClick={() =>
            onSubmit({
              email: emailRef.current.value,
              name: nameRef.current.value,
            })
          }
        >
          Submit
        </button>
      </form>
      <p className="py-8">4- On utilise React-hook-form</p>
      {/* On met le onSubmit ici */}
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <label className="input input-bordered flex items-center gap-2 has-[:valid]:input-success has-[:invalid]:input-error">
          <Mail size={16} />
          <input
            className="grow"
            placeholder="emailPlaceholder"
            defaultValue="a@a.fr"
            //{...register("email")} // chaîne de caractères sera utilisée comme clé pour accéder à la valeur de l'input dans les données du formulaire.
            // On peut ajouter un pattern :
            {...register("email", {
              required: "This is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Entered value does not match email format",
              },
            })}
          />
        </label>
        {errors.email && <p className="text-error">{errors.email.message}</p>}
        <label className="input input-bordered flex items-center gap-2 has-[:valid]:input-success has-[:invalid]:input-error">
          <User2 size={16} />
          <input
            type="text"
            className="grow"
            placeholder="namePlaceholder"
            defaultValue="nameDefaultValue"
            {...register("name")}
            // Je sais pas pk mais si je mets ça j'ai une erreur sur l'input !! Pourtant ds l'email tout fonctionne !!
            // {...register("name"), {
            //     required: {
            //       value: true,
            //       message: "This is required"
            //     },
            //     minLength: {
            //       value: 3,
            //       message: "Minimum length should be 3",
            //     },
            //   }
            // }
          />
        </label>
        {errors.name && <p className="text-error">{errors.name.message}</p>}
        <button
          type="submit"
          className="btn btn-primary"
          // onClick={() =>
          //   onSubmit({
          //     email: "exampleName",
          //     name: "exampleEmail",
          //   })
          // }
        >
          Submit
        </button>
      </form>
    </div>
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
