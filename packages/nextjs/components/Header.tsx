"use client";

import React, { useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { CustomConnectButton } from "~~/components/scaffold-move";
import { useOutsideClick } from "~~/hooks/scaffold-move";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Bio",
    href: "/bio",
  },
  {
    label: "Debug Modules",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href} className="h-full">
            <Link
              href={href}
              passHref
              aria-current={isActive ? "page" : undefined}
              className={`${
                isActive
                  ? "border-b-secondary text-base-content"
                  : "border-b-transparent text-base-content/70 hover:border-b-base-content/20 hover:text-base-content"
              } border-y-3 border-t-transparent h-full px-4 text-sm gap-2 flex items-center whitespace-nowrap`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  const closeBurgerMenu = useCallback(() => burgerMenuRef.current?.removeAttribute("open"), []);
  useOutsideClick(burgerMenuRef, closeBurgerMenu);

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-16 shrink-0 justify-between z-20 border-b-2 border-base-300 p-0 sm:px-2">
      <div className="navbar-start w-auto self-stretch">
        {/* details instead of a focus dropdown: daisyUI 5 disables pointer events on a focused trigger */}
        <details className="lg:hidden dropdown self-center" ref={burgerMenuRef}>
          <summary className="ml-1 btn btn-ghost hover:bg-transparent" aria-label="Open navigation menu">
            <Bars3Icon className="h-1/2" aria-hidden="true" />
          </summary>
          <ul className="menu menu-sm dropdown-content mt-3 p-2 shadow-lg bg-base-100 w-52" onClick={closeBurgerMenu}>
            <HeaderMenuLinks />
          </ul>
        </details>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0 self-center">
          <div className="flex relative w-10 h-10">
            <Image alt="SM logo" className="cursor-pointer" fill sizes="40px" src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Scaffold-Move</span>
            <span className="text-xs">Move dev stack</span>
          </div>
        </Link>
        {/* translate-y-0.5 puts the active underline on the header's bottom border */}
        <ul className="hidden lg:flex lg:flex-nowrap h-full m-0 p-0 list-none translate-y-0.5">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end grow mr-4">
        <CustomConnectButton />
      </div>
    </div>
  );
};
