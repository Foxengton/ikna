import PageWrapper from "../components/PageWrapper.jsx";
import userData from "../data.js";
import { useNavigate } from "react-router";

export default function DeckIndex() {
  let navigate = useNavigate();

  return (
    <PageWrapper>
      {/* Decks list */}
      <section className="flex flex-col justify-center items-center">
        <table className="mt-16 bg-slate-50 shadow-lg p-2">
          <tr className="bg-slate-200">
            <td className="py-2 px-4 font-semibold">My decks</td>
            <td className="py-2 px-4 font-semibold">Cards</td>
          </tr>
          {userData.decks.map((deck) => (
            <tr
              className="hover:bg-yellow-300"
              onClick={() =>
                navigate(
                  "/study/" + deck.suid + "/" + deck.title.replace(/\s+/g, "-")
                )
              }
            >
              <td className="py-2 px-4">{deck.title}</td>
              <td className="py-2 px-4 text-center">{deck.cards.length}</td>
            </tr>
          ))}
        </table>
      </section>
    </PageWrapper>
  );
}
