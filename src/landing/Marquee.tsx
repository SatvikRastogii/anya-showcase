import { languages } from "../data/voices";

export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="marq__row" aria-hidden={hidden || undefined}>
      {languages.map((l) => <li key={l}>{l}</li>)}
    </ul>
  );
  return (
    <section className="marq" aria-label="Languages">
      <p className="wrap marq__lede">Eleven Indian languages. She switches the moment your caller does.</p>
      <div className="marq__track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
