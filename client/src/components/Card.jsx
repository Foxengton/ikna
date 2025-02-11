import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { PiArrowUUpLeftFill } from "react-icons/pi";

export default function Card({ cardData, isEditable = false }) {
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
  const [lineCount, setLineCount] = useState(0);
  const textAlign = lineCount <= 1 ? "text-center" : "text-start";

  // Auto growth/shrinking of the textbox
  useEffect(() => {
    const box = textBox.current;
    box.style.height = "0px";
    box.style.height = box.scrollHeight + "px";
    const boxStyle = window.getComputedStyle(box);
    // Counting actual lines in the textbox
    setLineCount(
      Math.round(parseInt(boxStyle.height) / parseInt(boxStyle.lineHeight))
    );
  }, [cardContent]);

  function handleInputChange(e) {
    setCardContent(e.target.value);
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
          className={`flex justify-center items-center font-semibold w-96 min-h-96 p-8 text-2xl text-center ${sideStyle}`}
        >
          {/* Card content */}
          <div className="w-full">
            <textarea
              ref={textBox}
              readOnly={!isEditable}
              disabled={!isEditable}
              className={`overflow-auto resize-none box-content w-full ${textAlign}`}
              value={cardContent}
              placeholder="Empty card"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
