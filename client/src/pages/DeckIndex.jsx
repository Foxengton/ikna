import PageWrapper from "../components/PageWrapper.jsx";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import api from "../services/api.jsx";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider.jsx";
import { useState } from "react";

export default function DeckIndex() {
  const navigate = useNavigate();
  const token = useContext(AuthContext)?.token;
  const [deckList, setDeckList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await api("get", "/deck/list", {
        token: token,
      });
      setDeckList(result?.data);
    }
    fetchData();
  }, []);

  return (
    <PageWrapper>
      {/* Decks list */}
      <section className="flex flex-col justify-center items-center">
        {deckList ? (
          <table className="mt-16 bg-slate-50 shadow-lg p-2">
            <tr className="bg-slate-200">
              <td className="py-2 px-4 font-semibold">My decks</td>
              <td className="py-2 px-4 font-semibold">Cards</td>
            </tr>
            {deckList.map((deck) => (
              <tr
                className="hover:bg-yellow-300"
                onClick={() =>
                  navigate(
                    "/study/" +
                      deck.suid +
                      "/" +
                      deck.deckName.replace(/\s+/g, "-")
                  )
                }
              >
                <td className="py-2 px-4">{deck.deckName}</td>
                <td className="py-2 px-4 text-center">{deck.cardCount}</td>
              </tr>
            ))}
          </table>
        ) : null}
      </section>
    </PageWrapper>
  );
}
