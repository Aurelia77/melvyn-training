"use client";

import { cn } from "@/src/utils/cn";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";

const useTodos = () => {
  const [todos, setTodos] = useState([
    {
      id: 1112,
      text: "Faire les courses",
      completed: false,
    },
    {
      id: 2222,
      text: "Aller dormir à 22h",
      completed: true,
    },
  ]);

  const addTodo = (todo) => {
    const newTodo = {
      id: Date.now(),
      text: todo,
      completed: false,
    };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
  };

  const updateTodo = (id, newTodo) => {
    const newTodos = todos.map((todo) => {
      if (todo.id !== id) return todo;
      return newTodo;
    });
    setTodos(newTodos);
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => {
      console.log("todo", todo.id, id);
      return todo.id !== id;
    });
    console.log({ newTodos });
    setTodos(newTodos);
  };

  return {
    todos,
    updateTodo,
    addTodo,
    deleteTodo,
  };
};

// Render
export const Todos = () => {
  const { addTodo, deleteTodo, updateTodo, todos } = useTodos();

  return (
    <div className="card w-full max-w-md border border-base-300 bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Todos</h2>
        <TodoForm onAddTodo={addTodo} />
        <div className="divider">List</div>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
            />
          ))}
          {todos.length === 0 ? (
            <p className="text-neutral-content">Empty</p>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

const TodoForm = ({ onAddTodo }) => {
  const [todo, setTodo] = useState("");

  const handleAddTodo = () => {
    onAddTodo(todo);
    setTodo("");
  };

  return (
    <div className="flex w-full items-center gap-2">
      <label className="input input-bordered flex flex-1 items-center gap-2">
        <input
          type="checkbox"
          checked={false}
          className="checkbox checkbox-sm"
        />
        <input
          value={todo}
          onChange={(e) => {
            setTodo(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTodo();
            }
          }}
          type="text"
          className="grow"
          placeholder="Some task"
        />
      </label>
      <button onClick={() => handleAddTodo()} className="btn btn-primary">
        <Plus size={22} />
      </button>
    </div>
  );
};

const TodoItem = ({ todo, deleteTodo, updateTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <li className="flex w-full items-center gap-2" key={todo.id}>
      <div
        className={cn("input flex flex-1 items-center gap-2", {
          "input-bordered": isEditing,
        })}
      >
        <input
          onChange={() => {
            const newCompleted = !todo.completed;
            updateTodo(todo.id, {
              ...todo,
              completed: newCompleted,
            });
          }}
          checked={todo.completed}
          type="checkbox"
          className="checkbox checkbox-sm"
        />
        {isEditing ? (
          <input
            ref={(r) => r?.focus()}
            onBlur={(e) => {
              const newValue = e.target.value;
              updateTodo(todo.id, {
                ...todo,
                text: newValue,
              });
              setIsEditing(false);
              console.log("BLUR !!!");
            }}
            defaultValue={todo.text}
          />
        ) : (
          <p
            onClick={() => {
              setIsEditing(true);
            }}
            className={cn({
              "line-through text-neutral-content": todo.completed,
            })}
          >
            {todo.text}
          </p>
        )}
      </div>

      <button onClick={() => deleteTodo(todo.id)} className="btn btn-ghost">
        <Trash size={16} />
      </button>
    </li>
  );
};

export default function App() {
  return (
    <div className="flex w-full justify-center">
      <Todos />
    </div>
  );
}
