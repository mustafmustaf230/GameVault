import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function SignInPage() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signIn(email, password);
    if (error) setError(error);
    else navigate("/");
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 animate-fade-in">
      <div className="card p-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">{t("auth.signinTitle")}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t("auth.signinSubtitle")}</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t("auth.email")}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t("auth.password")}</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" />
          </div>
          {error && <p className="text-sm text-error-500">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "..." : t("auth.signInBtn")}</button>
        </form>
        <p className="mt-4 text-center text-sm text-neutral-500">{t("auth.noAccount")} <Link to="/signup" className="font-semibold text-primary-600 hover:underline">{t("auth.signUpBtn")}</Link></p>
      </div>
    </div>
  );
}
