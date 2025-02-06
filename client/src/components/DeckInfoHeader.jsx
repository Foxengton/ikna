import {
  PiNoteFill,
  PiGraduationCapFill,
  PiHeadCircuitFill,
  PiTimerFill,
  PiNotePencilFill,
  PiTrashFill,
} from "react-icons/pi";

export default function DeckInfoHeader({ deckData }) {
  return (
    <header className="flex flex-row gap-8 justify-center items-center bg-slate-300 py-4">
      <div className="font-semibold">{deckData.deckName}</div>
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
