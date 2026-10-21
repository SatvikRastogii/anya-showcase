const items = [
  { title: "Calls every lead within seconds.", body: "Someone fills your form or a Meta ad at 7 pm and gets a call before they've closed the tab. Hot leads stay hot." },
  { title: "Speaks your caller's language.", body: "She starts in your main language and moves to Hindi, Tamil or any of eleven Indian languages the moment they do." },
  { title: "Books it, then reads it back.", body: "Date, time and email are confirmed out loud before anything lands on your calendar. No wrong invites." },
  { title: "Knows when to hand over.", body: "Ask for a person, or sound annoyed, and your team gets the call or a callback at the time they asked for." },
  { title: "Polite by default.", body: "Calls only between 9 am and 8:30 pm. “Remove my number” means never again. DND lists are respected." },
  { title: "Every call, summarised.", body: "Recording, transcript and a two-line summary land in your dashboard, with the next step already set." },
];

export default function Benefits() {
  return (
    <section className="ben" aria-labelledby="ben-title">
      <div className="wrap">
        <h2 id="ben-title" className="section-title">Why teams hire her.</h2>
        <div className="ben__grid">
          {items.map((b) => (
            <article key={b.title}>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
