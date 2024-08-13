"use client";

import { cn } from "@/src/utils/cn";
import { Check, ShoppingBasket } from "lucide-react";
import { useContext } from "react";
import { createContext } from "react";
import { useState } from "react";
import { create } from "zustand";

const SHOES = [
  {
    name: "Air Max Plus",
    id: 1,
    cover: "/nikes/air-max-plus.jpeg",
  },
  {
    name: "Air Force",
    id: 2,
    cover: "/nikes/air-force.png",
  },
  {
    name: "Dunk Retro",
    id: 3,
    cover: "/nikes/dunk-retro.png",
  },
  {
    name: "Air Max",
    id: 4,
    cover: "/nikes/air-max.png",
  },
];

// EXO 2
const useBasketStore = create((set) => ({
  items: [],
  //  const onAddItem = (item) => {  setItems((prevItems) => [...prevItems, item]);  };
  onAddItem: (newItem) => {
    set((state) => ({
      //...state,         // idem mais ne sert à rien car ça fait pareil !!!
      items: [...state.items, newItem],
    }));
  },
  onDeleteItem: (deleteItem) =>
    set((currentState) => ({
      items: currentState.items.filter((i) => i.id !== deleteItem.id),
    })),
}));

const BasketContext = createContext(null);

const useBasketContext = () => {
  if (useContext(BasketContext) === null)
    throw new Error("useBasketContext must be used within a BasketProvider");

  return useContext(BasketContext);
};

const BasketContextProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  console.log(items);

  const onDeleteItem = (item) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
  };

  // EXO 1
  const isSelected = (items, idItemSelected) => {
    return items.some((item) => item.id === idItemSelected);
  };

  const onAddItem = (item) => {
    console.log(item);
    setItems((prevItems) => [...prevItems, item]);
  };

  return (
    <BasketContext.Provider
      value={{ items, setItems, onAddItem, onDeleteItem, isSelected }}
    >
      {children}
    </BasketContext.Provider>
  );
};

const Header = () => {
  // EXO 1
  // const { items, onDeleteItem } = useBasketContext();
  // EXO 2
  const { items, onDeleteItem } = useBasketStore();

  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral/40 bg-base-200 px-8 py-4 shadow-lg">
      <h2 className="text-2xl font-bold">Shoes</h2>
      <div className="dropdown">
        <button tabIndex={0} className="btn btn-secondary m-1">
          <ShoppingBasket size={16} /> {items.length}
        </button>
        <div
          tabIndex={0}
          className="card dropdown-content card-compact z-[1] w-64 bg-base-200 p-2 shadow"
        >
          <ul>
            {items.length === 0 ? (
              <li className="flex w-60 flex-row flex-nowrap items-center justify-between p-1">
                No items
              </li>
            ) : null}
            {items.map((item, index) => (
              <li
                key={index}
                className="flex w-60 flex-row flex-nowrap items-center justify-between p-1"
              >
                <img
                  src={item.cover}
                  alt={item.name}
                  className="m-0 size-8 rounded-full p-0"
                />
                <span>{item.name}</span>
                <button
                  onClick={() => {
                    onDeleteItem(item);
                  }}
                  className="btn btn-error btn-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BasketContextProvider>
      <div className="flex flex-col gap-8">
        <Header />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SHOES.map((shoe) => (
            <ShoeCard key={shoe.id} shoe={shoe} />
          ))}
        </div>
      </div>
    </BasketContextProvider>
  );
}

const ShoeCard = ({ shoe }) => {
  // 🦁 Utilise le context pour récupérer le state `isSelected` ainsi que `onAddItem` et `onDeleteItem`
  // EXO 1
  //const { items, onAddItem, onDeleteItem } = useBasketContext();
  // EXO 2
  //const { items, onAddItem, onDeleteItem } = useBasketStore();

  //const isSelected = items.some((item) => item.id === shoe.id); // si on trouve un item dans le panier qui a le même id que le shoe.id c'est qu'il a été sélectionné

  return (
    <div className="card flex w-full bg-base-300 shadow-xl">
      <figure>
        <img
          src={shoe.cover}
          className="h-32 w-full object-cover object-center"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{shoe.name}</h2>
        {/* EXO 1 et 2 */}
        {/* <div className="card-actions flex w-full items-end justify-end">
          <button
            onClick={() => {
              if (isSelected) {
                onDeleteItem(shoe);
              } else {
                onAddItem(shoe);
              }
            }}
            className={cn("btn", {
              "btn-outline": isSelected,
              "btn-primary": !isSelected,
            })}
          >
            <ShoppingBasket size={16} />{" "}
            {isSelected ? <Check size={16} /> : null}
          </button>
        </div> */}
        {/* EXO 3 */}
        <ShoeCardBasketButton shoe={shoe} />
      </div>
    </div>
  );
};

const ShoeCardBasketButton = ({ shoe }) => {
  // EXO 3

  // Les ajouter un par un car sinon on retourne ITEMS à chaque fois car il fait parti du useBasketStore (même si on ne l'utilise pas)
  const onAddItem = useBasketStore((s) => s.onAddItem);
  const onDeleteItem = useBasketStore((s) => s.onDeleteItem);
  // ces éléments sont des STABLE REF donc ne créent pas de re-render inutile

  // Exo 3 (2)
  //Ce code provoque un render de notre component pour chaque item du panier.
  //Zustand te permet de récupérer uniquement les informations qui sont nécessaires à notre component. Cela permet de ne pas re-render le component inutilement.
  //Alors qu'on pourrait faire en sorte que ce soit uniquement lorsque l'item actuel est modifié qu'il render.
  //Pour ça tu peux utiliser cette syntaxe :
  const isSelected = useBasketStore((s) =>
    s.items.some((item) => item.id === shoe.id)
  );

  return (
    <button
      onClick={() => {
        if (isSelected) {
          onDeleteItem(shoe);
        } else {
          onAddItem(shoe);
        }
      }}
      className={cn("btn", {
        "btn-outline": isSelected,
        "btn-primary": !isSelected,
      })}
    >
      <ShoppingBasket size={16} /> {isSelected ? <Check size={16} /> : null}
    </button>
  );
};
