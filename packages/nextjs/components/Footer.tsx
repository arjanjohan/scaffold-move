import React from "react";
import { SwitchTheme } from "~~/components/SwitchTheme";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0">
        <div className="flex flex-col md:flex-row gap-2" />
        <SwitchTheme />
      </div>
      <div className="w-full flex justify-center items-center text-sm">
        <p className="m-0">Built with </p>
        <a className="ml-1 link" href="https://github.com/arjanjohan/scaffold-move" target="_blank" rel="noreferrer">
          Scaffold Move
        </a>
      </div>
    </div>
  );
};
