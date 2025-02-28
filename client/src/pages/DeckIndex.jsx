import PageWrapper from "../components/PageWrapper.jsx";
import { replace, useNavigate } from "react-router";
import { useEffect } from "react";
import api from "../services/api.jsx";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider.jsx";
import { useState } from "react";
import {
  PiNoteFill,
  PiGraduationCapFill,
  PiHeadCircuitFill,
  PiTimerFill,
  PiNotePencilFill,
  PiTrashFill,
  PiPlusCircleFill,
} from "react-icons/pi";
import Button from "../components/Button.jsx";

export default function DeckIndex() {
  const navigate = useNavigate();
  const [userData, setUserData] = useContext(AuthContext);
  const token = userData?.token;
  const [deckList, setDeckList] = useState([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    fetchDeckData();
  }, []);

  async function fetchDeckData() {
    const result = await api("get", "/deck/list");
    setDeckList(result?.data);
    console.log("DECK LIST\n", result?.data);
    if (result) setShowContent(true);
    else navigate("/login", { replace: true });
  }

  // Navigate to study page
  function clickTitleHandle(deck) {
    const deckName = deck.deckName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    navigate(`/study/${deck.guid}/${deckName}`);
  }

  async function addDeckHandle() {
    const result = await api("post", "/deck/add", {
      deckName: "New deck",
    });
    fetchDeckData();
  }

  async function deleteDeckHandle(deck) {
    const result = await api("delete", "/deck/delete", {
      deckGuid: deck.guid,
    });
    fetchDeckData();
  }

  function editDeckHandle(deck) {
    navigate("/edit/" + deck.guid);
  }

  return (
    <PageWrapper title="Decks">
      {/* Decks list */}
      {showContent ? (
        <section className="flex flex-col justify-center items-center rounded-md">
          <div className="flex flex-col w-fit gap-2 pt-16">
            {deckList ? (
              <table className="bg-slate-50 shadow-lg p-2 rounded-md overflow-hidden">
                <tbody>
                  <tr className="bg-slate-200">
                    <td className="py-2 px-4 font-semibold">My decks</td>
                    <td className="py-2 px-2 font-semibold">
                      <PiTimerFill size="1.4rem" />
                    </td>
                    <td className="py-2 px-2 font-semibold">
                      <PiHeadCircuitFill size="1.4rem" />
                    </td>
                    <td className="py-2 px-2 font-semibold">
                      <PiGraduationCapFill size="1.4rem" />
                    </td>
                    <td className="py-2 px-2 font-semibold">
                      <PiNoteFill size="1.4rem" />
                    </td>
                    <td />
                    <td />
                  </tr>
                  {deckList.map((deck, index) => (
                    <tr key={index} className="hover:bg-yellow-100">
                      <td
                        className="py-2 px-4 hover:bg-yellow-300"
                        onClick={() => clickTitleHandle(deck)}
                      >
                        {deck.deckName}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {deck.cardCountDue}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {deck.cardCountReviewed}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {deck.cardCountGraduated}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {deck.cardCount}
                      </td>
                      <td
                        className="py-2 px-2 text-center hover:bg-yellow-300"
                        onClick={() => editDeckHandle(deck)}
                      >
                        <PiNotePencilFill size="1.4rem" />
                      </td>
                      <td
                        className="py-2 px-2 text-center hover:bg-yellow-300"
                        onClick={async () => await deleteDeckHandle(deck)}
                      >
                        <PiTrashFill size="1.4rem" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
            {/* New deck button */}
            <Button
              className="bg-yellow-300"
              onClick={async () => await addDeckHandle()}
            >
              <div className="flex flex-row gap-2 justify-center items-center font-semibold">
                <PiPlusCircleFill size="1.4rem" />
                <span>New deck</span>
              </div>
            </Button>
          </div>
        </section>
      ) : null}
    </PageWrapper>
  );
}
