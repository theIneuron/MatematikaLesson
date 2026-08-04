// ============================================================================
// informatika3/scenes/Dars01/Computer3D.jsx — КОМПЬЮТЕР В ТРЁХ ИЗМЕРЕНИЯХ
//
// ПОЧЕМУ ЗДЕСЬ 3D, ХОТЯ В МАТЕМАТИКЕ ОН БЫЛ ОТКЛОНЁН
//
// Изометрические блоки разряда методист отклонил, и по делу: число в перспективе
// читается ТРУДНЕЕ, чем в плоскости — перспектива добавляла работу, не добавляя
// смысла. Здесь наоборот. Компьютер — физический предмет, и два факта урока
// нельзя показать плоской картинкой:
//   1. у него есть СТОРОНЫ: спереди экран, сбоку системный блок, и это разные
//      части одного предмета, а не разные предметы;
//   2. у него есть ВНУТРИ: процессор, память и диск лежат в корпусе, а не рядом
//      с ним. «Внутри» плоско изобразить нечем — только подписью, а подпись
//      ребёнок и так не проверит.
// Крутится модель ограниченно (±60°) и не приближается: цель — рассмотреть
// предмет, а не научиться управлять камерой.
//
// ЧТО ДЕЛАЕТ КОМПОНЕНТ БЕЗОПАСНЫМ
//   • three подгружается динамически: математика его в бандл не тянет;
//   • нет WebGL или сборка сцены упала — рисуется плоская раскладка из иконок,
//     и урок проходится до конца (звук и навигация от 3D не зависят вообще);
//   • prefers-reduced-motion — модель стоит, вращение только руками;
//   • при уходе с экрана renderer, геометрии и материалы освобождаются: иначе
//     пятнадцать экранов урока оставили бы пятнадцать контекстов WebGL.
//
// ПОДПИСИ ЧАСТЕЙ приходят из данных урока (`label`), а не живут здесь.
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import { T, useT, useIsMobile, DeviceIcon } from '../../kit/index.js';

// Цвета корпуса — та же пастель, что в остальном уроке. Тёплый белый корпус,
// холодный экран: контраст помогает отличить «где показывает» от «где считает».
const C = {
  desk: 0xEFE7DA,
  case: 0xF7F5F0,
  caseDark: 0xE4E0D6,
  screen: 0xD8ECF6,
  screenGlow: 0xF3FAFD,
  key: 0xE9E6DE,
  board: 0x2E6E52,
  cpu: 0xE1A23C,
  ram: 0x3F7FA8,
  disk: 0x8496A8,
  accent: 0xFF4F28,
};

// Части, которые сцена умеет подсвечивать (highlight в данных урока):
//   monitor, unit, keyboard, mouse — снаружи
//   cpu, ram, disk — внутри, нужен open: true
// Список нарочно НЕ экспортируется: экспорт чего-либо кроме компонента ломает
// fast refresh, а автору данных нужен не импорт, а этот комментарий.

export default function Computer3D({ highlight = null, open = false, label = null, hint = null }) {
  const t = useT();
  const isMobile = useIsMobile(640);
  const wrapRef = useRef(null);
  const apiRef = useRef(null);            // { applyProps(highlight, open) }
  // Подпись части двигается ИМПЕРАТИВНО, через ref. Через useState это был бы
  // ре-рендер React пятнадцать раз в секунду ради двух чисел в style.
  const markerRef = useRef(null);
  const [failed, setFailed] = useState(false);

  // --- сборка сцены: один раз на монтирование --------------------------------
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;
    let disposed = false;
    let cleanup = () => {};

    Promise.all([
      import('three'),
      import('three/examples/jsm/geometries/RoundedBoxGeometry.js'),
    ]).then(([THREE, { RoundedBoxGeometry }]) => {
      if (disposed) return;

      const reduceMotion = typeof window !== 'undefined' && window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      wrap.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 16 / 10, 0.1, 100);
      camera.position.set(0, 4.4, 13.2);
      camera.lookAt(0, 1.5, 0);

      // Свет мягкий и без теней: жёсткая тень на пастели читается как грязь.
      scene.add(new THREE.HemisphereLight(0xFFFFFF, 0xE8E2D6, 1.05));
      const key = new THREE.DirectionalLight(0xFFFFFF, 0.85);
      key.position.set(5, 8, 6);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xDCEAF2, 0.35);
      fill.position.set(-6, 3, 2);
      scene.add(fill);

      // Учёт всего созданного — чтобы освободить ровно то, что создали.
      const geos = [];
      const mats = [];
      const track = (g, m) => { geos.push(g); mats.push(m); return [g, m]; };

      const mat = (color, extra = {}) => {
        const m = new THREE.MeshStandardMaterial({
          color, roughness: 0.62, metalness: 0.04, ...extra,
        });
        return m;
      };

      /** Скруглённый блок: единственная форма урока, поэтому вынесена в функцию. */
      const box = (w, h, d, color, extra = {}) => {
        const g = new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * 0.16);
        const m = mat(color, extra);
        track(g, m);
        return new THREE.Mesh(g, m);
      };

      const root = new THREE.Group();
      scene.add(root);

      // --- стол ---------------------------------------------------------------
      const desk = box(11, 0.34, 6.4, C.desk);
      desk.position.set(0, -0.17, 0.6);
      root.add(desk);

      // --- монитор ------------------------------------------------------------
      const monitor = new THREE.Group();
      const bezel = box(4.9, 3.2, 0.26, C.case);
      monitor.add(bezel);
      const glass = box(4.4, 2.7, 0.08, C.screen, {
        emissive: new THREE.Color(C.screenGlow), emissiveIntensity: 0.45, roughness: 0.3,
      });
      glass.position.z = 0.16;
      monitor.add(glass);
      const neck = box(0.5, 1.0, 0.4, C.caseDark);
      neck.position.y = -2.0;
      monitor.add(neck);
      const foot = box(2.0, 0.22, 1.1, C.caseDark);
      foot.position.y = -2.55;
      monitor.add(foot);
      monitor.position.set(0.9, 3.3, -1.1);
      root.add(monitor);

      // --- системный блок ------------------------------------------------------
      const unit = new THREE.Group();
      // transparent: true задан сразу. Первая версия делала прозрачной только
      // боковую стенку, и внутренности всё равно оставались невидимыми: их
      // закрывал сам корпус, потому что RoundedBoxGeometry — цельный блок,
      // а не четыре стенки. Найдено на снимке экрана 4.
      const shell = box(1.9, 3.9, 3.4, C.case, { transparent: true, opacity: 1 });
      unit.add(shell);
      // Передняя панель: кнопка и щель — по ним ребёнок узнаёт «переднюю сторону».
      const btn = box(0.28, 0.28, 0.1, C.accent);
      btn.position.set(0, 1.4, 1.72);
      unit.add(btn);
      const slot = box(1.1, 0.14, 0.08, C.caseDark);
      slot.position.set(0, 0.9, 1.72);
      unit.add(slot);

      // --- внутренности (видны, когда снята боковая стенка) --------------------
      const inside = new THREE.Group();
      const boardMesh = box(0.08, 3.2, 2.8, C.board, { roughness: 0.75 });
      boardMesh.position.set(0.5, 0, 0);
      inside.add(boardMesh);

      const cpu = box(0.7, 0.7, 0.7, C.cpu, { metalness: 0.25, roughness: 0.45 });
      cpu.position.set(0.15, 0.75, 0.2);
      inside.add(cpu);

      const ramGroup = new THREE.Group();
      [-0.45, 0.05].forEach((z) => {
        const stick = box(0.16, 1.5, 0.34, C.ram);
        stick.position.set(0.2, 0.1, z - 0.8);
        stick.rotation.x = Math.PI / 2;
        ramGroup.add(stick);
      });
      inside.add(ramGroup);

      const disk = box(0.55, 1.0, 1.5, C.disk, { metalness: 0.3, roughness: 0.45 });
      disk.position.set(-0.2, -1.15, 0.45);
      inside.add(disk);
      unit.add(inside);

      // Боковая стенка: при `open` становится почти прозрачной. Именно стенка, а не
      // «взрыв-схема»: детали должны остаться НА СВОИХ МЕСТАХ внутри корпуса.
      const side = box(0.1, 3.7, 3.2, C.caseDark, { transparent: true, opacity: 1 });
      side.position.set(-0.92, 0, 0);
      unit.add(side);

      unit.position.set(-3.5, 1.95, -0.6);
      root.add(unit);

      // --- клавиатура ----------------------------------------------------------
      const keyboard = new THREE.Group();
      const kbBody = box(4.4, 0.24, 1.5, C.case);
      keyboard.add(kbBody);
      // Один материал на все клавиши: 30 материалов вместо одного — 30 шейдеров.
      const keyGeo = new RoundedBoxGeometry(0.3, 0.1, 0.28, 2, 0.05);
      const keyMat = mat(C.key);
      track(keyGeo, keyMat);
      for (let r = 0; r < 3; r += 1) {
        for (let k = 0; k < 11; k += 1) {
          const kk = new THREE.Mesh(keyGeo, keyMat);
          kk.position.set(-1.7 + k * 0.34, 0.17, -0.36 + r * 0.34);
          keyboard.add(kk);
        }
      }
      keyboard.position.set(0.4, 0.15, 2.0);
      keyboard.rotation.x = -0.04;
      root.add(keyboard);

      // --- мышь ----------------------------------------------------------------
      const mouse = new THREE.Group();
      const mouseGeo = new THREE.SphereGeometry(0.42, 20, 14);
      const mouseMat = mat(C.case);
      track(mouseGeo, mouseMat);
      const mouseBody = new THREE.Mesh(mouseGeo, mouseMat);
      mouseBody.scale.set(0.72, 0.42, 1);
      mouse.add(mouseBody);
      mouse.position.set(3.5, 0.19, 2.0);
      root.add(mouse);

      // --- реестр частей: что подсвечивать и куда ставить подпись ---------------
      const PARTS = {
        monitor: { group: monitor, focus: glass },
        unit: { group: unit, focus: shell },
        keyboard: { group: keyboard, focus: kbBody },
        mouse: { group: mouse, focus: mouseBody },
        cpu: { group: cpu, focus: cpu, needsOpen: true },
        ram: { group: ramGroup, focus: ramGroup.children[0], needsOpen: true },
        disk: { group: disk, focus: disk, needsOpen: true },
      };

      // Материалы, которые гасим, когда подсвечена одна часть. Собраны обходом:
      // перечислять руками — значит забыть один при следующей правке модели.
      const dimmable = [];
      root.traverse((o) => {
        if (o.isMesh && o.material && o.material !== side.material && o.material !== shell.material) {
          o.material.transparent = true;
          dimmable.push({ mesh: o, mat: o.material, base: o.material.opacity });
        }
      });

      const partMeshes = (key) => {
        const out = [];
        const g = PARTS[key]?.group;
        if (!g) return out;
        if (g.isMesh) out.push(g);
        g.traverse?.((o) => { if (o.isMesh) out.push(o); });
        return out;
      };

      // Камера стоит на месте, пока корпус закрыт, и НАЕЗЖАЕТ на блок, когда он
      // открыт: процессор размером с ноготь, и с общего плана его не разглядеть.
      // Открытый корпус смотрим С ТОЙ СТОРОНЫ, где снята стенка, то есть слева.
      // Первая версия наезжала спереди-справа: корпус становился стеклянным,
      // но плата стояла к камере рёбром и внутренностей было не разглядеть.
      // Найдено на снимке экрана 4 после ручного поворота модели.
      const CAM = {
        closed: { pos: [0, 4.4, 13.2], look: [0, 1.5, 0] },
        open: { pos: [-7.4, 3.3, 6.2], look: [-3.5, 1.85, 0] },
      };

      const state = { highlight: null, open: false, targetSide: 1, targetShell: 1, userRotY: 0, userRotX: 0 };

      const applyProps = (h, o) => {
        state.highlight = PARTS[h] ? h : null;
        state.open = !!o;
        state.targetSide = state.open ? 0 : 1;
        state.targetShell = state.open ? 0.17 : 1;

        // Гашение мягкое (0.6, не 0.28): при сильном гашении весь компьютер
        // выцветал и перестал читаться как один предмет — видно на первом
        // снимке экрана 3. Подсветку несут акцентное свечение, пульс и подпись.
        const lit = state.highlight ? new Set(partMeshes(state.highlight)) : null;
        dimmable.forEach(({ mesh, mat: m }) => {
          const isLit = !lit || lit.has(mesh);
          m.opacity = isLit ? 1 : 0.6;
          if (mesh === glass) return;
          m.emissiveIntensity = isLit && lit ? 0.45 : 0;
          if (m.emissive) m.emissive.set(isLit && lit ? C.accent : 0x000000);
        });
      };

      // --- вращение руками -------------------------------------------------------
      // Ограничения намеренные: по горизонтали ±60°, по вертикали почти ничего.
      // Свободная камера у восьмилетнего заканчивается видом на дно стола.
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      const onDown = (e) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        wrap.setPointerCapture?.(e.pointerId);
      };
      const onMove = (e) => {
        if (!dragging) return;
        state.userRotY += (e.clientX - lastX) * 0.008;
        state.userRotX += (e.clientY - lastY) * 0.004;
        state.userRotY = Math.max(-1.05, Math.min(1.05, state.userRotY));
        state.userRotX = Math.max(-0.12, Math.min(0.34, state.userRotX));
        lastX = e.clientX;
        lastY = e.clientY;
      };
      const onUp = (e) => {
        dragging = false;
        wrap.releasePointerCapture?.(e.pointerId);
      };
      wrap.addEventListener('pointerdown', onDown);
      wrap.addEventListener('pointermove', onMove);
      wrap.addEventListener('pointerup', onUp);
      wrap.addEventListener('pointercancel', onUp);

      // --- размер --------------------------------------------------------------
      const resize = () => {
        const w = wrap.clientWidth || 320;
        const h = wrap.clientHeight || Math.round(w / 1.6);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
      ro?.observe(wrap);

      // --- кадр ----------------------------------------------------------------
      const projected = new THREE.Vector3();
      const camTarget = new THREE.Vector3();
      const camLook = new THREE.Vector3(0, 1.5, 0);
      let raf = 0;
      let frame = 0;
      const start = performance.now();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const time = (performance.now() - start) / 1000;

        // Покачивание вместо полного оборота: экран всё время остаётся видимым.
        // При открытом корпусе амплитуда меньше: снятая стенка должна оставаться
        // повёрнутой к ребёнку, иначе внутренности уезжают из вида.
        const idle = reduceMotion ? 0 : Math.sin(time * 0.28) * (state.open ? 0.07 : 0.22);
        root.rotation.y = state.userRotY + idle;
        root.rotation.x = state.userRotX;

        // Боковая стенка снимается плавно, а не пропадает кадром; вместе с ней
        // корпус становится стеклянным, и внутренности видно на своих местах.
        side.material.opacity += (state.targetSide - side.material.opacity) * 0.12;
        side.visible = side.material.opacity > 0.02;
        shell.material.opacity += (state.targetShell - shell.material.opacity) * 0.1;

        const cam = state.open ? CAM.open : CAM.closed;
        camera.position.lerp(camTarget.set(...cam.pos), 0.06);
        camLook.lerp(camTarget.set(...cam.look), 0.06);
        camera.lookAt(camLook);

        // Подсвеченная часть чуть дышит — так видно, о чём речь, даже без цвета.
        if (state.highlight && !reduceMotion) {
          const s = 1 + Math.sin(time * 3.4) * 0.035;
          const g = PARTS[state.highlight].group;
          g.scale.setScalar(s);
        }
        Object.entries(PARTS).forEach(([k, p]) => {
          if (k !== state.highlight) p.group.scale.setScalar(1);
        });

        renderer.render(scene, camera);

        // Подпись части ставится там, где часть оказалась на экране: 3D-текст
        // потребовал бы шрифта, а шрифты проекта ограничены четырьмя (§5).
        frame += 1;
        if (frame % 3 === 0 && markerRef.current) {
          const p = state.highlight ? PARTS[state.highlight] : null;
          const el = markerRef.current;
          if (!p) {
            el.style.display = 'none';
          } else {
            p.focus.getWorldPosition(projected);
            projected.project(camera);
            el.style.display = 'flex';
            el.style.left = `${(projected.x * 0.5 + 0.5) * 100}%`;
            el.style.top = `${(-projected.y * 0.5 + 0.5) * 100}%`;
          }
        }
      };
      tick();

      apiRef.current = { applyProps };
      applyProps(highlight, open);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro?.disconnect();
        wrap.removeEventListener('pointerdown', onDown);
        wrap.removeEventListener('pointermove', onMove);
        wrap.removeEventListener('pointerup', onUp);
        wrap.removeEventListener('pointercancel', onUp);
        geos.forEach((g) => g.dispose());
        mats.forEach((m) => m.dispose());
        renderer.dispose();
        if (renderer.domElement.parentNode === wrap) wrap.removeChild(renderer.domElement);
        apiRef.current = null;
      };
    }).catch((err) => {
      // Сцена не собралась (нет WebGL, старый браузер, ошибка в модели) — урок
      // продолжается на плоской раскладке. Молчать нельзя: иначе причина
      // «почему у ребёнка нет модели» не найдётся никогда.
      console.error('[Computer3D] сцена не собрана, показана плоская раскладка:', err);
      setFailed(true);
    });

    return () => {
      disposed = true;
      cleanup();
    };
    // highlight и open прикладываются отдельным эффектом; здесь они нужны только
    // как НАЧАЛЬНОЕ состояние, поэтому в зависимости не идут — иначе сцена
    // пересобиралась бы на каждой фразе озвучки.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // --- смена подсвеченной части и открытия корпуса ---------------------------
  useEffect(() => {
    apiRef.current?.applyProps(highlight, open);
  }, [highlight, open]);

  // --- плоская замена --------------------------------------------------------
  if (failed) {
    const flat = [
      { kind: 'monitor', part: 'monitor', role: 'output' },
      { kind: 'cpu', part: 'unit', role: 'inside' },
      { kind: 'keyboard', part: 'keyboard', role: 'input' },
      { kind: 'mouse', part: 'mouse', role: 'input' },
    ];
    return (
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {flat.map((f) => (
          <DeviceIcon
            key={f.part}
            kind={f.kind}
            role={f.role}
            size={64}
            dim={!!highlight && highlight !== f.part}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        ref={wrapRef}
        className="inf-canvas-wrap"
        style={{ aspectRatio: '1.6 / 1', maxHeight: 'clamp(150px, 33vh, 290px)', margin: '0 auto' }}
        aria-hidden="true"
      >
        {/* Подпись части висит НА части, а не под рамкой: связь «слово — предмет»
            иначе достаётся ребёнку догадкой. */}
        {label && (
          <div
            ref={markerRef}
            style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -108%)', pointerEvents: 'none',
              display: 'none', flexDirection: 'column', alignItems: 'center', gap: 4,
              transition: 'left .25s ease, top .25s ease',
            }}
          >
            <span
              style={{
                background: 'rgba(255,255,255,.94)', color: T.ink, fontWeight: 800,
                fontSize: 'clamp(11px, 1.7vw, 14px)', padding: '3px 10px', borderRadius: 99,
                border: `1.5px solid ${T.accent}`, whiteSpace: 'nowrap',
              }}
            >
              {t(label)}
            </span>
            <span
              style={{
                width: 11, height: 11, borderRadius: 99, background: T.accent,
                boxShadow: '0 0 0 4px rgba(255,79,40,.22)',
              }}
            />
          </div>
        )}
      </div>
      {hint && (
        <span
          className="mono inf-rotate-hint"
          style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: T.ink2, textAlign: 'center', fontWeight: 700 }}
        >
          {t(hint)}
        </span>
      )}
    </div>
  );
}
