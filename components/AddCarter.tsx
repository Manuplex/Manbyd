'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { saveToCart } from "@/lib/cartStorage";

interface AddCarterProps {
  articleId: string;
  articleName: string;
  price: string;
}

export default function AddCarter({ articleId, articleName, price }: AddCarterProps) {
  const [number, setNumber] = useState(0);

  // Sauvegarde dans le panier chaque fois que la quantité change
  useEffect(() => {
    if (number > 0) {
      saveToCart({
        id: articleId,
        name: articleName,
        price,
        quantity: number,
      });
    }
  }, [number, articleId, articleName, price]);

  const handleIncrement = () => {
    setNumber((prevNumber) => prevNumber + 1);
  };

  const handleDecrement = () => {
    setNumber((prevNumber) => (prevNumber > 0 ? prevNumber - 1 : 0));
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDecrement}
        className="rounded-full bg-red-500 px-3 py-1 text-white transition hover:bg-red-400"
      >
        <Image src="/minus.png" alt="bouton_moins" width={16} height={16} />
      </button>
      <span className="bg-white text-black opacity-45 px-3 py-1">{number}</span>
      <button
        onClick={handleIncrement}
        className="rounded-full bg-green-500 px-3 py-1 text-white transition hover:bg-green-400"
      >
        <Image src="/plus.png" alt="bouton_plus" width={16} height={16} />
      </button>
    </div>
  );
}
