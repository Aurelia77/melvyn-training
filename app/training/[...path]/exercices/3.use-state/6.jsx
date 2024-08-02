"use client";

import { Trash } from "lucide-react";
import { Plus } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const useTodos = () => {
  const [todos, setTodos] = useState([
    {
      id: 1222919191,
      text: "Faire les courses",
      completed: false,
    },
  ]);

  const addTodo = (newTodoText) => {
    const newTodo = {
      id: Date.now(),
      text: newTodoText,
      completed: false,
    };

    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
  };

  const removeTodo = (id) => {
    const todosMinusTodoToRemove = todos.filter((todo) => todo.id !== id);
    setTodos(todosMinusTodoToRemove);
  };

  const updateTodo = (id, updatedTodo) => {
    // créer une nouvelle liste avec le bon élément modifié
    setTodos(
      todos.map(
        (todo) => (todo.id === id ? updatedTodo : todo)
        //todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    //   {
    // const todosWithChange = todos.map((todo) =>
    //   todo.id === oneTodo.id
    //     ? { ...todo, completed: !todo.completed }
    //     : todo
    // );
    //   return setTodos(todosWithChange);
    // }
  };

  return { todos, addTodo, removeTodo, updateTodo };
};

const TodoItem = ({
  todo,
  updateTodo,
  removeTodo,
  // editingId,
  // setEditingId,
  //=>  mieux de gérer les STATE dans le composent enfant
  // et ici on tranf le editingId en isEditing car on veut savoir pour chaque TODO si il est en édition
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="input input-bordered flex flex-1 items-center gap-2">
      {/* On transf LABEL en DIV sinon qd on clic sur tout l'élément LABEL, la CHECKBOX change !!!  */}
      <input
        type="checkbox"
        className={"checkbox checkbox-sm"}
        checked={todo.completed}
        onChange={() =>
          updateTodo(todo.id, {
            ...todo,
            completed: !todo.completed,
          })
        }
      />

      {isEditing ? (
        <input
          type="text"
          ref={(r) => r?.focus()} //  manière de mettre automatiquement le focus sur un élément DOM en utilisant les références en React (on le verra plus tard qd on parlera des ref)
          // si on l'enlève il faut cliquer 2 fois pour que le focus se fasse (car au début on clic sur le <p> et après sur l'<input>)
          defaultValue={todo.text}
          //value={oneTodo.text}    // avec ça on est obligé de mettre un onChange !!!
          className="text-purple-600"
          onBlur={(e) => {
            setIsEditing(false);
            updateTodo(todo.id, {
              ...todo,
              text: e.target.value,
            });
            console.log("blur");
          }}
        />
      ) : (
        <p
          onClick={() => setIsEditing(true)}
          className={clsx({ "line-through": todo.completed })}
          // donc si  "line-through": false => ne sera pas appliqué !
          //className={clsx(oneTodo.completed ? "line-through" : null)}
        >
          {todo.text}
        </p>
      )}
      <button className="btn btn-ghost">
        <Trash size={16} onClick={() => removeTodo(todo.id)} />
      </button>
    </div>
  );
};

const TodoForm = ({ addTodo }) => {
  const [newTodoText, setNewTodoText] = useState("");

  const handleAddTodo = () => {
    addTodo(newTodoText);
    setNewTodoText("");
  };

  return (
    <div className="flex w-full items-center gap-2">
      <label className="input input-bordered flex flex-1 items-center gap-2">
        {/* <input
              type="checkbox"
              checked={false}
              className="checkbox checkbox-sm"
            /> */}
        {/* 🦁 Ajoute un état "Todo" et contrôle l'input */}
        <input
          type="text"
          className="grow"
          placeholder="Some task"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={(e) => {
            e.key === "Enter" && handleAddTodo;
          }}
        />
      </label>
      {/* 🦁 Lors du clic sur le bouton, appelle la méthode "addTodo" */}
      <button className="btn btn-primary">
        <Plus size={22} onClick={handleAddTodo} />
      </button>
    </div>
  );
};

export const Todos = () => {
  // 💡 Un todo est un objet avec 3 propriétés :
  //    1. `id` : un identifiant unique (💡 utilise `Date.now()`)
  //    2. `text` : le texte du todo
  //    3. `completed` : un booléen qui indique si le todo est complété (💡 `false` par défaut)

  const { todos, addTodo, removeTodo, updateTodo } = useTodos();

  return (
    <div className="card w-full max-w-md border border-base-300 bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Todos</h2>
        <TodoForm addTodo={addTodo} />
        <div className="divider">List</div>
        {todos.length > 0 ? null : <p>Aucun TODO !</p>}
        <ul className="space-y-2">
          {/* Voici un exemple d'un élément "Todo" */}
          {/* Tu dois afficher ces éléments avec une liste en utilisant `.map` */}
          {todos.map((oneTodo) => {
            return (
              <li
                key={oneTodo.id}
                className={clsx(
                  "flex w-full items-center gap-2"
                  //oneTodo.id === editingId ? "text-cyan-400" : null
                )}
              >
                {/* !!! Ca ne marche pas meme si c les meme noms, mais on pt le faire QUE pour les valeurs BOOLEENNES !!! */}
                {/* <TodoItem
                  todo={oneTodo}
                  updateTodo
                  removeTodo
                  editingId
                  setEditingId
                /> */}
                <TodoItem
                  todo={oneTodo}
                  updateTodo={updateTodo}
                  removeTodo={removeTodo}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="flex w-full justify-center">
      <Todos />
    </div>
  );
}
