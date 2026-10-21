import { useEffect } from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import Marquee from "./Marquee";
import Build from "./Build";
import Team from "./Team";
import Phrases from "./Phrases";
import Benefits from "./Benefits";
import Pricing from "./Pricing";
import Faq from "./Faq";
import Closing from "./Closing";
import { useLenis } from "../lib/useLenis";
import { stop } from "../lib/audio";
import "./landing.css";

export default function Landing() {
  useLenis();
  useEffect(() => stop, []); // leaving the page stops any clip
  return (
    <div id="top">
      <a className="skip" href="#build">Skip to how it works</a>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Build />
        <Team />
        <Phrases />
        <Benefits />
        <Pricing />
        <Faq />
      </main>
      <Closing />
    </div>
  );
}
