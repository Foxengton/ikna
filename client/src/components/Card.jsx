import { useState } from "react";
import api from "../services/api.jsx";
import moment from "moment";
import { motion } from "motion/react";

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
  side = "front",
  mode = "view",
  modeHook = () => null,
  contentHook = () => null,
}) {
  if (mode !== "view" && mode !== "edit") mode = "view";
  if (side !== "front" && side !== "back") side = "front";
  const isDue = moment().format("X") - cardData.nextReview >= 0;
  let nextReviewText = isDue
    ? "now"
    : moment.unix(cardData.nextReview).fromNow();
  const [cardContent, setCardContent] =
    contentHook(side === "front" ? cardData.cardFront : cardData.cardBack) ??
    useState(side === "front" ? cardData.cardFront : cardData.cardBack);
  const [cardMode, setCardMode] = modeHook(mode) ?? useState(mode);
  const modeStyle =
    cardMode === "edit"
      ? `shadow-inner rounded ${
          side === "front" ? "bg-slate-100" : "bg-slate-600"
        }`
      : null;
  const sideStyle =
    side === "front" ? "bg-white text-black" : "bg-slate-700 text-white";
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
    <div className="flex justify-center items-center shadow-xl rounded-lg">
      <div
        className={`flex relative justify-center items-center font-semibold w-96 min-h-96 p-4 text-2xl text-center rounded-lg ${sideStyle}`}
      >
        {/* Card content */}
        <SyncInput
          key={cardData.guid + side + cardMode}
          method="patch"
          url="card/update"
          apiData={{ cardGuid: cardData.guid }}
          state={() => [cardContent, setCardContent]}
          className={`w-full px-2 py-2 ${modeStyle}`}
          placeholder={side === "front" ? "Empty front" : "Empty back"}
          fieldName={side === "front" ? "cardFront" : "cardBack"}
          isEditable={cardMode === "edit"}
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
              if (cardMode === "view") setCardMode("edit");
              else setCardMode("view");
            }}
          >
            {cardMode === "view" ? (
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
