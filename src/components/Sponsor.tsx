import React from "react";
import Image from 'next/image';
import Logo from "../assets/neo-haven.svg";

export const Sponsor = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="fixed bottom-0 left-0 right-0 w-full flex flex-col">
        {/* <div className="text-xl text-center">Sponsor by</div> */}
        <Image
            src={Logo}
            alt="Neo Haven"
            width={150}
            height={150}
            className="mx-auto my-8"
        />
      </div>
    </div>
  );
};
