import { useState, useContext } from "react";
import api from "../services/api.jsx";
import moment from "moment";
import { ThemeContext } from "../contexts/ThemeProvider.jsx";
import SyncInput from "./SyncInput.jsx";
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
  side = "front",
  mode = "view",
  modeHook = useState,
  contentHook = useState,
}) {
  if (mode !== "view" && mode !== "edit") mode = "view";
  if (side !== "front" && side !== "back") side = "front";
  const [theme, setTheme] = useContext(ThemeContext);
  const isDue = moment().format("X") - cardData.nextReview >= 0;
  let nextReviewText = isDue
    ? "now"
    : moment.unix(cardData.nextReview).fromNow();
  const [cardContent, setCardContent] = contentHook(
    side === "front" ? cardData.cardFront : cardData.cardBack
  );
  const [cardMode, setCardMode] = modeHook(mode) ?? useState(mode);
  const inputStyle = cardMode === "edit" ? theme.card[side].inputEdit : null;

  async function handleCardDelete() {
    const data = { cardGuid: cardData.guid };
    const result = await api("delete", "/card/delete", data);
    console.log("CARD DELETED:", data);
    await updateFunction();
  }

  return (
    <div className="flex justify-center items-center shadow-xl rounded-lg">
      <div
        className={`flex relative justify-center items-center font-semibold p-4 text-2xl text-center rounded-lg ${theme.card[side].base} ${theme.card.size}`}
      >
        {/* Card content */}
        <SyncInput
          key={cardData.guid + side + cardMode}
          className={`w-full py-1 px-2 m-1 rounded ${inputStyle}`}
          method="patch"
          url="card/update"
          apiData={{ cardGuid: cardData.guid }}
          valueHook={() => [cardContent, setCardContent]}
          placeholder={side === "front" ? "Empty front" : "Empty back"}
          fieldName={side === "front" ? "cardFront" : "cardBack"}
          isEditable={cardMode === "edit"}
        />
        {/* Controls */}
        <div className="absolute top-0 right-0 w-full grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Delete icon */}
          {deleteControls ? (
            <button
              className="p-4 w-min hover:text-red-500 justify-self-start"
              onClick={async (e) => {
                e.stopPropagation();
                await handleCardDelete();
              }}
            >
              <PiTrash size="1.4rem" />
            </button>
          ) : null}
          {/* Time info bar */}
          {infoBar ? (
            <div className="text-sm">
              {cardData.status === "GRADUATED" ? (
                <div className="flex flex-row gap-1 text-violet-500">
                  <PiGraduationCapFill size="1.2rem" />
                  <span>Graduated</span>
                </div>
              ) : (
                <div
                  className={`flex flex-row gap-1 ${
                    isDue ? "text-red-400" : "text-neutral-400"
                  }`}
                >
                  <PiTimerBold size="1.2rem" />
                  <span>{nextReviewText}</span>
                </div>
              )}
            </div>
          ) : null}
          {/* Edit/view icon */}
          {editControls ? (
            <button
              className="p-4 w-min hover:text-yellow-500 justify-self-end"
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
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
