import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import api from "../services/api.jsx";
import moment from "moment";

import {
  PiNotePencilFill,
  PiTrash,
  PiEyeBold,
  PiGraduationCapFill,
  PiTimerBold,
} from "react-icons/pi";

export default function Card({
  cardData,
  updateFunction = async () => {},
  editControls = true,
  deleteControls = true,
  infoBar = true,
  flipControls = true,
  defaultSide = "front",
  defaultMode = "view",
}) {
  if (defaultMode !== "view" && defaultMode !== "edit") defaultMode = "view";
  if (defaultSide !== "front" && defaultSide !== "back") defaultSide = "front";
  const isDue = moment().format("X") - cardData.nextReview >= 0;
  let nextReviewText = isDue
    ? "now"
    : moment.unix(cardData.nextReview).fromNow();
  const [cardSide, setCardSide] = useState(defaultSide);
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
  const [mode, setMode] = useState(defaultMode);
  const modeStyle =
    mode === "edit"
      ? `shadow-inner rounded ${
          cardSide === "front" ? "bg-slate-100" : "bg-slate-600"
        }`
      : null;
  const placeHolder = cardSide === "front" ? "Empty front" : "Empty back";
  const editControlsStyle = editControls ? "visible" : "invisible";
  const deleteControlsStyle = deleteControls ? "visible" : "invisible";
  const infoBarStyle = infoBar ? "visible" : "invisible";
  const infoBarDueStyle = isDue ? "text-red-400" : null;

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

  async function handleCardDelete() {
    const data = { cardGuid: cardData.guid };
    const result = await api("delete", "/card/delete", data);
    console.log("CARD DELETED:", data);
    await updateFunction();
  }

  return (
    <div
      className="flex justify-center items-center shadow-xl rounded-lg"
      onClick={() => {
        // Switching card side
        if (!flipControls) return;
        if (cardSide === "front") setCardSide("back");
        else setCardSide("front");
      }}
    >
      <div
        className={`flex relative justify-center items-center font-semibold w-96 min-h-96 p-4 text-2xl text-center rounded-lg ${sideStyle}`}
      >
        {/* Card content */}
        <div className="w-full">
          <textarea
            ref={textBox}
            readOnly={mode === "view"}
            disabled={mode === "view"}
            className={`overflow-auto resize-none w-full px-2 py-2 ${textAlign} ${modeStyle}`}
            value={cardContent}
            placeholder={placeHolder}
            onClick={(e) => e.stopPropagation()}
            onChange={() => handleInputChange()}
            onBlur={async () => await handleInputSubmit()}
          />
        </div>
        {/* Controls */}
        <div className="absolute top-0 right-0 w-full flex flex-row justify-between items-center">
          {/* Delete icon */}
          <div
            className={`p-4 hover:text-red-500 ${deleteControlsStyle}`}
            onClick={async (e) => {
              e.stopPropagation();
              await handleCardDelete();
            }}
          >
            <PiTrash size="1.4rem" />
          </div>
          {/* Time info bar */}
          <div className={`text-sm ${infoBarStyle}`}>
            {cardData.status === "GRADUATED" ? (
              <div className="flex flex-row gap-1 text-violet-500">
                <PiGraduationCapFill size="1.2rem" />
                <span>Graduated</span>
              </div>
            ) : (
              <div
                className={`flex flex-row gap-1 text-gray-400 ${infoBarDueStyle}`}
              >
                <PiTimerBold size="1.2rem" />
                <span>{nextReviewText}</span>
              </div>
            )}
          </div>
          {/* Edit/view icon */}
          <div
            className={`p-4 hover:text-yellow-500 ${editControlsStyle}`}
            onClick={(e) => {
              e.stopPropagation();
              if (mode === "view") setMode("edit");
              else setMode("view");
            }}
          >
            {mode === "view" ? (
              <PiNotePencilFill size="1.4rem" />
            ) : (
              <PiEyeBold size="1.4rem" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
