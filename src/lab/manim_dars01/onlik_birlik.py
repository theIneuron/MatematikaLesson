"""
DEMO (izolyatsiya) — Grade2 Dars01 "O'nliklar va birliklar" ni MANIM (3b1b dvijoki)
bilan animatsion klip sifatida qayta tasavvur qilish. Etalon Dars01.jsx ga TEGMAYDI.
Manim Community Edition. LaTeX SHART EMAS (faqat Text/Pango ishlatiladi).

Render (past sifat, tez):
  python -m manim -ql src/lab/manim_dars01/onlik_birlik.py OnlikBirlik
Render (o'rta sifat):
  python -m manim -qm src/lab/manim_dars01/onlik_birlik.py OnlikBirlik

Manba matni: src/books/grade2/Dars01_CONTENT.md (yadro: 10 birlik = 1 o'nlik;
ikki xonali sonda chap raqam o'nliklar, o'ng birliklar; 34 = 30 + 4).
"""
from manim import *

ORANGE = "#fe5b1a"   # o'nlik (aksent)
BLUE = "#4a86ff"     # birlik
CREAM = "#F6F4EF"
DIM = "#A7A6A2"
BG = "#0a0e1a"


def unit_square(color=BLUE, s=0.44):
    return Square(side_length=s, color=color, fill_color=color, fill_opacity=0.9, stroke_width=1.6)


def ten_rod(s=0.4):
    """10 ta birlik-kvadrat vertikal ustun = bitta o'nlik tayoqchasi."""
    sqs = VGroup(*[unit_square(ORANGE, s) for _ in range(10)])
    sqs.arrange(UP, buff=0)
    return sqs


class OnlikBirlik(Scene):
    def construct(self):
        self.camera.background_color = BG

        # ============ 1. HOOK / SARLAVHA ============
        title = Text("O'nliklar va birliklar", font_size=54, color=CREAM, weight=BOLD)
        sub = Text("Sonda nechta o'nlik, nechta birlik borligini ko'ramiz",
                   font_size=24, color=ORANGE)
        sub.next_to(title, DOWN, buff=0.3)
        grp = VGroup(title, sub).move_to(ORIGIN)
        self.play(Write(title), run_time=1.2)
        self.play(FadeIn(sub, shift=UP * 0.3))
        self.wait(1.2)
        self.play(FadeOut(grp))

        # ============ 2. UNITIZING: 10 birlik -> 1 o'nlik ============
        cap = Text("10 birlik = 1 o'nlik", font_size=40, color=CREAM).to_edge(UP)
        self.play(FadeIn(cap))

        units = VGroup(*[unit_square(BLUE) for _ in range(10)])
        units.arrange(RIGHT, buff=0.14).move_to(ORIGIN)
        blbl = Text("10 birlik", font_size=28, color=BLUE).next_to(units, DOWN, buff=0.4)
        for u in units:
            self.play(FadeIn(u, scale=0.4), run_time=0.1)
        self.play(FadeIn(blbl))
        self.wait(0.6)

        # o'ntasi vertikal ustunga yig'iladi -> o'nlik tayoqchasi
        rod = ten_rod().move_to(ORIGIN)
        self.play(FadeOut(blbl))
        self.play(Transform(units, rod), run_time=1.3)
        olbl = Text("1 o'nlik", font_size=30, color=ORANGE, weight=BOLD).next_to(rod, RIGHT, buff=0.5)
        self.play(Write(olbl))
        self.wait(1.2)
        self.play(FadeOut(cap), FadeOut(units), FadeOut(olbl))

        # ============ 3. SONNI YIG'ISH: 34 = 30 + 4 ============
        rods = VGroup(*[ten_rod() for _ in range(3)]).arrange(RIGHT, buff=0.28)
        ones = VGroup(*[unit_square(BLUE) for _ in range(4)]).arrange(UP, buff=0.08)
        scene34 = VGroup(rods, ones).arrange(RIGHT, buff=0.9).move_to(LEFT * 2.4)

        self.play(LaggedStart(*[GrowFromCenter(r) for r in rods], lag_ratio=0.3), run_time=1.4)
        t30 = Text("3 o'nlik = 30", font_size=26, color=ORANGE).next_to(rods, DOWN, buff=0.4)
        self.play(FadeIn(t30))
        self.wait(0.4)
        self.play(LaggedStart(*[FadeIn(o, scale=0.4) for o in ones], lag_ratio=0.2), run_time=0.8)
        t4 = Text("4 birlik = 4", font_size=26, color=BLUE).next_to(ones, DOWN, buff=0.4)
        self.play(FadeIn(t4))
        self.wait(0.6)

        # katta son 34 = 30 + 4 (rang-kodli)
        num = Text("34", font_size=110, weight=BOLD)
        num[0].set_color(ORANGE)
        num[1].set_color(BLUE)
        num.move_to(RIGHT * 3.6 + UP * 0.6)
        eq = VGroup(
            Text("34", font_size=44, color=CREAM),
            Text("=", font_size=44, color=DIM),
            Text("30", font_size=44, color=ORANGE),
            Text("+", font_size=44, color=DIM),
            Text("4", font_size=44, color=BLUE),
        ).arrange(RIGHT, buff=0.22).next_to(num, DOWN, buff=0.6)
        self.play(Write(num))
        self.play(FadeIn(eq, shift=UP * 0.3))
        self.wait(1.4)
        self.play(FadeOut(rods), FadeOut(ones), FadeOut(t30), FadeOut(t4), FadeOut(eq),
                  num.animate.move_to(UP * 2.6).scale(0.7))

        # ============ 4. QOIDA: chap=o'nlik, o'ng=birlik ============
        three = num[0]
        four = num[1]
        # yorliqlar yon-yonga ajratiladi (ustma-ust tushmasin), strelka diagonal
        lab_l = Text("o'nliklar", font_size=30, color=ORANGE, weight=BOLD)
        lab_r = Text("birliklar", font_size=30, color=BLUE, weight=BOLD)
        lab_l.move_to(num.get_center() + DOWN * 1.7 + LEFT * 2.2)
        lab_r.move_to(num.get_center() + DOWN * 1.7 + RIGHT * 2.2)
        arr_l = Arrow(three.get_bottom() + DOWN * 0.08, lab_l.get_top() + UP * 0.08, color=ORANGE, buff=0.05, stroke_width=4)
        arr_r = Arrow(four.get_bottom() + DOWN * 0.08, lab_r.get_top() + UP * 0.08, color=BLUE, buff=0.05, stroke_width=4)
        self.play(GrowArrow(arr_l), FadeIn(lab_l))
        self.play(GrowArrow(arr_r), FadeIn(lab_r))
        rule = Text("Chap raqam — o'nliklar,  o'ng raqam — birliklar",
                    font_size=30, color=CREAM).to_edge(DOWN, buff=0.8)
        self.play(Write(rule))
        self.wait(1.6)
        self.play(FadeOut(VGroup(num, arr_l, arr_r, lab_l, lab_r, rule)))

        # ============ 5. SON O'QI: 34 (3 katta sakrash + 4 kichik qadam) ============
        # include_numbers=True LaTeX talab qiladi — o'rniga Text yorliqlarni qo'lda qo'yamiz
        nl = NumberLine(x_range=[0, 40, 10], length=11, color=DIM)
        nl.move_to(DOWN * 0.5)
        nl_nums = VGroup(*[
            Text(str(v), font_size=24, color=DIM).next_to(nl.n2p(v), DOWN, buff=0.25)
            for v in (0, 10, 20, 30, 40)
        ])
        nlcap = Text("34 ni son o'qida topamiz", font_size=34, color=CREAM).to_edge(UP)
        self.play(FadeIn(nlcap), Create(nl), FadeIn(nl_nums))
        dot = Dot(nl.n2p(0), radius=0.14, color=ORANGE)
        self.play(FadeIn(dot))
        # 3 katta sakrash (o'nlik)
        for v in (10, 20, 30):
            self.play(dot.animate(path_arc=-PI * 0.7).move_to(nl.n2p(v)), run_time=0.6)
            self.play(Flash(dot, color=ORANGE, line_length=0.15, num_lines=10), run_time=0.3)
        # 4 kichik qadam (birlik)
        for v in (31, 32, 33, 34):
            self.play(dot.animate.move_to(nl.n2p(v)), run_time=0.28)
        mark = Text("34", font_size=40, color=ORANGE, weight=BOLD).next_to(nl.n2p(34), UP, buff=0.4)
        self.play(FadeIn(mark, shift=DOWN * 0.2))
        self.wait(1.4)
        self.play(FadeOut(VGroup(nl, nl_nums, dot, mark, nlcap)))

        # ============ 6. YAKUN ============
        end = Text("10 birlik = 1 o'nlik", font_size=44, color=CREAM, weight=BOLD)
        end2 = Text("Chap — o'nliklar · O'ng — birliklar", font_size=30, color=ORANGE)
        end2.next_to(end, DOWN, buff=0.4)
        self.play(Write(end))
        self.play(FadeIn(end2, shift=UP * 0.3))
        self.wait(2)
        self.play(FadeOut(VGroup(end, end2)))
