export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <div className="bg-slate-50 h-16 drop-shadow-lg grid grid-cols-[1fr,_auto,_1fr]">
        {/* Left bar corner */}
        <div></div>
        {/* Navigation buttons */}
        <div className="flex justify-center items-center h-min-fit">
          <div className="px-6">Home</div>
          <div className="px-6">Decks</div>
          <div className="px-6">About</div>
        </div>
        {/* Right bar corner */}
        <div></div>
      </div>
    </div>
  );
}
