"""
DEMO (izolyatsiya) — Grade3 Dars01 "Yuzliklar, o'nliklar va birliklar" MANIM klipi.
Etalon/produksiya grade3/Dars01.jsx ga TEGMAYDI. Manim CE, LaTeX SHART EMAS (Text/Pango).

Render (ffmpeg PATH'da bo'lishi kerak):
  python -m manim -ql --media_dir src/lab/grade3_dars01_manim/media \
      src/lab/grade3_dars01_manim/yuzlik_onlik_birlik.py YuzlikOnlikBirlik

Yadro (grade3/Dars01_CONTENT'dan): uch xonali son = yuzlik + o'nlik + birlik;
o'rin qiymatni belgilaydi; nol o'rinni saqlaydi (305); 345 = 300 + 40 + 5.
"""
from manim import *

GREEN = "#2fbf71"    # yuzlik
ORANGE = "#fe5b1a"   # o'nlik
BLUE = "#4a86ff"     # birlik
CREAM = "#F6F4EF"
DIM = "#A7A6A2"
BG = "#0a0e1a"


def unit(color=BLUE, s=0.34):
    return Square(side_length=s, color=color, fill_color=color, fill_opacity=0.9, stroke_width=1.2)


def ten_rod(s=0.3):
    return VGroup(*[unit(ORANGE, s) for _ in range(10)]).arrange(UP, buff=0)


def hundred_flat(s=0.26):
    """10x10 birlik = bitta yuzlik plitasi (base-10 flat)."""
    rows = VGroup(*[
        VGroup(*[unit(GREEN, s) for _ in range(10)]).arrange(RIGHT, buff=0)
        for _ in range(10)
    ]).arrange(UP, buff=0)
    return rows


class YuzlikOnlikBirlik(Scene):
    def construct(self):
        self.camera.background_color = BG

        # ===== 1. SARLAVHA =====
        title = Text("Yuzliklar, o'nliklar va birliklar", font_size=46, color=CREAM, weight=BOLD)
        sub = Text("Uch xonali sonda har raqamning o'z o'rni bor", font_size=24, color=GREEN)
        sub.next_to(title, DOWN, buff=0.3)
        g = VGroup(title, sub).move_to(ORIGIN)
        self.play(Write(title), run_time=1.2)
        self.play(FadeIn(sub, shift=UP * 0.3))
        self.wait(1.2)
        self.play(FadeOut(g))

        # ===== 2. UNITIZING: 10 o'nlik -> 1 yuzlik =====
        cap = Text("10 o'nlik = 1 yuzlik", font_size=40, color=CREAM).to_edge(UP)
        self.play(FadeIn(cap))
        rods = VGroup(*[ten_rod() for _ in range(10)]).arrange(RIGHT, buff=0.12).move_to(ORIGIN)
        rlbl = Text("10 o'nlik", font_size=26, color=ORANGE).next_to(rods, DOWN, buff=0.4)
        self.play(LaggedStart(*[GrowFromEdge(r, DOWN) for r in rods], lag_ratio=0.12), run_time=1.6)
        self.play(FadeIn(rlbl))
        self.wait(0.6)
        flat = hundred_flat().move_to(ORIGIN)
        self.play(FadeOut(rlbl))
        self.play(ReplacementTransform(rods, flat), run_time=1.3)
        flbl = Text("1 yuzlik", font_size=30, color=GREEN, weight=BOLD).next_to(flat, RIGHT, buff=0.5)
        self.play(Write(flbl))
        self.wait(1.2)
        self.play(FadeOut(cap), FadeOut(flat), FadeOut(flbl))

        # ===== 3. 345 = 300 + 40 + 5 =====
        flats = VGroup(*[hundred_flat(0.16) for _ in range(3)]).arrange(RIGHT, buff=0.2)
        tens = VGroup(*[ten_rod(0.2) for _ in range(4)]).arrange(RIGHT, buff=0.12)
        ones = VGroup(*[unit(BLUE, 0.24) for _ in range(5)]).arrange(UP, buff=0.07)
        row = VGroup(flats, tens, ones).arrange(RIGHT, buff=0.5, aligned_edge=DOWN).move_to(LEFT * 1.6 + DOWN * 0.3)
        self.play(LaggedStart(*[GrowFromCenter(f) for f in flats], lag_ratio=0.25), run_time=1.2)
        self.play(LaggedStart(*[GrowFromCenter(t) for t in tens], lag_ratio=0.2), run_time=0.8)
        self.play(LaggedStart(*[FadeIn(o, scale=0.4) for o in ones], lag_ratio=0.15), run_time=0.6)
        self.wait(0.4)

        num = Text("345", font_size=96, weight=BOLD)
        num[0].set_color(GREEN); num[1].set_color(ORANGE); num[2].set_color(BLUE)
        num.move_to(RIGHT * 4.2 + UP * 1.4)
        eq = VGroup(
            Text("345", font_size=38, color=CREAM), Text("=", font_size=38, color=DIM),
            Text("300", font_size=38, color=GREEN), Text("+", font_size=38, color=DIM),
            Text("40", font_size=38, color=ORANGE), Text("+", font_size=38, color=DIM),
            Text("5", font_size=38, color=BLUE),
        ).arrange(RIGHT, buff=0.16).next_to(num, DOWN, buff=0.5)
        self.play(Write(num))
        self.play(FadeIn(eq, shift=UP * 0.3))
        self.wait(1.6)
        self.play(FadeOut(VGroup(flats, tens, ones, eq)),
                  num.animate.move_to(UP * 2.5).scale(0.8))

        # ===== 4. QOIDA: o'rin hal qiladi =====
        d0, d1, d2 = num[0], num[1], num[2]
        labs = [("yuzliklar", GREEN, d0, LEFT * 3.4), ("o'nliklar", ORANGE, d1, ORIGIN + LEFT * 0.0), ("birliklar", BLUE, d2, RIGHT * 3.4)]
        arrs, texts = VGroup(), VGroup()
        for word, col, dig, off in labs:
            lab = Text(word, font_size=26, color=col, weight=BOLD).move_to(num.get_center() + DOWN * 1.7 + off)
            ar = Arrow(dig.get_bottom() + DOWN * 0.05, lab.get_top() + UP * 0.05, color=col, buff=0.05, stroke_width=4)
            arrs.add(ar); texts.add(lab)
        self.play(LaggedStart(*[GrowArrow(a) for a in arrs], lag_ratio=0.2),
                  LaggedStart(*[FadeIn(t) for t in texts], lag_ratio=0.2))
        rule = Text("Raqamning o'rni uning qiymatini belgilaydi", font_size=30, color=CREAM).to_edge(DOWN, buff=1.0)
        self.play(Write(rule))
        self.wait(1.8)
        self.play(FadeOut(VGroup(num, arrs, texts, rule)))

        # ===== 5. NOL O'RINNI SAQLAYDI: 305 =====
        cap2 = Text("Nol o'rinni saqlaydi", font_size=40, color=CREAM).to_edge(UP)
        self.play(FadeIn(cap2))
        n305 = Text("305", font_size=110, weight=BOLD)
        n305[0].set_color(GREEN); n305[1].set_color(DIM); n305[2].set_color(BLUE)
        n305.move_to(ORIGIN)
        self.play(Write(n305))
        zlab = Text("0 o'nlik — bo'sh, lekin o'rin saqlanadi", font_size=26, color=ORANGE)
        zlab.next_to(n305, DOWN, buff=0.6)
        box = SurroundingRectangle(n305[1], color=ORANGE, buff=0.12)
        self.play(Create(box), FadeIn(zlab))
        self.wait(1.6)
        self.play(FadeOut(VGroup(cap2, n305, zlab, box)))

        # ===== 6. SON O'QI: 345 (0-1000) =====
        nl = NumberLine(x_range=[0, 1000, 100], length=12, color=DIM)
        nl.move_to(DOWN * 0.4)
        nums = VGroup(*[
            Text(str(v), font_size=18, color=DIM).next_to(nl.n2p(v), DOWN, buff=0.22)
            for v in range(0, 1001, 200)
        ])
        nlcap = Text("345 ni son o'qida topamiz", font_size=32, color=CREAM).to_edge(UP)
        self.play(FadeIn(nlcap), Create(nl), FadeIn(nums))
        dot = Dot(nl.n2p(0), radius=0.13, color=GREEN)
        self.play(FadeIn(dot))
        for v in (100, 200, 300):
            self.play(dot.animate(path_arc=-PI * 0.7).move_to(nl.n2p(v)), run_time=0.45)
        self.play(dot.animate.set_color(ORANGE).move_to(nl.n2p(340)), run_time=0.5)
        self.play(dot.animate.set_color(BLUE).move_to(nl.n2p(345)), run_time=0.35)
        mark = Text("345", font_size=34, color=GREEN, weight=BOLD).next_to(nl.n2p(345), UP, buff=0.35)
        self.play(FadeIn(mark, shift=DOWN * 0.2))
        self.wait(1.4)
        self.play(FadeOut(VGroup(nl, nums, dot, mark, nlcap)))

        # ===== 7. YAKUN =====
        e1 = Text("10 o'nlik = 1 yuzlik", font_size=40, color=CREAM, weight=BOLD)
        e2 = Text("Yuzlik · O'nlik · Birlik — o'rin hal qiladi", font_size=28, color=GREEN)
        e2.next_to(e1, DOWN, buff=0.4)
        self.play(Write(e1))
        self.play(FadeIn(e2, shift=UP * 0.3))
        self.wait(2)
        self.play(FadeOut(VGroup(e1, e2)))
