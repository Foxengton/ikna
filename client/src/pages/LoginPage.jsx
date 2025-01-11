import Button from "../components/Button.jsx";
import PageWrapper from "../components/PageWrapper.jsx";

export default function LoginPage() {
  return (
    <PageWrapper>
      <div className="absolute h-screen w-screen">
        <div className="flex h-full justify-center items-center">
          <form className="flex flex-col p-4 bg-white rounded justify-center items-center shadow-xl w-72">
            <h1 className="font-semibold text-2xl mb-2">Sign in</h1>
            {/* Username */}
            <div className="flex flex-col w-full">
              <span className="p-1 text-red-600"></span>
              <input
                className="shadow-inner rounded p-2 bg-slate-50"
                placeholder="Username"
              ></input>
            </div>
            {/* Username */}
            <div className="flex flex-col w-full mb-4">
              <span className="p-1 text-red-600"></span>
              <input
                className="shadow-inner rounded p-2 bg-slate-50"
                placeholder="Password"
              ></input>
            </div>
            {/* Submit */}
            <Button className={"bg-yellow-300 px-4 py-1 font-semibold"}>
              Log in
            </Button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
