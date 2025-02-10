import PageWrapper from "../components/PageWrapper.jsx";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import api from "../services/api.jsx";
import DeckInfoHeader from "../components/DeckInfoHeader.jsx";
import Card from "../components/Card.jsx";
import moment from "moment";

const CONTROL_BUTTONS = [
  {
    text: "Again",
    verdict: "Again",
    multiplier: 0,
    bg: "bg-red-300",
    learningDisplay: true,
  },
  {
    text: "Hard",
    verdict: "Hard",
    multiplier: 1.25,
    bg: "bg-orange-300",
    learningDisplay: false,
  },
  {
    text: "Good",
    verdict: "Good",
    multiplier: 1.75,
    bg: "bg-green-300",
    learningDisplay: true,
  },
  {
    text: "Easy",
    verdict: "Easy",
    multiplier: 2.25,
    bg: "bg-teal-300",
    learningDisplay: false,
  },
];

const LEARNING_STEPS = [{ m: 1 }, { m: 5 }, { d: 1 }];

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

  // Return the next estimated interval depedning on verdict and card status
  function verdictTimeEstimation(interval, multiplier, status, step) {
    if (multiplier == 0) return 0;
    if (status === "LEARNING") return LEARNING_STEPS[step];
    if (status === "MEMORIZING") return interval * multiplier;
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
            {CONTROL_BUTTONS.filter(
              (btn) =>
                cardList[0].status === "MEMORIZING" || btn.learningDisplay
            ).map((btn) => (
              <div className="flex flex-col items-center" key={btn.text}>
                <span className="text-sm">
                  {moment
                    .duration(
                      verdictTimeEstimation(
                        cardList[0].currentInterval,
                        btn.multiplier,
                        cardList[0].status,
                        cardList[0].learningStep
                      ),
                      "seconds"
                    )
                    .humanize()}
                </span>
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
