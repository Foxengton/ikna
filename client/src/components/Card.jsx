import { useState } from "react";

export default function Card({ cardData }) {
  const [cardSide, setCardSide] = useState("front");

  return (
    <div
      className="flex justify-center items-center shadow-xl"
      onClick={() => {
        // Switching card side
        if (cardSide === "front") setCardSide("back");
        else setCardSide("front");
      }}
    >
      {/* Displaying card sides */}
      {cardSide === "front" ? (
        <div className="flex justify-center items-center font-semibold w-96 min-h-96 p-8 text-2xl bg-white text-black">
          {cardData.cardFront}
        </div>
      ) : (
        <div className="flex justify-center items-center font-semibold w-96 min-h-96 p-8 text-2xl bg-slate-700 text-white">
          {cardData.cardBack}
        </div>
      )}
    </div>
  );
}
