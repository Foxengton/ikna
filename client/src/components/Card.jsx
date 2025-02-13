import { useState } from "react";
import api from "../services/api.jsx";
import moment from "moment";

import {
  PiNotePencilFill,
  PiTrash,
  PiEyeBold,
  PiGraduationCapFill,
  PiTimerBold,
} from "react-icons/pi";
import SyncInput from "./SyncInput.jsx";

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
  const [mode, setMode] = useState(defaultMode);
  const modeStyle =
    mode === "edit"
      ? `shadow-inner rounded ${
          cardSide === "front" ? "bg-slate-100" : "bg-slate-600"
        }`
      : null;
  const editControlsStyle = editControls ? "visible" : "invisible";
  const deleteControlsStyle = deleteControls ? "visible" : "invisible";
  const infoBarStyle = infoBar ? "visible" : "invisible";
  const infoBarDueStyle = isDue ? "text-red-400" : null;

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
        <SyncInput
          key={cardData.guid + cardSide + mode}
          method="patch"
          url="card/update"
          apiData={{ cardGuid: cardData.guid }}
          state={() => [cardContent, setCardContent]}
          className={`w-full ${modeStyle}`}
          placeholder={cardSide === "front" ? "Empty front" : "Empty back"}
          fieldName={cardSide === "front" ? "cardFront" : "cardBack"}
          isEditable={mode === "edit"}
        />
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
