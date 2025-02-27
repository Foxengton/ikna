import Button from "../components/Button.jsx";
import PageWrapper from "../components/PageWrapper.jsx";

export default function Error404() {
  return (
    <PageWrapper title="Error 404">
      {/* Center logo */}
      <section className="flex flex-col justify-center items-center">
        <div className="text-8xl font-lexend mt-36 font-light">404</div>
        <div className="text-xl font-light w-60 text-center">
          You've wandered a little too far, haven't you?
        </div>
        <Button to="/" className="bg-slate-200 mt-12">
          Go back
        </Button>
      </section>
    </PageWrapper>
  );
}
