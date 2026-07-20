// LAB (tajriba) — Grade2 Dars01 "O'nliklar va birliklar" Manim tushuntirish-klipi.
// Video asset (passiv) — interaktiv darsni EMAS, uning ichiga qo'yiladigan klip.
// Izolyatsiya: etalonga tegmaydi.
import React from "react";
import { Link } from "react-router-dom";
import videoUrl from "./OnlikBirlik.mp4";

export default function ManimPage() {
  return (
    <div style={S.root}>
      <div style={S.top}>
        <Link to="/" style={S.back}>← Bosh sahifa</Link>
        <span style={S.tag}>LAB · Manim klip</span>
      </div>

      <div style={S.card}>
        <span style={S.eyebrow}>Mavzu: O'nliklar va birliklar</span>
        <h1 style={S.title}>Dars01 — Manim tushuntirish-klipi</h1>
        <p style={S.sub}>
          10 birlik = 1 o'nlik · 34 = 30 + 4 · chap raqam o'nliklar, o'ng birliklar · son o'qi
        </p>

        <div style={S.frame}>
          <video
            src={videoUrl}
            style={S.video}
            controls
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        <p style={S.note}>
          Bu — <b>video klip</b> (3Blue1Brown dvijoki Manim bilan). Passiv: bola bosmaydi.
          Interaktiv darsni almashtirmaydi — uning ichiga (hook yoki qoida momentiga)
          qo'yiladigan qisqa tushuntirish sifatida mo'ljallangan.
        </p>
      </div>
    </div>
  );
}

const S = {
  root: { maxWidth: 900, margin: "0 auto", minHeight: "100vh", padding: 16,
    fontFamily: "Manrope, system-ui, sans-serif", background: "#F6F4EF" },
  top: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  back: { textDecoration: "none", color: "#0E0E10", fontWeight: 800, fontSize: 14,
    background: "#fff", padding: "8px 14px", borderRadius: 10, boxShadow: "inset 0 0 0 2px rgba(167,166,162,.35)" },
  tag: { background: "#10142a", color: "#fff", fontSize: 12, fontWeight: 800, padding: "5px 12px", borderRadius: 999 },
  card: { background: "#fff", borderRadius: 22, padding: 18, boxShadow: "0 20px 60px -26px rgba(20,20,30,.35)" },
  eyebrow: { display: "inline-block", background: "#FFE8E1", color: "#fe5b1a",
    fontWeight: 800, fontSize: 12, padding: "4px 12px", borderRadius: 999 },
  title: { fontSize: "clamp(18px,2.6vw,24px)", fontWeight: 800, margin: "10px 2px 4px" },
  sub: { color: "#5A5A60", fontWeight: 600, margin: "0 2px 12px", fontSize: 14 },
  frame: { borderRadius: 18, overflow: "hidden", background: "#0a0e1a", lineHeight: 0 },
  video: { width: "100%", display: "block", background: "#0a0e1a" },
  note: { marginTop: 14, fontSize: 14, color: "#5A5A60", fontWeight: 600, lineHeight: 1.45 },
};
