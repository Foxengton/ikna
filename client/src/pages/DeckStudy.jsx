import PageWrapper from "../components/PageWrapper.jsx";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import api from "../services/api.jsx";
import DeckInfoHeader from "../components/DeckInfoHeader.jsx";
import Card from "../components/Card.jsx";
import moment from "moment";
import VerdictButton from "../components/VerdictButton.jsx";

export default function DeckStudy() {
  let navigate = useNavigate();
  let params = useParams();
  const [deckData, setDeckData] = useState({});
  const [cardList, setCardList] = useState([]);

  async function fetchDeckData() {
    const result = await api("post", "/card/list", {
      deckGuid: params?.guid,
      isDue: true,
    });
    setDeckData(result?.data);
    console.log("DECK DATA\n", result?.data);
  }

  useEffect(() => {
    fetchDeckData();
  }, []);

  useEffect(() => {
    setCardList(deckData?.data ?? []);
  }, [deckData]);

  if (!deckData) return <PageWrapper />;
  return (
    <PageWrapper>
      {cardList.length != 0 ? (
        <>
          <DeckInfoHeader deckData={deckData} />
          <section className="flex justify-center items-center mt-8 mb-8">
            <Card
              cardData={cardList[0]}
              deleteControls={false}
              infoBar={false}
            />
          </section>
          {/* Card control buttons */}
          <section className="flex gap-3 justify-center items-end">
            <VerdictButton
              cardData={cardList[0]}
              afterClick={fetchDeckData}
              verdict="Again"
            />
            <VerdictButton
              cardData={cardList[0]}
              afterClick={fetchDeckData}
              verdict="Hard"
            />
            <VerdictButton
              cardData={cardList[0]}
              afterClick={fetchDeckData}
              verdict="Good"
            />
            <VerdictButton
              cardData={cardList[0]}
              afterClick={fetchDeckData}
              verdict="Easy"
            />
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
