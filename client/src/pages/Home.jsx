import { useState } from "react";
import NavigationBar from "../features/NavigationBar.jsx";

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <NavigationBar />
      {/* Center logo */}
      <section className="flex flex-col justify-center items-center">
        <div className="text-8xl font-lexend mt-36 font-light">IKNA</div>
        <div className="text-2xl font-light">Learning is easy!</div>
      </section>
    </div>
  );
}
