// 16 ekran — Dars01 3D-prototip. Har ekran o'z 3D sahnasi + interaktivi.
// Etalon Dars01.jsx ga tegmaydi (izolyatsiya).
import React, { useRef, useEffect, useState } from "react";
import { CONTENT, BRIDGES } from "./content.js";
import { Frame, Options, Feedback, PrimaryBtn, useLang, useT, useNarration } from "./app.jsx";
import {
  THREE, createStage, addStars, addDust, addPlanet, makeBit, animateBit,
  makeBattery, makeCassette, makePlaceTray, makeLabel, setLabel,
  floaty, driftFloaty, ACCENT, BLUE, EYE, smooth, lerp,
} from "./kit.js";

// ---- stage hook ------------------------------------------------------------
function useStage(opts, build) {
  const canvasRef = useRef();
  const apiRef = useRef(null);
  useEffect(() => {
    const stage = createStage(canvasRef.current, opts);
    apiRef.current = build(stage) || {};
    stage.start();
    return () => stage.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { canvasRef, apiRef };
}
const Canvas = ({ canvasRef }) => <canvas ref={canvasRef} className="l3-canvas" />;

// ---- umumiy sahna qismlari -------------------------------------------------
function backdrop(stage, planet = true) {
  addStars(stage.scene, 1200);
  addDust(stage.scene, 90);
  if (planet) addPlanet(stage.scene, [-7.6, 3.2, -17], 0.85);
}
function addBit(stage, pos = [4.2, 0.2, 0.6], scale = 0.82) {
  const bit = makeBit(); bit.position.set(...pos); bit.scale.setScalar(scale); bit.userData.baseY = pos[1];
  stage.scene.add(bit); return bit;
}
// N kasseta (o'nlik) + M batareya (birlik) joylashuvi
function placeCargo(parent, tens, ones, { tx = -2.7, ox = 1.6 } = {}) {
  const g = new THREE.Group();
  for (let i = 0; i < tens; i++) {
    const cs = makeCassette(10);
    const c = i % 2, r = Math.floor(i / 2);
    cs.position.set(tx + c * 1.75, 1.0 - r * 1.12, (Math.random() - 0.5) * 0.3);
    cs.userData.rot = (Math.random() - 0.5) * 0.15; cs.userData.ph = Math.random() * 6.28;
    g.add(cs);
  }
  for (let i = 0; i < ones; i++) {
    const b = makeBattery(); b.scale.setScalar(0.82);
    const c = i % 3, r = Math.floor(i / 3);
    b.position.set(ox + c * 0.72, 1.25 - r * 1.15, (Math.random() - 0.5) * 0.3);
    b.rotation.z = 0.25 + (Math.random() - 0.5) * 0.3;
    b.userData.rot = (Math.random() - 0.5) * 0.2; b.userData.ph = Math.random() * 6.28;
    g.add(b);
  }
  parent.add(g);
  return g;
}
function animateCargo(g, el) {
  g.children.forEach((o) => {
    if (o.userData.rot === undefined) return;
    o.rotation.y += o.userData.rot * 0.01;
    o.position.y += Math.sin(el * 0.7 + o.userData.ph) * 0.0016;
  });
}

// ---- generic MC-cargo ekran ------------------------------------------------
function MCCargo({ sid, tens, ones, options, correct, explains, scored = true, fact }) {
  const c = CONTENT[sid];
  const lang = useLang(); const t = useT();
  const nar = useNarration(c.audio.intro[lang], lang);
  const [picked, setPicked] = useState(null);
  const [showFact, setShowFact] = useState(false);
  const { canvasRef } = useStage(
    { camPos: [0, 0.8, 12], camTarget: [0, 0.3, 0] },
    (stage) => {
      backdrop(stage);
      const cargo = placeCargo(stage.scene, tens, ones);
      const bit = addBit(stage);
      let cheer = 0;
      stage.onFrame((dt, el) => { animateCargo(cargo, el); animateBit(bit, el, cheer); });
      return { setCheer: (v) => { cheer = v; } };
    }
  );
  const onPick = (i) => {
    if (picked != null) return;
    setPicked(i);
    const ok = i === correct;
    window.speechSynthesis?.cancel();
    const msg = ok ? c.audio.on_correct : (explains?.[i] || c.audio.on_wrong);
    const u = window.SpeechSynthesisUtterance && new SpeechSynthesisUtterance(t(msg));
    if (u && !nar.muted) { u.lang = lang === "ru" ? "ru-RU" : "uz-UZ"; u.rate = 0.98; window.speechSynthesis.speak(u); }
    if (ok && fact) setTimeout(() => setShowFact(true), 500);
  };
  const ok = picked === correct;
  return (
    <Frame eyebrow={t(c.eyebrow)} title={t(c.q)} nar={nar}
      footer={
        <>
          <Options opts={options.map((o) => o.label)} picked={picked} correct={correct} onPick={onPick} cols={options.length > 2 ? 2 : 2} />
          <Feedback show={picked != null} ok={ok}>
            {ok ? t(c.audio.on_correct) : t(explains?.[picked] || c.audio.on_wrong)}
          </Feedback>
          {showFact && fact && (
            <div className="l3-fact">
              <span className="l3-fact-badge">{t(fact.badge)}</span>
              <p>{t(fact.text)}</p>
            </div>
          )}
        </>
      }
    >
      <Canvas canvasRef={canvasRef} />
    </Frame>
  );
}

// =========================================================================
// s0 — HOOK
// =========================================================================
function S0() {
  const c = CONTENT.s0; const lang = useLang(); const t = useT();
  const nar = useNarration(c.audio.intro[lang], lang);
  const [picked, setPicked] = useState(null);
  const { canvasRef } = useStage(
    { orbit: true, autoRotate: true, camPos: [0, 1.2, 12.5] },
    (stage) => {
      backdrop(stage);
      addPlanet(stage.scene, [-6.8, 2.6, -15], 1);
      const bit = addBit(stage, [3.8, 0.3, 0.5], 0.9);
      const batts = [];
      for (let i = 0; i < 10; i++) {
        const b = makeBattery();
        b.position.set((Math.random() - 0.5) * 7 - 0.6, (Math.random() - 0.5) * 4.2, (Math.random() - 0.5) * 3);
        b.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        floaty(b); stage.scene.add(b); batts.push(b);
      }
      stage.onFrame((dt, el) => { batts.forEach((b) => driftFloaty(b, el, dt, 0.3)); animateBit(bit, el, 0); });
      return {};
    }
  );
  const opts = [c.opt0, c.opt1, c.opt2];
  const onPick = (i) => {
    if (picked != null) return; setPicked(i);
    window.speechSynthesis?.cancel();
    const msg = i === 1 ? c.audio.on_correct : i === 0 ? c.audio.on_wrong : c.audio.on_unknown;
    const u = new SpeechSynthesisUtterance(t(msg)); u.lang = lang === "ru" ? "ru-RU" : "uz-UZ"; if (!nar.muted) window.speechSynthesis.speak(u);
  };
  return (
    <Frame eyebrow={t(c.topic)} title={t(c.lead)} sub={t(c.q)} nar={nar}
      footer={
        <>
          <Options opts={opts.map(t)} picked={picked} correct={1} onPick={onPick} cols={3} />
          <Feedback show={picked != null} ok={picked === 1}>
            {t(picked === 1 ? c.audio.on_correct : picked === 0 ? c.audio.on_wrong : c.audio.on_unknown)}
          </Feedback>
        </>
      }
    >
      <Canvas canvasRef={canvasRef} />
    </Frame>
  );
}

// =========================================================================
// s1 — RECALL: 10 birlik -> 1 o'nlik
// =========================================================================
function S1() {
  const c = CONTENT.s1; const lang = useLang(); const t = useT();
  const nar = useNarration(c.audio.intro, lang);
  const [picked, setPicked] = useState(null);
  const { canvasRef } = useStage(
    { camPos: [0, 0.6, 11], camTarget: [0, 0.2, 0] },
    (stage) => {
      backdrop(stage);
      const bit = addBit(stage, [4.3, 0.2, 0.4], 0.78);
      // 10 kichik birlik-kub -> 1 o'nlik blok (aylanma tsikl)
      const cubes = [];
      const box = new THREE.Group(); stage.scene.add(box);
      for (let i = 0; i < 10; i++) {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), new THREE.MeshStandardMaterial({ color: 0xe4e8ef, roughness: 0.3, metalness: 0.6, emissive: BLUE, emissiveIntensity: 0.15 }));
        box.add(cube); cubes.push(cube);
      }
      const bar = makeCassette(10); bar.position.set(0, 0, 0); bar.visible = false; stage.scene.add(bar);
      let phase = 0;
      stage.onFrame((dt, el) => {
        phase = (Math.sin(el * 0.5) + 1) / 2; // 0..1..0
        cubes.forEach((cube, i) => {
          const spread = new THREE.Vector3(-2.2 + (i % 5) * 1.1, 1.1 - Math.floor(i / 5) * 1.0, 0);
          const gathered = new THREE.Vector3(-0.56 + (i % 5) * 0.28, 0.23 - Math.floor(i / 5) * 0.46, 0);
          cube.position.lerpVectors(spread, gathered, smooth(phase, 0.4, 1));
          cube.scale.setScalar(1 - smooth(phase, 0.5, 1) * 0.75);
          cube.rotation.y += dt * 0.5;
          cube.visible = phase < 0.97;
        });
        bar.visible = phase > 0.9; bar.scale.setScalar(0.001 + smooth(phase, 0.85, 1));
        animateBit(bit, el, phase > 0.9 ? 1 : 0);
      });
      return {};
    }
  );
  const opts = [c.opt0, c.opt1, c.opt2];
  const onPick = (i) => {
    if (picked != null) return; setPicked(i);
    window.speechSynthesis?.cancel();
    const msg = i === 0 ? c.audio.on_correct : c.audio.on_wrong;
    const u = new SpeechSynthesisUtterance(t(msg)); u.lang = lang === "ru" ? "ru-RU" : "uz-UZ"; if (!nar.muted) window.speechSynthesis.speak(u);
  };
  const expl = [null, c.wrong_1, c.wrong_2];
  return (
    <Frame eyebrow={t(c.eyebrow)} title={t(c.q)} nar={nar}
      footer={
        <>
          <Options opts={opts.map(t)} picked={picked} correct={0} onPick={onPick} cols={3} />
          <Feedback show={picked != null} ok={picked === 0}>{t(picked === 0 ? c.audio.on_correct : expl[picked])}</Feedback>
        </>
      }
    ><Canvas canvasRef={canvasRef} /></Frame>
  );
}

// =========================================================================
// s2 — UNITIZING: 10 batareyani bosib kassetaga
// =========================================================================
function S2({ onNext }) {
  const c = CONTENT.s2; const lang = useLang(); const t = useT();
  const nar = useNarration(c.audio[lang], lang);
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const { canvasRef } = useStage(
    { camPos: [0, 0.6, 11.5], camTarget: [0, 0.2, 0] },
    (stage) => {
      backdrop(stage);
      const bit = addBit(stage, [4.3, 0.2, 0.4], 0.75);
      const cass = makeCassette(0); cass.position.set(0, -0.2, 0); stage.scene.add(cass);
      const leds = cass.userData.leds;
      const slots = [];
      for (let r = 0; r < 2; r++) for (let cc = 0; cc < 5; cc++) slots.push(new THREE.Vector3(-0.56 + cc * 0.28, 0.03 - r * 0.46, 0.3));
      const batts = [];
      for (let i = 0; i < 10; i++) {
        const b = makeBattery(); b.scale.setScalar(0.62);
        b.position.set((Math.random() < 0.5 ? -1 : 1) * (2.4 + Math.random() * 1.2), (Math.random() - 0.5) * 3.4, (Math.random() - 0.5) * 1.5);
        b.rotation.set(Math.random() * 3, 0, Math.random() * 3);
        floaty(b); b.userData.pickId = i; b.userData.done = false;
        stage.scene.add(b); batts.push(b);
      }
      stage.onClick(() => batts.filter((b) => !b.userData.done), (obj) => {
        const b = obj; if (b.userData.done) return;
        const n = countRef.current;
        if (n >= 10) return;
        b.userData.done = true; b.userData.slot = slots[n];
        b.userData.f = null;
        countRef.current = n + 1; setCount(n + 1);
      });
      stage.onFrame((dt, el) => {
        batts.forEach((b) => {
          if (b.userData.done) {
            b.position.lerp(b.userData.slot, 0.15);
            b.rotation.x = lerp(b.rotation.x, 0, 0.15); b.rotation.z = lerp(b.rotation.z, 0, 0.15);
            b.scale.setScalar(lerp(b.scale.x, 0.42, 0.1));
          } else driftFloaty(b, el, dt, 0.2);
        });
        leds.forEach((led, i) => { const on = i < countRef.current; led.material.emissive?.setHex?.(on ? ACCENT : 0x3a2016); if (on) led.material.emissiveIntensity = 1.4 + Math.sin(el * 5 + i) * 0.3; });
        animateBit(bit, el, countRef.current >= 10 ? 1 : 0);
      });
      return {};
    }
  );
  const done = count >= 10;
  return (
    <Frame eyebrow={t(c.eyebrow)} title={t(c.lead)} nar={nar}
      footer={
        <>
          <div className="l3-counter">{done ? "✓ 10 / 10" : `${count} / 10`}</div>
          <Feedback show={done} ok>{t(c.done_text)}</Feedback>
        </>
      }
    ><Canvas canvasRef={canvasRef} /></Frame>
  );
}

// =========================================================================
// build-tray shablon (s3, s8)
// =========================================================================
function BuildTray({ sid, target, withCheck }) {
  const c = CONTENT[sid]; const lang = useLang(); const t = useT();
  const nar = useNarration(withCheck ? c.audio.intro : c.audio[lang], lang);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [checked, setChecked] = useState(null); // null|true|false
  const apiRef = useRef({ tens: 0, ones: 0 });
  const numRef = useRef(null);
  const stageApi = useStage(
    { camPos: [0, 0.7, 12], camTarget: [0, 0.1, 0] },
    (stage) => {
      backdrop(stage, false);
      addPlanet(stage.scene, [7.5, 3.2, -17], 0.8);
      const tray = makePlaceTray(6.4, 3.2); tray.position.set(0, 0.2, 0); stage.scene.add(tray);
      const tHold = new THREE.Group(); tHold.position.set(-1.6, 0.4, 0.4); tray.add(tHold);
      const oHold = new THREE.Group(); oHold.position.set(1.6, 0.4, 0.4); tray.add(oHold);
      const num = makeLabel("0", { font: 150, color: "#ffffff", glowColor: "#8fb4ff", scale: 1.4 });
      num.position.set(0, 3.0, 0.4); stage.scene.add(num); numRef.current = num;
      const tLbl = makeLabel(t(c.tens_label).toUpperCase(), { font: 44, color: "#ffbfa6", scale: 0.42 }); tLbl.position.set(-1.6, -1.35, 0.4); tray.add(tLbl);
      const oLbl = makeLabel(t(c.ones_label).toUpperCase(), { font: 44, color: "#aecbff", scale: 0.42 }); oLbl.position.set(1.6, -1.35, 0.4); tray.add(oLbl);
      const rebuild = () => {
        [tHold, oHold].forEach((h) => { while (h.children.length) h.remove(h.children[0]); });
        const T = apiRef.current.tens, O = apiRef.current.ones;
        for (let i = 0; i < T; i++) { const cs = makeCassette(10); cs.scale.setScalar(0.62); cs.position.set(-0.5 + (i % 2) * 1.0, 0.5 - Math.floor(i / 2) * 0.7, 0); cs.userData.pop = 0; tHold.add(cs); }
        for (let i = 0; i < O; i++) { const b = makeBattery(); b.scale.setScalar(0.5); b.position.set(-0.5 + (i % 3) * 0.5, 0.6 - Math.floor(i / 3) * 0.7, 0); b.userData.pop = 0; oHold.add(b); }
        setLabel(num, String(T * 10 + O), { font: 150, color: checkedColor(), glowColor: "#8fb4ff", scale: 1.4 });
      };
      apiRef.current.rebuild = rebuild;
      let checkedColorVal = "#ffffff";
      function checkedColor() { return checkedColorVal; }
      apiRef.current.setColor = (col) => { checkedColorVal = col; rebuild(); };
      stage.onFrame((dt, el) => {
        [tHold, oHold].forEach((h) => h.children.forEach((o) => { o.userData.pop = Math.min(1, (o.userData.pop || 0) + dt * 4); const s = (o.parent === tHold ? 0.62 : 0.5) * smooth(o.userData.pop, 0, 1); o.scale.setScalar(s); o.rotation.y += dt * 0.3; }));
      });
      return apiRef.current;
    }
  );
  const bump = (dt, dO) => {
    if (checked === true) return;
    const nt = Math.max(0, Math.min(9, tens + dt)), no = Math.max(0, Math.min(9, ones + dO));
    setTens(nt); setOnes(no); apiRef.current.tens = nt; apiRef.current.ones = no; apiRef.current.rebuild?.();
    if (checked === false) setChecked(null);
  };
  const total = tens * 10 + ones;
  const doneExpl = !withCheck && total === target;
  const check = () => {
    const ok = total === target; setChecked(ok);
    window.speechSynthesis?.cancel();
    const u = new SpeechSynthesisUtterance(t(ok ? c.audio.on_correct : c.audio.on_wrong)); u.lang = lang === "ru" ? "ru-RU" : "uz-UZ"; if (!nar.muted) window.speechSynthesis.speak(u);
    apiRef.current.setColor?.(ok ? "#7CF2B0" : "#ffffff");
  };
  return (
    <Frame eyebrow={t(c.eyebrow)} title={t(withCheck ? c.q : c.lead)} nar={nar}
      footer={
        <>
          <div className="l3-build-ctrls">
            <div className="l3-bctrl">
              <span className="tens">{t(c.src_tens)}</span>
              <div className="l3-bbtns"><button onClick={() => bump(-1, 0)}>−</button><b>{tens}</b><button onClick={() => bump(1, 0)}>+</button></div>
            </div>
            <div className="l3-bctrl">
              <span className="ones">{t(c.src_ones)}</span>
              <div className="l3-bbtns"><button onClick={() => bump(0, -1)}>−</button><b>{ones}</b><button onClick={() => bump(0, 1)}>+</button></div>
            </div>
          </div>
          {withCheck
            ? <><PrimaryBtn onClick={check} disabled={checked === true}>{t(c.check_label)}</PrimaryBtn>
                <Feedback show={checked != null} ok={checked}>{t(checked ? c.audio.on_correct : c.audio.on_wrong)}</Feedback></>
            : <Feedback show={doneExpl} ok>{t(c.done_text)}</Feedback>}
        </>
      }
    ><Canvas canvasRef={stageApi.canvasRef} /></Frame>
  );
}

// =========================================================================
// s4 — RAZRYAD KARTASI 34 = 30 + 4 (qadamli)
// =========================================================================
function S4() {
  const c = CONTENT.s4; const lang = useLang(); const t = useT();
  const nar = useNarration(c.audio[lang], lang);
  const [step, setStep] = useState(0); // 0 empty,1 tens,2 ones,3 sum
  const apiRef = useRef({});
  const { canvasRef } = useStage(
    { camPos: [0, 0.7, 12], camTarget: [0, 0.1, 0] },
    (stage) => {
      backdrop(stage, false); addPlanet(stage.scene, [7.6, 3, -17], 0.8);
      const tray = makePlaceTray(6.4, 3.2); tray.position.set(0, 0.2, 0); stage.scene.add(tray);
      const tHold = new THREE.Group(); tHold.position.set(-1.6, 0.4, 0.4); tray.add(tHold);
      const oHold = new THREE.Group(); oHold.position.set(1.6, 0.4, 0.4); tray.add(oHold);
      const tLbl = makeLabel(t(c.tens_label).toUpperCase(), { font: 44, color: "#ffbfa6", scale: 0.42 }); tLbl.position.set(-1.6, -1.35, 0.4); tray.add(tLbl);
      const oLbl = makeLabel(t(c.ones_label).toUpperCase(), { font: 44, color: "#aecbff", scale: 0.42 }); oLbl.position.set(1.6, -1.35, 0.4); tray.add(oLbl);
      const num = makeLabel("34", { font: 150, color: "#ffffff", glowColor: "#8fb4ff", scale: 1.35 }); num.position.set(0, 3.0, 0.4); num.visible = false; stage.scene.add(num);
      apiRef.current = {
        apply(st) {
          [tHold, oHold].forEach((h) => { while (h.children.length) h.remove(h.children[0]); });
          if (st >= 1) for (let i = 0; i < 3; i++) { const cs = makeCassette(10); cs.scale.setScalar(0.6); cs.position.set(0, 0.6 - i * 0.7, 0); tHold.add(cs); }
          if (st >= 2) for (let i = 0; i < 4; i++) { const b = makeBattery(); b.scale.setScalar(0.5); b.position.set(-0.5 + (i % 2) * 0.5, 0.6 - Math.floor(i / 2) * 0.7, 0); oHold.add(b); }
          num.visible = st >= 3;
        }
      };
      stage.onFrame((dt) => { [tHold, oHold].forEach((h) => h.children.forEach((o) => { o.userData.p = Math.min(1, (o.userData.p || 0) + dt * 4); o.scale.setScalar((o.parent === tHold ? 0.6 : 0.5) * smooth(o.userData.p, 0, 1)); o.rotation.y += dt * 0.25; })); });
      apiRef.current.apply(0);
      return apiRef.current;
    }
  );
  const adv = () => { const ns = Math.min(3, step + 1); setStep(ns); apiRef.current.apply(ns); };
  const steps = ["", t(c.tens_label), t(c.ones_label), "34 = 30 + 4"];
  return (
    <Frame eyebrow={t(c.eyebrow)} title={t(c.lead)} nar={nar}
      footer={
        <>
          <div className="l3-anchor">{step >= 1 ? <span><b style={{ color: "#fe5b1a" }}>3</b> {t(c.tens_label)}{step >= 2 ? <> · <b style={{ color: "#4a86ff" }}>4</b> {t(c.ones_label)}</> : null}{step >= 3 ? <>  →  <b>34 = 30 + 4</b></> : null}</span> : <span className="dim">…</span>}</div>
          {step < 3 ? <PrimaryBtn onClick={adv}>{lang === "ru" ? "Дальше шаг →" : "Keyingi qadam →"}</PrimaryBtn> : <Feedback show ok>{lang === "ru" ? "Слева десятки, справа единицы." : "Chapda o'nliklar, o'ngda birliklar."}</Feedback>}
        </>
      }
    ><Canvas canvasRef={canvasRef} /></Frame>
  );
}

// =========================================================================
// s5 — KOD: 45 va 54 (raqamni to'g'ri o'ringa)
// =========================================================================
function S5() {
  const c = CONTENT.s5; const lang = useLang(); const t = useT();
  const nar = useNarration(c.audio[lang], lang);
  const [round, setRound] = useState(0); // 0 -> 45, 1 -> 54, 2 done
  const [slotT, setSlotT] = useState(null); const [slotO, setSlotO] = useState(null);
  const [msg, setMsg] = useState(null);
  const apiRef = useRef({});
  const { canvasRef } = useStage(
    { camPos: [0, 0.6, 12], camTarget: [0, 0.2, 0] },
    (stage) => {
      backdrop(stage, false); addPlanet(stage.scene, [-7.5, 3, -17], 0.8);
      const bit = addBit(stage, [4.4, 0.1, 0.3], 0.72);
      // lyuk eshigi
      const door = new THREE.Group(); stage.scene.add(door);
      const frame = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.16, 12, 40), new THREE.MeshStandardMaterial({ color: 0x2a3550, roughness: 0.4, metalness: 0.6, emissive: 0x14203a, emissiveIntensity: 0.5 }));
      frame.position.set(-0.6, 0.3, 0); door.add(frame);
      const leaf = new THREE.Mesh(new THREE.CircleGeometry(2.0, 40), new THREE.MeshStandardMaterial({ color: 0x101828, roughness: 0.5, metalness: 0.5, side: THREE.DoubleSide }));
      leaf.position.set(-0.6, 0.3, -0.05); door.add(leaf);
      apiRef.current = {
        open: false,
        setOpen(v) { this.open = v; },
        leaf, frame,
      };
      stage.onFrame((dt, el) => {
        animateBit(bit, el, apiRef.current.open ? 1 : 0);
        const target = apiRef.current.open ? -3.6 : -0.6;
        leaf.position.x = lerp(leaf.position.x, target, 0.08);
        leaf.material.opacity = 1;
        frame.material.emissiveIntensity = apiRef.current.open ? 1.4 + Math.sin(el * 4) * 0.4 : 0.5;
      });
      return apiRef.current;
    }
  );
  const target = round === 0 ? { tens: "4", ones: "5" } : { tens: "5", ones: "4" };
  const place = (slot, digit) => {
    if (round >= 2) return;
    if (slot === "t") setSlotT(digit); else setSlotO(digit);
    const nt = slot === "t" ? digit : slotT, no = slot === "o" ? digit : slotO;
    if (nt && no) {
      if (nt === target.tens && no === target.ones) {
        setMsg({ ok: true }); apiRef.current.setOpen(true);
        speak(t(round === 0 ? { ru: c.audio.ru[1], uz: c.audio.uz[1] } : c.audio) , lang, nar.muted, round === 0 ? (lang === "ru" ? c.audio.ru[1] : c.audio.uz[1]) : (lang === "ru" ? c.audio.ru[2] : c.audio.uz[2]));
        setTimeout(() => {
          if (round === 0) { setRound(1); setSlotT(null); setSlotO(null); setMsg(null); apiRef.current.setOpen(false); }
          else setRound(2);
        }, 1600);
      } else { setMsg({ ok: false }); }
    }
  };
  const reset = () => { setSlotT(null); setSlotO(null); setMsg(null); };
  return (
    <Frame eyebrow={t(c.eyebrow)} title={t(c.lead)} nar={nar}
      footer={
        <>
          <div className="l3-code">
            <div className="l3-code-row">
              <div className={`l3-slot tens ${slotT ? "on" : ""}`} onClick={() => slotT && place("t", null)}>{slotT || "?"}</div>
              <div className={`l3-slot ones ${slotO ? "on" : ""}`} onClick={() => slotO && place("o", null)}>{slotO || "?"}</div>
            </div>
            <div className="l3-code-labels"><span className="tens">{t(c.tens_label)}</span><span className="ones">{t(c.ones_label)}</span></div>
            <div className="l3-code-hint">{t(round === 0 ? c.round1 : c.round2)}</div>
            <div className="l3-digits">
              {["4", "5"].map((d) => (
                <React.Fragment key={d}>
                  <button className="l3-digit" onClick={() => place("t", d)}>{d} → {t(c.tens_label)}</button>
                  <button className="l3-digit ones" onClick={() => place("o", d)}>{d} → {t(c.ones_label)}</button>
                </React.Fragment>
              ))}
            </div>
          </div>
          {msg && !msg.ok && <Feedback show ok={false}>{t(c.wrong)} <button className="l3-mini" onClick={reset}>↺</button></Feedback>}
          {round === 2 && <Feedback show ok>{t(c.done_text)}</Feedback>}
        </>
      }
    ><Canvas canvasRef={canvasRef} /></Frame>
  );
}
function speak(_a, lang, muted, text) { if (muted || !window.SpeechSynthesisUtterance) return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = lang === "ru" ? "ru-RU" : "uz-UZ"; u.rate = 0.98; window.speechSynthesis.speak(u); }

// =========================================================================
// s6 — SON O'QI: 34 (3 katta sakrash + 4 kichik qadam)
// =========================================================================
function S6() {
  const c = CONTENT.s6; const lang = useLang(); const t = useT();
  const nar = useNarration(c.audio[lang], lang);
  const [step, setStep] = useState(0); // 0..7 (3 big +4 small)
  const apiRef = useRef({});
  const { canvasRef } = useStage(
    { camPos: [0, 1.4, 12], camTarget: [0, 0.4, 0] },
    (stage) => {
      backdrop(stage, false);
      const X0 = -5.2, X1 = 5.2, span = X1 - X0, max = 40;
      const line = new THREE.Mesh(new THREE.BoxGeometry(span, 0.08, 0.08), new THREE.MeshStandardMaterial({ color: 0x9fb3cf, emissive: 0x334, emissiveIntensity: 0.4 }));
      line.position.set(0, 0, 0); stage.scene.add(line);
      const px = (v) => X0 + (v / max) * span;
      [0, 10, 20, 30, 40].forEach((v) => {
        const tick = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.06), new THREE.MeshStandardMaterial({ color: 0xcfe0ff })); tick.position.set(px(v), 0, 0); stage.scene.add(tick);
        const lb = makeLabel(String(v), { font: 54, color: "#cfe0ff", scale: 0.5 }); lb.position.set(px(v), -0.7, 0); stage.scene.add(lb);
      });
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 1.8 }));
      marker.position.set(px(0), 0.45, 0); stage.scene.add(marker);
      const val34 = makeLabel("34", { font: 90, color: "#ffd9c8", glowColor: "#fe5b1a", scale: 0.8 }); val34.position.set(px(34), 1.5, 0); val34.visible = false; stage.scene.add(val34);
      apiRef.current = { px, marker, val34, target: 0, cur: 0 };
      stage.onFrame((dt, el) => {
        const a = apiRef.current;
        a.cur = lerp(a.cur, a.target, 0.12);
        a.marker.position.x = px(a.cur);
        const isBig = a.target <= 30;
        a.marker.position.y = 0.45 + Math.abs(Math.sin((a.cur / a.target || 0) * Math.PI)) * (isBig ? 0.9 : 0.3) * (Math.abs(a.cur - a.target) > 0.5 ? 1 : 0);
        a.marker.material.emissiveIntensity = 1.6 + Math.sin(el * 5) * 0.4;
        a.val34.visible = a.target >= 34 && Math.abs(a.cur - 34) < 0.6;
      });
      return apiRef.current;
    }
  );
  const adv = () => {
    const ns = Math.min(7, step + 1); setStep(ns);
    apiRef.current.target = ns <= 3 ? ns * 10 : 30 + (ns - 3);
  };
  const label = step === 0 ? "0" : step <= 3 ? `${step * 10}` : `${30 + (step - 3)}`;
  return (
    <Frame eyebrow={t(c.eyebrow)} title={t(c.lead)} nar={nar}
      footer={
        <>
          <div className="l3-anchor"><span>{step <= 3 ? (lang === "ru" ? "Большой прыжок (десяток)" : "Katta sakrash (o'nlik)") : (lang === "ru" ? "Маленький шаг (единица)" : "Kichik qadam (birlik)")}: <b>{label}</b></span></div>
          {step < 7 ? <PrimaryBtn onClick={adv}>{step < 3 ? (lang === "ru" ? "Прыжок +10 →" : "Sakrash +10 →") : (lang === "ru" ? "Шаг +1 →" : "Qadam +1 →")}</PrimaryBtn> : <Feedback show ok>{t(c.done_text)}</Feedback>}
        </>
      }
    ><Canvas canvasRef={canvasRef} /></Frame>
  );
}

// =========================================================================
// s7 — QOIDA (45; o'nlik raqamini bosish)
// =========================================================================
function S7() {
  const c = CONTENT.s7; const lang = useLang(); const t = useT();
  const nar = useNarration(c.audio[lang], lang);
  const [checked, setChecked] = useState(null);
  const { canvasRef } = useStage(
    { camPos: [0, 0.4, 11], camTarget: [0, 0.3, 0] },
    (stage) => {
      backdrop(stage, false); addPlanet(stage.scene, [7.6, 3, -18], 0.7);
      const bit = addBit(stage, [4.4, 0.1, 0.3], 0.7);
      // 4 kasseta (o'nlik) chapda, 5 batareya (birlik) o'ngda + katta 45
      const g = new THREE.Group(); stage.scene.add(g);
      for (let i = 0; i < 4; i++) { const cs = makeCassette(10); cs.scale.setScalar(0.5); cs.position.set(-3.4, 1.1 - i * 0.62, 0); g.add(cs); }
      for (let i = 0; i < 5; i++) { const b = makeBattery(); b.scale.setScalar(0.44); b.position.set(-1.8 + (i % 3) * 0.5, 1.0 - Math.floor(i / 3) * 0.8, 0); b.rotation.z = 0.2; g.add(b); }
      const four = makeLabel("4", { font: 150, color: "#fe5b1a", glowColor: "#fe5b1a", scale: 1.5 }); four.position.set(0.5, 1.3, 0.5);
      const five = makeLabel("5", { font: 150, color: "#4a86ff", glowColor: "#4a86ff", scale: 1.5 }); five.position.set(1.7, 1.3, 0.5);
      stage.scene.add(four, five);
      stage.onFrame((dt, el) => { animateBit(bit, el, 0); g.children.forEach((o) => o.rotation.y += dt * 0.2); four.position.y = 1.3 + Math.sin(el * 1.2) * 0.05; });
      return {};
    }
  );
  return (
    <Frame eyebrow={t(c.eyebrow)} nar={nar}
      footer={
        <>
          <div className="l3-rule">{t(c.rule)}</div>
          <p className="l3-check-q">{t(c.check_q)}</p>
          <div className="l3-check-row">
            <button className={`l3-check-digit tens ${checked === true ? "ok" : ""}`} onClick={() => setChecked(true)}>4</button>
            <button className={`l3-check-digit ones ${checked === false ? "no" : ""}`} onClick={() => setChecked(false)}>5</button>
          </div>
          <Feedback show={checked != null} ok={checked === true}>{t(checked ? c.check_ok : c.check_no)}</Feedback>
        </>
      }
    ><Canvas canvasRef={canvasRef} /></Frame>
  );
}

// =========================================================================
// s9 — SORT: kasseta->O'NLIKLAR, batareya->BIRLIKLAR
// =========================================================================
function S9() {
  const c = CONTENT.s9; const lang = useLang(); const t = useT();
  const nar = useNarration(c.audio.intro, lang);
  const [selKind, setSelKind] = useState(null); // tanlangan yuk turi (tens/ones)
  const [placed, setPlaced] = useState(0);
  const [msg, setMsg] = useState(null);
  const total = 5; // 3 kasseta + 2 batareya
  const { canvasRef, apiRef } = useStage(
    { camPos: [0, 0.7, 12], camTarget: [0, 0.2, 0] },
    (stage) => {
      backdrop(stage, false); addPlanet(stage.scene, [7.6, 3.2, -18], 0.7);
      const bins = {};
      [["tens", -3.7, ACCENT], ["ones", 3.7, BLUE]].forEach(([k, x, col]) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.25, 2.0), new THREE.MeshStandardMaterial({ color: 0x141a2a, emissive: col, emissiveIntensity: 0.3 }));
        b.position.set(x, -1.7, 0); stage.scene.add(b); bins[k] = { x, y: -1.3, n: 0 };
      });
      const items = [];
      let idx = 0;
      [["tens", 3], ["ones", 2]].forEach(([kind, n]) => { for (let i = 0; i < n; i++) {
        const o = kind === "tens" ? makeCassette(10) : makeBattery();
        o.scale.setScalar(kind === "tens" ? 0.58 : 0.7);
        o.position.set((idx - 2) * 1.5, 1.2 + (kind === "ones" ? -0.2 : 0.4), (Math.random() - 0.5) * 0.8);
        floaty(o); o.userData.pickId = idx; o.userData.kind = kind; o.userData.done = false; o.userData.sc = o.scale.x;
        stage.scene.add(o); items.push(o); idx++;
      }});
      let selected = null;
      const api = { onSelect: null, onWrong: null, onPlaced: null };
      stage.onClick(() => items.filter((o) => !o.userData.done), (obj) => {
        selected = obj; api.onSelect?.(obj.userData.kind);
      });
      api.drop = (binKind) => {
        const o = selected; if (!o) return;
        if (o.userData.kind !== binKind) { api.onWrong?.(); return; }
        o.userData.done = true; o.userData.f = null;
        const bin = bins[binKind]; o.userData.target = new THREE.Vector3(bin.x - 0.7 + (bin.n % 3) * 0.7, bin.y + Math.floor(bin.n / 3) * 0.5, 0); bin.n++;
        selected = null; api.onPlaced?.();
      };
      stage.onFrame((dt, el) => {
        items.forEach((o) => {
          if (o.userData.done) { o.position.lerp(o.userData.target, 0.14); o.rotation.x = lerp(o.rotation.x, 0, 0.1); o.scale.setScalar(o.userData.sc); }
          else { driftFloaty(o, el, dt, 0.16); o.scale.setScalar(o.userData.sc * (o === selected ? 1 + Math.sin(el * 8) * 0.1 : 1)); }
        });
      });
      return api;
    }
  );
  useEffect(() => {
    const api = apiRef.current; if (!api) return;
    api.onSelect = (kind) => { setSelKind(kind); setMsg(null); };
    api.onWrong = () => setMsg("wrong");
    api.onPlaced = () => { setSelKind(null); setPlaced((p) => p + 1); };
    // eslint-disable-next-line
  }, []);
  const drop = (kind) => {
    if (!selKind) return;
    const ok = selKind === kind;
    apiRef.current?.drop(kind);
    window.speechSynthesis?.cancel();
    if (!ok) { const u = new SpeechSynthesisUtterance(t(c.audio.on_wrong)); u.lang = lang === "ru" ? "ru-RU" : "uz-UZ"; if (!nar.muted) window.speechSynthesis.speak(u); }
  };
  const done = placed >= total;
  useEffect(() => { if (done) { window.speechSynthesis?.cancel(); const u = new SpeechSynthesisUtterance(t(c.audio.on_correct)); u.lang = lang === "ru" ? "ru-RU" : "uz-UZ"; if (!nar.muted) window.speechSynthesis.speak(u); } /* eslint-disable-next-line */ }, [done]);
  return (
    <Frame eyebrow={t(c.eyebrow)} title={t(c.q)} nar={nar}
      footer={
        <>
          <div className="l3-bins">
            <button className={`l3-bin tens ${selKind ? "live" : ""}`} onClick={() => drop("tens")}>{t(c.hold_tens)}</button>
            <button className={`l3-bin ones ${selKind ? "live" : ""}`} onClick={() => drop("ones")}>{t(c.hold_ones)}</button>
          </div>
          <div className="l3-hint-note">
            {done ? "✓ " + t(c.audio.on_correct)
              : selKind ? (lang === "ru" ? "Выбери отсек ↑" : "Tryumni tanlang ↑")
              : (lang === "ru" ? "Нажми на груз в космосе" : "Koinotdagi yukni bosing")} · {placed}/{total}
          </div>
          {msg === "wrong" && <Feedback show ok={false}>{t(c.audio.on_wrong)}</Feedback>}
        </>
      }
    ><Canvas canvasRef={canvasRef} /></Frame>
  );
}

// =========================================================================
// s12 — MASALA setup (6 kasseta + 3 batareya, manifest)
// =========================================================================
function S12() {
  const c = CONTENT.s12; const lang = useLang(); const t = useT();
  const nar = useNarration(c.audio[lang], lang);
  const { canvasRef } = useStage(
    { camPos: [0, 0.8, 12], camTarget: [0, 0.3, 0] },
    (stage) => { backdrop(stage); const cargo = placeCargo(stage.scene, 6, 3); const bit = addBit(stage, [4.6, 0.2, 0.4], 0.7); stage.onFrame((dt, el) => { animateCargo(cargo, el); animateBit(bit, el, 0); }); return {}; }
  );
  return (
    <Frame eyebrow={t(c.eyebrow)} title={t(c.lead)} nar={nar}
      footer={<div className="l3-manifest"><span className="l3-manifest-badge">{t(c.manifest_label)}</span><span>6 × <b style={{ color: "#fe5b1a" }}>{lang === "ru" ? "кассет" : "kasseta"}</b> · 3 × <b style={{ color: "#4a86ff" }}>{lang === "ru" ? "батарейки" : "batareya"}</b></span></div>}
    ><Canvas canvasRef={canvasRef} /></Frame>
  );
}

// =========================================================================
// s15 — YAKUN: uchish + qoida recap
// =========================================================================
function S15() {
  const c = CONTENT.s15; const lang = useLang(); const t = useT();
  const nar = useNarration(c.audio[lang], lang);
  const { canvasRef } = useStage(
    { orbit: true, autoRotate: true, camPos: [0, 1, 13] },
    (stage) => {
      backdrop(stage); addPlanet(stage.scene, [-8, -2, -20], 1.4);
      const bit = addBit(stage, [2.6, 0.2, 0.5], 0.85);
      // raketa (kassetalardan yoqilg'i)
      const rocket = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.6, 1.8, 8, 16), new THREE.MeshStandardMaterial({ color: 0xdfe6f0, roughness: 0.3, metalness: 0.6 })); rocket.add(body);
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.9, 16), new THREE.MeshStandardMaterial({ color: ACCENT, roughness: 0.4, metalness: 0.3, emissive: ACCENT, emissiveIntensity: 0.3 })); nose.position.y = 1.75; rocket.add(nose);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.2, 16), new THREE.MeshBasicMaterial({ color: 0xffd36b })); flame.position.y = -1.7; flame.rotation.x = Math.PI; rocket.add(flame);
      rocket.position.set(-3.2, -0.4, 0); rocket.rotation.z = 0.08; stage.scene.add(rocket);
      // warp yulduz chiziqlari
      stage.onFrame((dt, el) => { animateBit(bit, el, 1); rocket.position.y = -0.4 + Math.sin(el * 1.2) * 0.15; flame.scale.y = 1 + Math.sin(el * 20) * 0.25; flame.scale.x = 1 + Math.sin(el * 25) * 0.15; rocket.rotation.z = 0.08 + Math.sin(el * 0.8) * 0.03; });
      return {};
    }
  );
  return (
    <Frame eyebrow={t(c.eyebrow)} title={t(c.mission_done)} nar={nar}
      footer={
        <>
          <p className="l3-cando">{t(c.cando)}</p>
          <div className="l3-recap"><span className="l3-recap-badge">{lang === "ru" ? "Правило" : "Qoida"}</span>{t(c.rule_recap)}</div>
          <div className="l3-conn">
            <div><b>{t(c.conn_label_refs)}:</b> {t(c.conn_refs)}</div>
            <div><b>{t(c.conn_label_next)}:</b> {t(c.conn_next)}</div>
          </div>
          <div className="l3-roadmap">🪐 1 / 6 — {lang === "ru" ? "планета пройдена" : "sayyora o'tildi"}</div>
        </>
      }
    ><Canvas canvasRef={canvasRef} /></Frame>
  );
}

// ---- MC ekranlari (cargo) --------------------------------------------------
const S10 = () => <MCCargo sid="s10" tens={5} ones={2}
  options={[{ label: "52" }, { label: "25" }, { label: "7" }, { label: "502" }]} correct={0}
  explains={[null, CONTENT.s10.wrong_1, CONTENT.s10.wrong_2, CONTENT.s10.wrong_3]} />;
const S11 = () => <Compare />;
const S13 = () => <MCCargo sid="s13" tens={6} ones={3}
  options={[{ label: "63" }, { label: "36" }, { label: "9" }, { label: "60" }]} correct={0}
  explains={[null, CONTENT.s13.wrong_1, CONTENT.s13.wrong_2, CONTENT.s13.wrong_3]} />;
const S14 = () => <MCCargo sid="s14" tens={4} ones={7}
  options={[{ label: "47" }, { label: "74" }, { label: "11" }, { label: "407" }]} correct={0}
  explains={[null, CONTENT.s14.wrong_1, CONTENT.s14.wrong_2, CONTENT.s14.wrong_3]}
  fact={{ badge: CONTENT.s14.fact_badge, text: CONTENT.s14.fact_text }} />;

// s11 — taqqoslash 45 vs 54
function Compare() {
  const c = CONTENT.s11; const lang = useLang(); const t = useT();
  const nar = useNarration(c.audio.intro, lang);
  const [picked, setPicked] = useState(null);
  const { canvasRef } = useStage(
    { camPos: [0, 0.8, 13], camTarget: [0, 0.2, 0] },
    (stage) => {
      backdrop(stage);
      const left = placeCargo(stage.scene, 4, 5, { tx: -4.4, ox: -3.0 });
      const right = placeCargo(stage.scene, 5, 4, { tx: 2.2, ox: 4.0 });
      left.scale.setScalar(0.62); left.position.set(-2.2, 0, 0);
      right.scale.setScalar(0.62); right.position.set(0.4, 0, 0);
      stage.onFrame((dt, el) => { animateCargo(left, el); animateCargo(right, el); });
      return {};
    }
  );
  const onPick = (i) => { if (picked != null) return; setPicked(i); window.speechSynthesis?.cancel(); const u = new SpeechSynthesisUtterance(t(i === 1 ? c.audio.on_correct : c.audio.on_wrong)); u.lang = lang === "ru" ? "ru-RU" : "uz-UZ"; if (!nar.muted) window.speechSynthesis.speak(u); };
  return (
    <Frame eyebrow={t(c.eyebrow)} title={t(c.q)} nar={nar}
      footer={<>
        <Options opts={[t(c.opt0), t(c.opt1)]} picked={picked} correct={1} onPick={onPick} cols={2} />
        <Feedback show={picked != null} ok={picked === 1}>{t(picked === 1 ? c.audio.on_correct : c.audio.on_wrong)}</Feedback>
      </>}
    ><Canvas canvasRef={canvasRef} /></Frame>
  );
}

export const SCREENS = {
  s0: S0, s1: S1, s2: S2,
  s3: () => <BuildTray sid="s3" target={24} withCheck={false} />,
  s4: S4, s5: S5, s6: S6, s7: S7,
  s8: () => <BuildTray sid="s8" target={45} withCheck />,
  s9: S9, s10: S10, s11: S11, s12: S12, s13: S13, s14: S14, s15: S15,
};
