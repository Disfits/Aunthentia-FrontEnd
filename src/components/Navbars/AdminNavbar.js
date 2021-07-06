import React, { useState, useEffect } from "react";
import Web3 from "web3";

import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Navbar() {
  const [account, setAccount] = useState();
  const contractAddress = "0x03AfF2Af74D355E4bEE93301a5e003F8A2a7ec23";

  useEffect(() => {
    if (!window.ethereum) {
      console.log("Get metamask plis request");
      return;
    }
    window.ethereum.request({ method: "eth_requestAccounts" });
    const web3 = new Web3(window.ethereum);
    setAccount(window.ethereum.selectedAddress);
  }, []);
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            Dashboard
          </a>
          {/* Form */}
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <UserDropdown address={account} />
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
