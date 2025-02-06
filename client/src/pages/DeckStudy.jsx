import PageWrapper from "../components/PageWrapper.jsx";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import api from "../services/api.jsx";
import {
  PiNoteFill,
  PiGraduationCapFill,
  PiHeadCircuitFill,
  PiTimerFill,
  PiNotePencilFill,
  PiTrashFill,
} from "react-icons/pi";

const controlButtons = [
  {
    text: "Again",
    verdict: "Again",
    bg: "bg-red-300",
  },
  {
    text: "Hard",
    verdict: "Hard",
    bg: "bg-orange-300",
  },
  {
    text: "Good",
    verdict: "Good",
    bg: "bg-green-300",
  },
  {
    text: "Easy",
    verdict: "Easy",
    bg: "bg-teal-300",
  },
];

export default function DeckStudy() {
  let navigate = useNavigate();
  let params = useParams();
  const [deckData, setDeckData] = useState({});
  const [cardSide, setCardSide] = useState("front");
  const [cardList, setCardList] = useState([]);

  async function fetchDeckData() {
    const result = await api("post", "/card/list", {
      deckGuid: params?.suid,
      isDue: true,
    });
    setDeckData(result?.data);
    console.log("DECK DATA\n", result?.data);
  }

  useEffect(() => {
    // Fetch data only when the card list is empty
    fetchDeckData();
  }, []);

  useEffect(() => {
    setCardList(deckData?.data ?? []);
  }, [deckData]);

  async function handleVerdict(verdict) {
    const result = await api("patch", "/card/review", {
      cardGuid: cardList[0].guid,
      verdict: verdict,
    });
    fetchDeckData();
  }

  if (!deckData) return <PageWrapper />;
  return (
    <PageWrapper>
      {cardList.length != 0 ? (
        <>
          {/* Header */}
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
          <section className="flex flex-col justify-center items-center">
            {/* Card */}
            <div
              className="flex justify-center items-center shadow-xl mt-16 mb-8"
              onClick={() => {
                // Switching card side
                if (cardSide === "front") setCardSide("back");
                else setCardSide("front");
              }}
            >
              {/* Displaying card sides */}
              {cardSide === "front" ? (
                <div className="flex justify-center items-center font-semibold w-96 min-h-96 p-8 text-2xl bg-white text-black">
                  {cardList[0].cardFront}
                </div>
              ) : (
                <div className="flex justify-center items-center font-semibold w-96 min-h-96 p-8 text-2xl bg-slate-700 text-white">
                  {cardList[0].cardBack}
                </div>
              )}
            </div>
          </section>
          {/* Card control buttons */}
          <section className="flex gap-3 justify-center">
            {controlButtons.map((btn) => (
              <div className="flex flex-col items-center" key={btn.text}>
                <span className="text-sm">1 days</span>
                <Button
                  className={"mt-1 min-w-20 flex justify-center " + btn.bg}
                  onClick={() => handleVerdict(btn.verdict)}
                >
                  {btn.text}
                </Button>
              </div>
            ))}
          </section>
        </>
      ) : (
        // No cards left
        <div className="flex flex-col items-center mt-16">
          <h1 className="text-3xl font-semibold">Done!</h1>
          <p>You have no more cards to review in this deck.</p>
          <p>Come back tomorrow.</p>
          <Button className="bg-slate-200 mt-4" to="/decks">
            Go back
          </Button>
        </div>
      )}
    </PageWrapper>
  );
}
