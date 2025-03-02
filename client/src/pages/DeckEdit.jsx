import PageWrapper from "../components/PageWrapper.jsx";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import api from "../services/api.jsx";
import { useState } from "react";
import DeckInfoHeader from "../components/DeckInfoHeader.jsx";
import FlippableCard from "../components/FlippableCard.jsx";
import Button from "../components/Button.jsx";
import { PiPlusCircleFill } from "react-icons/pi";

export default function DeckEdit() {
  const [cardList, setCardList] = useState([]);
  const [deckData, setDeckData] = useState(null);
  const params = useParams();
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeckData();
  }, []);

  async function fetchDeckData() {
    const result = await api("post", "/card/list", { deckGuid: params?.guid });
    console.log("result", result);
    setDeckData(result?.data);
    setCardList(result?.data?.data ?? []);
    console.log("CARD LIST\n", result?.data?.data ?? []);
    // Unauthorized
    if (result) setShowContent(true);
    else navigate("/login");
  }

  async function newCardHandle() {
    const result = await api("post", "/card/add", {
      deckGuid: params?.guid,
    });
    fetchDeckData();
  }

  return (
    <PageWrapper
      title={deckData?.deckName ?? "Decks"}
      key={`wrapper ${deckData?.deckName}`}
    >
      {/* Decks list */}
      {showContent ? (
        <>
          <DeckInfoHeader deckData={deckData} isEditable={true} />
          <section className="flex flex-col justify-center items-center rounded-md mb-32">
            <div className="grid grid-cols-4 gap-4 mt-8">
              {/* Card grid */}
              {cardList.map((card) => (
                <FlippableCard
                  cardData={card}
                  key={card.guid}
                  updateFunction={() => fetchDeckData()}
                  editControls={false}
                  mode="edit"
                />
              ))}
            </div>
          </section>
          {/* New card button */}
          <div className="fixed bottom-0 right-0 m-6  z-10">
            <Button
              className="flex justify-center items-center rounded-full bg-yellow-300 shadow-xl px-5 py-3"
              onClick={async () => await newCardHandle()}
            >
              <div className="flex items-center gap-3 p-2">
                <PiPlusCircleFill size="1.8rem" />
                <span className="text-xl font-semibold">New card</span>
              </div>
            </Button>
          </div>
        </>
      ) : null}
    </PageWrapper>
  );
}
