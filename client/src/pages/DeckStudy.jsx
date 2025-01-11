import PageWrapper from "../components/PageWrapper.jsx";
import userData from "../data.js";
import { NavLink, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";

const controlButtons = [
  {
    text: "Again",
    bg: "bg-red-300",
    difficultyFactor: 0,
  },
  {
    text: "Hard",
    bg: "bg-orange-300",
    difficultyFactor: 0.8,
  },
  {
    text: "Good",
    bg: "bg-green-300",
    difficultyFactor: 1,
  },
  {
    text: "Easy",
    bg: "bg-teal-300",
    difficultyFactor: 1.25,
  },
];
const INTERVAL_FACTOR = 1.8;

export default function DeckStudy() {
  let navigate = useNavigate();
  let params = useParams();
  const [deckData, setDeckData] = useState(null);
  const [pendingCards, setPendingCards] = useState(null);
  const [cardSide, setCardSide] = useState("front");
  let nextInterval = deckData?.nextInterval;

  // Params
  useEffect(() => {
    // Checking for SUID
    if (!params?.suid) navigate("/decks");
    // Checking for matching decks by SUID
    setDeckData(userData.decks.find((deck) => deck.suid == params.suid));
  }, []);
  useEffect(() => {
    // Navigating back if the deck data is missing
    if (deckData === undefined) navigate("/decks");
    // Updating local card list
    setPendingCards(
      deckData?.cards.filter(
        (card) =>
          card.lastReview === null ||
          Date.now() - card.lastReview >= card.nextInterval
      )
    );
    console.log(pendingCards);
  }, [deckData]);

  if (!deckData) return <PageWrapper />;
  return (
    <PageWrapper>
      {pendingCards ? (
        <>
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
                  {pendingCards[0].front}
                </div>
              ) : (
                <div className="flex justify-center items-center font-semibold w-96 min-h-96 p-8 text-2xl bg-slate-700 text-white">
                  {pendingCards[0].back}
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
