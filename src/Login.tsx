import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ThemeToggle } from "./lib/theme";
import "./login.css";

// Demo sign-in only: nothing is sent anywhere, any email and password work.
const KEY = "anya_demo_auth";
export const isAuthed = () => {
  try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; }
};
const signIn = () => {
  try { sessionStorage.setItem(KEY, "1"); } catch { /* private mode: still let them in for this page view */ }
};
export const signOut = () => {
  try { sessionStorage.removeItem(KEY); } catch { /* nothing stored */ }
};

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  if (!isAuthed()) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname)}`} replace />;
  return <>{children}</>;
}

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@texnoid.in");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const next = params.get("next")?.startsWith("/app") ? params.get("next")! : "/app/calls";

  const enter = () => {
    signIn();
    navigate(next, { replace: true });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter an email address like name@company.in.");
      return;
    }
    if (!password) {
      setError("Enter any password. This is a demo, so it isn't checked.");
      return;
    }
    enter();
  };

  return (
    <div className="login">
      <header className="login__top wrap">
        <Link to="/" className="nav__mark">
          <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true"><path d="M3 16h5l3-8 4 16 4-12 3 4h7" fill="none" stroke="var(--signal)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Anya <span className="dim">by Texnoid</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="login__main">
        <form className="login__card" onSubmit={submit} noValidate>
          <h1>Log in to your team</h1>
          <p className="dim">This is a demo workspace. Any email and password will work.</p>

          <label className="login__field">
            <span>Work email</span>
            <input type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error && !/^\S+@\S+\.\S+$/.test(email)} />
          </label>
          <label className="login__field">
            <span>Password</span>
            <input type="password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Anything works here" />
          </label>
          {error && <p className="login__err" role="alert">{error}</p>}

          <button className="btn btn--signal login__btn" type="submit">Log in</button>
          <div className="login__or"><span>or</span></div>
          <button className="btn login__btn" type="button" onClick={enter}>Continue with the demo account</button>
          <p className="mono dim login__note">New here? <Link to="/#pricing">Start a free trial</Link></p>
        </form>
      </main>
    </div>
  );
}
