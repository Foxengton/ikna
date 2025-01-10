import PageWrapper from "../components/PageWrapper.jsx";

export default function Home() {
  return (
    <PageWrapper>
      {/* Center logo */}
      <section className="flex flex-col justify-center items-center">
        <div className="text-8xl font-lexend mt-36 font-light">IKNA</div>
        <div className="text-2xl font-light">Learning is easy!</div>
      </section>
    </PageWrapper>
  );
}
