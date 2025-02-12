import PageWrapper from "../components/PageWrapper.jsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import api from "../services/api.jsx";
import { useState } from "react";
import DeckInfoHeader from "../components/DeckInfoHeader.jsx";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";

import { PiPlusCircleFill } from "react-icons/pi";

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

  async function newCardHandle() {
    const result = await api("post", "/card/add", {
      deckGuid: params?.guid,
    });
    fetchDeckData();
  }

  if (!deckData) return <PageWrapper />;
  return (
    <PageWrapper>
      {/* Decks list */}
      <DeckInfoHeader deckData={deckData} />
      <section className="flex flex-col justify-center items-center rounded-md mb-32">
        <div className="grid grid-cols-4 gap-4 mt-8">
          {/* Card grid */}
          {cardList.map((card, index) => (
            <Card cardData={card} key={index} />
          ))}
        </div>
      </section>
      {/* New card button */}
      <div className="fixed bottom-0 right-0 m-6 rounded-full overflow-hidden shadow-xl z-10">
        <Button
          className="flex justify-center items-center bg-yellow-300"
          onClick={async () => await newCardHandle()}
        >
          <div className="flex items-center gap-3 p-2">
            <PiPlusCircleFill size="1.8rem" />
            <span className="text-xl font-semibold">New card</span>
          </div>
        </Button>
      </div>
    </PageWrapper>
  );
}
