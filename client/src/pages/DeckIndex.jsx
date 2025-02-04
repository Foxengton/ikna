import PageWrapper from "../components/PageWrapper.jsx";
import { useNavigate } from "react-router";
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
} from "react-icons/pi";

export default function DeckIndex() {
  const navigate = useNavigate();
  const token = useContext(AuthContext)?.token;
  const [deckList, setDeckList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await api("get", "/deck/list");
      setDeckList(result?.data);
      console.log(result?.data);
    }
    fetchData();
  }, []);

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
  function clickEditHandle(deck) {}
  function clickDeleteHandle(deck) {}

  return (
    <PageWrapper>
      {/* Decks list */}
      <section className="flex flex-col justify-center items-center">
        {deckList ? (
          <table className="mt-16 bg-slate-50 shadow-lg p-2">
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
                  <td className="py-2 px-2 text-center">{deck.cardCountDue}</td>
                  <td className="py-2 px-2 text-center">
                    {deck.cardCountReviewed}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {deck.cardCountGraduated}
                  </td>
                  <td className="py-2 px-2 text-center">{deck.cardCount}</td>
                  <td
                    className="py-2 px-2 text-center hover:bg-yellow-300"
                    onClick={() => clickEditHandle(deck)}
                  >
                    <PiNotePencilFill size="1.4rem" />
                  </td>
                  <td
                    className="py-2 px-2 text-center hover:bg-yellow-300"
                    onClick={() => clickDeleteHandle(deck)}
                  >
                    <PiTrashFill size="1.4rem" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </section>
    </PageWrapper>
  );
}
