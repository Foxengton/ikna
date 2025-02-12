import PageWrapper from "../components/PageWrapper.jsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import api from "../services/api.jsx";
import { useState } from "react";
import DeckInfoHeader from "../components/DeckInfoHeader.jsx";
import Card from "../components/Card.jsx";

export default function DeckEdit() {
  const [cardList, setCardList] = useState([]);
  const [deckData, setDeckData] = useState(null);
  const params = useParams();

  useEffect(() => {
    fetchDeckData();
  }, []);

  async function fetchDeckData() {
    const result = await api("post", "/card/list", { deckGuid: params?.guid });
    setDeckData(result?.data);
    setCardList(result?.data?.data);
    console.log("CARD LIST\n", cardList);
  }

  if (!deckData) return <PageWrapper />;
  return (
    <PageWrapper>
      {/* Decks list */}
      <DeckInfoHeader deckData={deckData} />
      <section className="flex flex-col justify-center items-center rounded-md">
        <div className="grid grid-cols-4 gap-4 mt-8">
          {/* Card grid */}
          {cardList.map((card, index) => (
            <Card cardData={card} key={index} />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
