import SyncInput from "./SyncInput.jsx";
import {
  PiNoteFill,
  PiGraduationCapFill,
  PiHeadCircuitFill,
  PiTimerFill,
  PiNotePencilFill,
  PiTrashFill,
} from "react-icons/pi";
import { useState } from "react";

export default function DeckInfoHeader({ deckData, isEditable = false }) {
  const editStyle = isEditable ? "bg-slate-100 shadow-inner rounded" : "";

  return (
    <header className="flex flex-row gap-8 justify-center items-center bg-slate-300 py-2">
      <SyncInput
        placeholder="Deck name"
        fieldName="deckName"
        valueHook={() => useState(deckData.deckName)}
        method="patch"
        url="deck/update"
        apiData={{ deckGuid: deckData.guid }}
        className={`py-2 font-semibold ${editStyle}`}
        isEditable={isEditable}
      />
      <div className="flex gap-4">
        <div className="flex gap-1">
          <span>{deckData.cardCountDue}</span>
          <PiTimerFill size="1.4rem" />
        </div>
        <div className="flex gap-1">
          <span>{deckData.cardCountReviewed}</span>
          <PiHeadCircuitFill size="1.4rem" />
        </div>
        <div className="flex gap-1">
          <span>{deckData.cardCountGraduated}</span>
          <PiGraduationCapFill size="1.4rem" />
        </div>
        <div className="flex gap-1">
          <span>{deckData.cardCount}</span>
          <PiNoteFill size="1.4rem" />
        </div>
      </div>
    </header>
  );
}
