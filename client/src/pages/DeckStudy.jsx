import PageWrapper from "../components/PageWrapper.jsx";
import userData from "../data.js";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";

export default function DeckStudy() {
  let navigate = useNavigate();
  let params = useParams();
  const [deckData, setDeckData] = useState(null);
  // Params
  useEffect(() => {
    // Checking for SUID
    if (!params?.suid) navigate("/decks");
    // Checking for matching decks by SUID
    setDeckData(userData.decks.find((deck) => deck.suid == params.suid));
  }, []);
  // Navigating back if the deck data is missing
  useEffect(() => {
    if (deckData === undefined) navigate("/decks");
  }, [deckData]);

  return (
    <PageWrapper>
      {deckData ? (
        <>
          <section className="flex flex-col justify-center items-center">
            {/* Card */}
            <div className="flex justify-center items-center shadow-xl mt-16 mb-8 bg-white">
              <div className="flex justify-center items-center font-semibold w-96 min-h-96 p-8 text-2xl">
                Lorem ipsum dolor
              </div>
            </div>
          </section>
          {/* Card control buttons */}
          <section className="flex gap-3 justify-center">
            <div className="flex flex-col items-center">
              <span className="text-sm">1 days</span>
              <Button className="bg-red-300 mt-1 min-w-20 flex justify-center">
                Again
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm">1 days</span>
              <Button className="bg-orange-300 mt-1 min-w-20 flex justify-center">
                Hard
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm">1 days</span>
              <Button className="bg-green-300 mt-1 min-w-20 flex justify-center">
                Good
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm">1 days</span>
              <Button className="bg-teal-300 mt-1 min-w-20 flex justify-center">
                Easy
              </Button>
            </div>
          </section>
        </>
      ) : null}
    </PageWrapper>
  );
}
