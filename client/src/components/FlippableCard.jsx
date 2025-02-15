import { useState } from "react";
import Card from "./Card.jsx";
import { motion } from "motion/react";

export default function FlippableCard({
  cardData,
  updateFunction = async () => {},
  editControls = true,
  deleteControls = true,
  infoBar = true,
  side = "front",
  mode = "view",
  flipHook = useState,
}) {
  if (mode !== "view" && mode !== "edit") mode = "view";
  if (side !== "front" && side !== "back") side = "front";
  const [commonMode, setCommonMode] = useState(mode);
  const [isFlipped, setIsFlipped] = flipHook(side === "back");

  function handleFlip() {
    setIsFlipped(!isFlipped);
  }

  return (
    <div className="relative w-min">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        initial={false}
        className="absolute backface-hidden"
        onClick={() => handleFlip()}
      >
        <Card
          cardData={cardData}
          key={cardData.guid + "front"}
          updateFunction={updateFunction}
          editControls={editControls}
          deleteControls={deleteControls}
          infoBar={infoBar}
          side="front"
          mode={mode}
          modeHook={() => [commonMode, setCommonMode]}
        />
      </motion.div>
      <motion.div
        animate={{ rotateY: isFlipped ? 0 : 180 }}
        initial={false}
        className="backface-hidden"
        onClick={() => handleFlip()}
      >
        <Card
          cardData={cardData}
          key={cardData.guid + "back"}
          updateFunction={updateFunction}
          editControls={editControls}
          deleteControls={deleteControls}
          infoBar={infoBar}
          side="back"
          mode={mode}
          modeHook={() => [commonMode, setCommonMode]}
        />
      </motion.div>
    </div>
  );
}
