import Button from "../components/Button.jsx";

export default function NavigationBar() {
  return (
    <header className="bg-slate-50 h-16 drop-shadow-lg grid grid-cols-[1fr,_auto,_1fr] px-6">
      {/* Left bar corner */}
      <div></div>
      {/* Navigation buttons */}
      <div className="flex justify-center items-center h-min-fit">
        <div className="px-6 font-semibold">Home</div>
        <div className="px-6 font-semibold">Decks</div>
        <div className="px-6 font-semibold">About</div>
      </div>
      {/* Right bar corner */}
      <div className="flex items-center flex-row-reverse gap-2">
        <Button className="bg-yellow-300 font-semibold" text="Sign in">
          Test
        </Button>
      </div>
    </header>
  );
}
