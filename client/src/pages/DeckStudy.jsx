import PageWrapper from "../components/PageWrapper.jsx";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import api from "../services/api.jsx";
import DeckInfoHeader from "../components/DeckInfoHeader.jsx";
import Card from "../components/Card.jsx";

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
          <DeckInfoHeader deckData={deckData} />
          <section className="flex justify-center items-center mt-8 mb-8">
            <Card cardData={cardList[0]} />
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
