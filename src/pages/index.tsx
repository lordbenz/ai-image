import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Sponsor } from "@/components/Sponsor";
import { HeadSection } from "@/components/HeadSection";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <div className="home-container text-white fixed bottom-0">
        <HeadSection />
        <Sponsor />
      </div>
    </>
  );
}
