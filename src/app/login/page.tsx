"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Iconify from "@/components/Iconify";

function StudentLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/materi";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, portal: "user" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal. Periksa kembali username/email dan password Anda.");
        setLoading(false);
        return;
      }

      const target = nextPath.startsWith("/") && !nextPath.startsWith("/admin")
        ? nextPath
        : "/materi";
      router.push(target);
      router.refresh();
    } catch {
      setError("Gagal menghubungi server. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-card auth-card--student">
      <div className="auth-portal-badge auth-portal-badge--student">
        <Iconify icon="game-icons:bookshelf" />
        <span>PORTAL PERWIRA SISWA · E-REFERENCES</span>
      </div>

      <div className="auth-card__header">
        <h1 className="auth-card__title">Student Sign In</h1>
        <p className="auth-card__subtitle">
          Masuk dengan akun Perwira Siswa PWO Class of 2026 untuk membaca dan mencari modul
          referensi peperangan laut.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="identifier">USERNAME / EMAIL</label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            required
            placeholder="Contoh: pwo2026 atau nama@email.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">PASSWORD</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? (
          <div className="auth-alert" role="alert">
            {error}
          </div>
        ) : null}

        <button className="auth-submit auth-submit--student" type="submit" disabled={loading}>
          {loading ? "MEMVERIFIKASI..." : "MASUK KE E-REFERENCES ↗"}
        </button>
      </form>

      <div className="auth-note">
        <p>
          Akses khusus Perwira Siswa &amp; Instruktur PWO TNI AL. Hubungi Administrator Kelas jika
          Anda belum memiliki akun.
        </p>
        <Link href="/admin/login" className="auth-switch-link">
          Masuk sebagai Administrator →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="PWO Vademecum, beranda">
          <img className="brand-logo" src="/assets/logo/logo-pwo.png" alt="Logo PWO 2026" />
          <span className="brand-copy">
            <strong>PRINCIPAL WARFARE OFFICER</strong>
            <small>E-REFERENCES · CLASS OF 2026</small>
          </span>
        </Link>
        <nav className="topbar-nav">
          <Link href="/" className="topbar-link">
            BERANDA
          </Link>
          <Link href="/login" className="topbar-link is-active">
            LOGIN
          </Link>
        </nav>
      </header>

      <main className="auth-page auth-page--student">
        <div className="auth-page__bg" aria-hidden="true"></div>
        <div className="auth-page__overlay" aria-hidden="true"></div>
        <Suspense fallback={<div className="auth-card">Memuat form login...</div>}>
          <StudentLoginForm />
        </Suspense>
      </main>

      <footer className="footer">
        <span>E-REFERENCES · PWO CLASS OF 2026</span>
        <span>気迫 · 精撃 · 必勝</span>
      </footer>
    </>
  );
}
