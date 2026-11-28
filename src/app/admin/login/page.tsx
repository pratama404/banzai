"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Iconify from "@/components/Iconify";

export default function AdminLoginPage() {
  const router = useRouter();
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
        body: JSON.stringify({ identifier, password, portal: "admin" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Autentikasi admin gagal. Periksa kredensial Anda.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Gagal menghubungi server. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="admin-auth-shell">
      <div className="admin-auth-grid-bg" aria-hidden="true"></div>

      <div className="admin-auth-container">
        <div className="admin-auth-brand">
          <img src="/assets/logo/logo-pwo.png" alt="Logo PWO 2026" />
          <div>
            <strong>PWO COMMAND CENTER</strong>
            <span>ADMINISTRATION CONSOLE · CLASS OF 2026</span>
          </div>
        </div>

        <div className="auth-card auth-card--admin">
          <div className="auth-portal-badge auth-portal-badge--admin">
            <Iconify icon="game-icons:radar-dish" />
            <span>RESTRICTED · ADMINISTRATOR ONLY</span>
          </div>

          <div className="auth-card__header">
            <h1 className="auth-card__title">Admin Command Login</h1>
            <p className="auth-card__subtitle">
              Portal khusus Administrator untuk mengelola materi, tautan Google Drive/Slides,
              kategori peperangan, dan akun Perwira Siswa.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="admin-id">ADMIN USERNAME / EMAIL</label>
              <input
                id="admin-id"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                placeholder="Contoh: admin atau admin@pwo.local"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="admin-pass">ADMIN PASSWORD</label>
              <input
                id="admin-pass"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Masukkan password administrator"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error ? (
              <div className="auth-alert" role="alert">
                {error}
              </div>
            ) : null}

            <button className="auth-submit auth-submit--admin" type="submit" disabled={loading}>
              {loading ? "MEMVERIFIKASI OTORITAS..." : "MASUK COMMAND CENTER ↗"}
            </button>
          </form>

          <div className="auth-note auth-note--split">
            <Link href="/login" className="auth-switch-link">
              ← Login Perwira Siswa
            </Link>
            <Link href="/" className="auth-switch-link">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
