"use client";

import React, { useState, useContext } from "react";
import Link from "next/link";
import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { Logo, Menu } from "./index";

const NavBar = () => {
    const { currentAccount, connectWallet } = useContext(CrowdFundingContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuList: string[] = ["White Paper", "Project", "Donation", "Members"];

    return (
        <div className="backgroundMain">
            <div className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="inline-flex items-center mr-8"
                        >
                            <Logo color="text-white" />
                            <span className="ml-2 text-xl font-bold tracking-wide text-gray-100 uppercase">
                                Company
                            </span>
                        </Link>
                        <ul className="flex items-center space-x-8 lg:flex">
                            {menuList.map((el, i) => {
                                return (
                                    <li key={i + 1}>
                                        <Link
                                            href="/"
                                            className="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400"
                                        >
                                            {el}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    {!currentAccount && (
                        <ul className="flex items-center space-x-8 lg:flex">
                            <li>
                                <button
                                    onClick={() => connectWallet()}
                                    className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none background"
                                    aria-label="Sign up"
                                    title="Sign up"
                                >
                                    Connect Wallet
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavBar;
