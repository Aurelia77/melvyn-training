"use client";

import { Hash } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import { useReducer } from "react";

const REDUCER_ACTION = {
  INCREMENT: "INCREMENT",
  DECREMENT: "DECREMENT",
  RESET: "RESET",
  SET: "SET",
};

const reducer = (state, action) => {
  const value = action.value || 1;

  switch (action.type) {
    case REDUCER_ACTION.INCREMENT:
      return state + value;
    case REDUCER_ACTION.DECREMENT:
      return state - value;
    case REDUCER_ACTION.RESET:
      return 0;
    case REDUCER_ACTION.SET:
      if (typeof value !== "number") throw new Error("Value must be a number");
      return value;
    default:
      throw new Error("Action not found");
  }
};

export default function App() {
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <div className="card m-auto w-full max-w-md bg-base-200 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{count}</h2>
        <label className="input input-bordered flex  items-center gap-2">
          <Hash scale={16} />
          <input
            type="text"
            className="w-10 grow"
            placeholder="Count"
            value={count}
            onChange={(e) => {
              let value = parseInt(e.target.value);
              if (isNaN(value)) {
                value = 0;
              }
              dispatch({ type: REDUCER_ACTION.SET, value });
            }}
          />
        </label>
        <div className="card-actions">
          <button
            onClick={() => {
              dispatch({ type: "DECREMENT", value: 5 });
            }}
            className="btn btn-info"
          >
            -5
          </button>
          <button
            onClick={() => {
              dispatch({ type: "DECREMENT" });
            }}
            className="btn btn-secondary"
          >
            -
          </button>
          <button
            onClick={() => {
              dispatch({ type: "RESET" });
            }}
            className="btn btn-warning"
          >
            <RefreshCcw />
          </button>
          <button
            onClick={() => {
              dispatch({ type: "INCREMENT", value: 1 });
            }}
            className="btn btn-primary"
          >
            +
          </button>
          <button
            onClick={() => {
              dispatch({ type: "RIEN" });
            }}
            className="btn btn-warning"
          >
            ERREUR...
          </button>
        </div>
      </div>
    </div>
  );
}
