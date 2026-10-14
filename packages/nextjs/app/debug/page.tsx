import { DebugModules } from "./_components/DebugModules";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-move/getMetadata";

export const metadata = getMetadata({
  title: "Debug Modules",
  description: "Debug your deployed 🏗 Scaffold Move modules in an easy way",
});

const Debug: NextPage = () => {
  return (
    <>
      <DebugModules />
      <div className="text-center mt-8 bg-base-300 p-10">
        <h1 className="text-4xl my-0">Debug Modules</h1>
        <p>
          You can debug & interact with your deployed modules here.
          <br /> Check{" "}
          <code className="italic bg-base-100 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / app / debug / page.tsx
          </code>{" "}
        </p>
      </div>
    </>
  );
};

export default Debug;
