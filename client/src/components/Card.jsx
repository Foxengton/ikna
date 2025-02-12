import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import api from "../services/api.jsx";

import { PiNotePencilFill } from "react-icons/pi";
import { PiEyeBold } from "react-icons/pi";

export default function Card({ cardData, editable = false }) {
  const [cardSide, setCardSide] = useState("front");
  const sideStyle =
    cardSide === "front" ? "bg-white text-black" : "bg-slate-700 text-white";
  const [frontContent, setFrontContent] = useState(cardData.cardFront);
  const [backContent, setBackContent] = useState(cardData.cardBack);
  const [cardContent, setCardContent] =
    cardSide === "front"
      ? [frontContent, setFrontContent]
      : [backContent, setBackContent];
  const textBox = useRef(null);
  const [unsavedFlag, setUnsavedFlag] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const textAlign = lineCount <= 1 ? "text-center" : "text-start";
  const [isEditable, setIsEditable] = useState(editable);
  const editableStyle = isEditable
    ? `shadow-inner rounded ${
        cardSide === "front" ? "bg-slate-100" : "bg-slate-600"
      }`
    : null;

  // Auto growth/shrinking of the textbox
  useEffect(() => {
    const box = textBox.current;
    box.style.height = "0px";
    box.style.height = box.scrollHeight + "px";
    const boxStyle = window.getComputedStyle(box);
    // Counting actual lines in the textbox
    setLineCount(
      Math.round(parseInt(boxStyle.height) / parseInt(boxStyle.lineHeight) - 1)
    );
  }, [cardContent]);

  function handleInputChange() {
    const box = textBox.current;
    setUnsavedFlag(box.value != cardContent);
    setCardContent(box.value);
  }

  async function handleInputSubmit() {
    if (!unsavedFlag) return;
    const box = textBox.current;
    const data = {
      cardGuid: cardData.guid,
      cardFront: frontContent,
      cardBack: backContent,
    };
    const result = await api("patch", "/card/update", data);
    console.log("CARD UPDATED:", data);
    setUnsavedFlag(false);
  }

  return (
    <>
      <div
        className="flex justify-center items-center shadow-xl"
        onClick={() => {
          // Switching card side
          if (cardSide === "front") setCardSide("back");
          else setCardSide("front");
        }}
      >
        <div
          className={`flex relative justify-center items-center font-semibold w-96 min-h-96 p-4 text-2xl text-center ${sideStyle}`}
        >
          {/* Card content */}
          <div className="w-full">
            <textarea
              ref={textBox}
              readOnly={!isEditable}
              disabled={!isEditable}
              className={`overflow-auto resize-none w-full px-2 py-2 ${textAlign} ${editableStyle}`}
              value={cardContent}
              placeholder="Empty card"
              onClick={(e) => e.stopPropagation()}
              onChange={() => handleInputChange()}
              onBlur={async () => await handleInputSubmit()}
            />
          </div>
          {/* Edit/view icon */}
          <div
            className="absolute top-0 right-0 p-4 hover:text-yellow-500"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditable(!isEditable);
            }}
          >
            {!isEditable ? (
              <PiNotePencilFill size="1.4rem" />
            ) : (
              <PiEyeBold size="1.4rem" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
