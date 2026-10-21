const qs = [
  { q: "How long does it really take to set up?", a: "Describing the job, picking a voice and taking a test call takes about two minutes. Connecting your website form or Meta lead ads takes a few more." },
  { q: "Do I need a developer?", a: "No. You describe the job in plain words, and leads arrive from your website form, a Meta ad, or a CSV you upload." },
  { q: "Which number does she call from?", a: "An Indian number we provide on Growth and above. On Enterprise we can use your own numbers." },
  { q: "What if the caller wants a real person?", a: "She says she'll connect them, then transfers the call to your team or books a callback at the time they ask for." },
  { q: "What counts as a minute?", a: "Only connected talk time. Unanswered calls cost nothing, and voicemail is detected and hung up on before she speaks." },
  { q: "Is calling leads like this allowed in India?", a: "She only calls people who enquired with you, only between 9 am and 8:30 pm, and never calls numbers on DND or anyone who asked to be removed. We help with DLT registration on Enterprise." },
];

export default function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <h2 id="faq-title" className="section-title">Questions people ask first.</h2>
        <div className="faq__list">
          {qs.map((x) => (
            <details key={x.q}>
              <summary>{x.q}</summary>
              <p>{x.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
