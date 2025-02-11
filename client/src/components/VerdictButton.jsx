import Button from "./Button.jsx";
import api from "../services/api.jsx";
import moment from "moment";

const VERDICTS = [
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

export default function VerdictButton({ cardInfo, verdict, afterClick }) {
  // Predicting the next time interval
  function verdictTimeEstimation() {
    let time;
    // Show no time for Again verdict
    if (button.multiplier == 0) return null;
    if (cardInfo.status === "LEARNING")
      time = LEARNING_STEPS[cardInfo.learningStep];
    if (cardInfo.status === "MEMORIZING")
      time = cardInfo.currentInterval * button.multiplier;
    return moment.duration(time, "seconds").humanize();
  }

  // Submit verdict
  async function handleClick() {
    const result = await api("patch", "/card/review", {
      cardGuid: cardInfo.guid,
      verdict: verdict,
    });
  }

  // Find verdict in the list of possible verdicts
  const button = VERDICTS.find((item) => item.verdict === verdict);
  if (!cardInfo || !button) return null;
  // Not showing Easy and Hard buttons for cards on the learning stage
  if (
    cardInfo.status === "LEARNING" &&
    (verdict === "Easy" || verdict === "Hard")
  )
    return null;

  return (
    <div className="flex flex-col items-center" key={button.text}>
      <span className="text-sm">{verdictTimeEstimation()}</span>
      <Button
        className={"mt-1 min-w-20 flex justify-center " + button.bg}
        onClick={async () => {
          await handleClick();
          afterClick();
        }}
      >
        {button.text}
      </Button>
    </div>
  );
}
