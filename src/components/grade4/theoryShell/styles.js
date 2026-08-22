// 4-sinf nazariy darslarining umumiy uslublari. T — dars palitrasi.
export const buildTheoryStyles = (T) => `
.lesson-frame .preview-language{display:none!important}
@media(max-width:639.98px){.lesson-root [data-g4-role~="hook-scene"],.lesson-root [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px!important;border-radius:18px!important}}
.g4-title-card-placeholder{width:100%;min-height:116px}
.g4-title-card{position:relative;isolation:isolate;width:100%;min-height:116px;margin:0;padding:12px 82px 11px 67px;border-radius:17px;display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFF;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);box-shadow:0 28px 58px -27px rgba(22,143,163,.8);transform:translateY(-2px)}
.g4-title-card-medal{position:absolute;left:11px;top:50%;width:44px;height:44px;border:3px solid rgba(255,255,255,.58);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px;z-index:2}
.g4-title-card-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px;z-index:2;animation:g4-title-card-bit-float 2.8s ease-in-out 1 both}.g4-title-card-bit>svg,.g4-title-card-bit .bit,.g4-title-card-bit .g1-char{width:100%;height:100%}
.g4-title-card-kicker{position:relative;color:#A8EAF0;font:900 10px/1.2 'JetBrains Mono',monospace;letter-spacing:.13em;z-index:2}.g4-title-card-title{position:relative;margin:0!important;font:750 clamp(16px,2.2vw,21px)/1.05 'Source Serif 4',Georgia,serif;z-index:2}.g4-title-card-score{position:relative;align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10);z-index:2}.g4-title-card-score strong{color:#FFE284;font-family:'JetBrains Mono',monospace}.g4-title-card-score span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-card-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-card-confetti i{position:absolute;top:-16px;width:7px;height:12px;border-radius:2px;animation:g4-title-card-fall 2.4s linear 2 both}.g4-title-card-confetti i:nth-child(4n+1){background:#FFC23C}.g4-title-card-confetti i:nth-child(4n+2){background:#FF5B35}.g4-title-card-confetti i:nth-child(4n+3){background:#77E1EA}.g4-title-card-confetti i:nth-child(4n){background:#95C93D}.g4-title-card-confetti i:nth-child(1){left:8%;animation-delay:-.3s}.g4-title-card-confetti i:nth-child(2){left:17%;animation-delay:-1.1s}.g4-title-card-confetti i:nth-child(3){left:29%;animation-delay:-.7s}.g4-title-card-confetti i:nth-child(4){left:41%;animation-delay:-1.7s}.g4-title-card-confetti i:nth-child(5){left:52%;animation-delay:-.2s}.g4-title-card-confetti i:nth-child(6){left:63%;animation-delay:-1.3s}.g4-title-card-confetti i:nth-child(7){left:73%;animation-delay:-.8s}.g4-title-card-confetti i:nth-child(8){left:84%;animation-delay:-1.9s}.g4-title-card-confetti i:nth-child(9){left:12%;animation-delay:-2s}.g4-title-card-confetti i:nth-child(10){left:36%;animation-delay:-1.4s}.g4-title-card-confetti i:nth-child(11){left:68%;animation-delay:-.5s}.g4-title-card-confetti i:nth-child(12){left:91%;animation-delay:-1.6s}
.g4-title-reveal-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.8s ease both}.g4-title-reveal-card{position:relative;isolation:isolate;width:100%;min-height:100dvh;padding:36px 24px;border:0;border-radius:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;color:#FFF;text-align:center;background:radial-gradient(circle at 50% 50%,rgba(255,214,80,.17),transparent 31%)}.g4-title-reveal-card::after{content:'';position:absolute;z-index:0;top:50%;left:50%;width:min(440px,82vw);height:min(440px,82vw);border-radius:50%;background:radial-gradient(circle,rgba(255,222,105,.17),transparent 68%);transform:translate(-50%,-50%)}
.g4-title-reveal-rays{position:absolute;z-index:0;top:50%;left:50%;width:160vmax;height:160vmax;border-radius:50%;opacity:.28;background:repeating-conic-gradient(from -4deg,rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);transform:translate(-50%,-50%);animation:g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both,g4-title-reveal-rays-turn 26s linear .8s 1 both}.g4-title-reveal-medal{position:absolute;top:50%;left:50%;z-index:2;width:112px;height:112px;border:6px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);box-shadow:0 0 0 13px rgba(255,255,255,.09),0 0 54px 10px rgba(255,204,63,.38),0 22px 38px -18px rgba(0,0,0,.7);font-size:52px;animation:g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both}.g4-title-reveal-title{position:absolute;top:calc(50% + 82px);left:50%;z-index:2;width:min(680px,calc(100vw - 48px));margin:0!important;font:750 clamp(34px,5vw,58px)/1.02 'Source Serif 4',Georgia,serif;text-shadow:0 4px 24px rgba(0,0,0,.72);transform:translateX(-50%);animation:g4-title-reveal-title-in .7s ease .52s both}
.g4-title-reveal-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-reveal-confetti i{position:absolute;top:-20px;width:8px;height:14px;border-radius:2px;background:#FFE284;animation:g4-title-reveal-fall 2.4s linear 2 both}.g4-title-reveal-confetti i:nth-child(3n+2){background:#FF7050}.g4-title-reveal-confetti i:nth-child(3n){background:#77E1EA}
@keyframes g4-title-card-bit-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes g4-title-card-fall{to{transform:translateY(230px) rotate(460deg)}}@keyframes g4-title-reveal-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}@keyframes g4-title-reveal-medal-in{from{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-25deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}@keyframes g4-title-reveal-title-in{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}@keyframes g4-title-reveal-rays-in{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:.28;transform:translate(-50%,-50%) scale(1)}}@keyframes g4-title-reveal-rays-turn{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes g4-title-reveal-fall{to{transform:translateY(470px) rotate(560deg)}}
@media(max-width:639.98px){.g4-title-card-placeholder{min-height:88px}.g4-title-card{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}.g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}.g4-title-card-bit{width:57px;height:71px}.g4-title-card-title{font-size:14px}.g4-title-reveal-card{min-height:100dvh;padding:24px 18px}.g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}.g4-title-reveal-title{top:calc(50% + 62px);font-size:29px}}
.contract-final-reward{width:100%;min-width:0;min-height:116px;display:grid;align-content:center;gap:6px}.final-reflection{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button,.g4-title-claim{min-width:44px;min-height:44px;padding:5px 7px;border:0;border-radius:11px;cursor:pointer;color:${T.navy};background:${T.cyanSoft};font-size:9px;font-weight:900;line-height:1.2}.final-reflection button.selected{color:#fff;background:${T.success}}.g4-title-claim{width:100%;display:flex;align-items:center;justify-content:center;gap:7px;color:#fff;background:${T.accent}}.g4-title-claim:disabled{opacity:.42;cursor:not-allowed}
@media(prefers-reduced-motion:reduce){.g4-title-card,.g4-title-card-bit,.g4-title-reveal-overlay,.g4-title-reveal-rays,.g4-title-reveal-medal,.g4-title-reveal-title{animation:none!important}.g4-title-card{opacity:1;transform:none!important}.g4-title-card-confetti,.g4-title-reveal-confetti{display:none}.g4-title-reveal-overlay{opacity:1}.g4-title-reveal-rays{opacity:.28;transform:translate(-50%,-50%)}.g4-title-reveal-medal{opacity:1;transform:translate(-50%,-50%)}.g4-title-reveal-title{opacity:1;transform:translateX(-50%)}}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}.lesson-root button:focus-visible,.lesson-root input:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.lesson-root{position:fixed;inset:0;width:100%;min-height:100dvh;zoom:var(--g4z,1);color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:44px;height:44px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:12px;overflow:visible}.stage-nav{flex:0 0 auto;min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:48px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{display:grid;gap:12px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div{min-width:0}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif;overflow-wrap:anywhere}.heading .g1-char{width:68px;height:84px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:16px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:10px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.option{min-width:0;min-height:58px;padding:9px;border:0;border-radius:16px;display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option span{min-width:0;overflow-wrap:anywhere}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{min-height:54px;padding:9px 12px;border-radius:15px;visibility:hidden;display:grid;grid-template-columns:28px minmax(0,1fr);gap:9px;align-items:start;opacity:0;transform:translateY(6px)}.feedback.open{visibility:visible;opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{min-width:0;font-size:13px;line-height:1.4;overflow-wrap:anywhere}.caption{position:static;margin-top:10px;padding:8px 12px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}.stage-summary .stage-content{position:relative}.summary-happy-bit{position:absolute;right:14px;top:4px;width:58px;height:72px;z-index:2}.stage-summary .finale-heading{padding-right:78px}
.duel{display:grid;grid-template-columns:1fr 1fr;gap:12px;position:relative}.duel .best{grid-column:1/-1;display:flex;justify-content:center;align-items:center;gap:14px;color:${T.navy};font:900 18px 'JetBrains Mono',monospace}.duel .best b{color:${T.accent}}.bars-wrap{min-height:190px;position:relative;padding:12px 8px 8px}.bars-title{text-align:center;color:${T.navy};font-weight:900}.bars{height:150px;display:flex;align-items:flex-end;justify-content:center;gap:7px;border-bottom:2px solid rgba(23,59,82,.18)}.bar-col{width:min(42px,16%);height:140px;display:flex;align-items:flex-end}.bar{width:100%;min-height:22px;border-radius:10px 10px 4px 4px;display:grid;place-items:start center;padding-top:5px;color:#fff;background:linear-gradient(180deg,${T.cyan},${T.navy});transition:height .9s cubic-bezier(.16,1,.3,1)}.bar.equalized{background:linear-gradient(180deg,${T.lime},${T.success})}.bar b{font:900 11px 'JetBrains Mono',monospace}.target-line{position:absolute;left:7%;right:7%;height:2px;background:${T.accent};transition:.5s ease}.target-line span{position:absolute;right:0;bottom:5px;color:${T.accent};font:900 11px 'JetBrains Mono',monospace}.sum-badge.show,.mean-badge.show,.bridge.show,.show{opacity:1!important;transform:none!important}.sum-badge,.mean-badge{margin-top:8px;padding:10px 13px;border-radius:13px;opacity:.12;color:${T.navy};background:${T.cyanSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;transition:.4s ease}.mean-badge{color:${T.success};background:${T.successSoft}}.formula-flow{min-height:190px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}.formula-chip{padding:13px 15px;border-radius:15px;opacity:.12;transform:translateY(8px);color:${T.navy};background:${T.cyanSoft};font:900 clamp(15px,2.3vw,20px) 'JetBrains Mono',monospace;transition:.45s ease}.formula-flow i{opacity:.12;color:${T.accent};font:900 22px 'JetBrains Mono',monospace;font-style:normal;transition:.35s ease}.why-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.why-grid>div{min-height:170px;padding:18px;border-radius:18px;display:grid;place-items:center;gap:8px;opacity:.32;background:#F8F8F4}.why-grid>div.active{opacity:1}.why-grid s,.why-grid b{font:900 25px 'JetBrains Mono',monospace}.why-grid s{color:${T.warn}}.why-grid small{color:${T.ink2}}.why-grid .correct-tile{background:${T.successSoft};color:${T.success}}.compare-card{min-height:230px;display:grid;grid-template-columns:1fr 30px 1fr;align-items:center;gap:10px;text-align:center}.compare-card>div{padding:18px;border-radius:18px;display:grid;gap:8px;opacity:.12;background:${T.cyanSoft}}.compare-card span{color:${T.ink2};font-weight:800}.compare-card b{color:${T.navy};font:900 28px 'JetBrains Mono',monospace}.compare-card i{color:${T.accent};font-style:normal;font-weight:900}.compare-card>strong,.compare-card>p{grid-column:1/-1;opacity:.12}.compare-card>strong{color:${T.success};font:900 22px 'JetBrains Mono',monospace}.compare-card>p{font-weight:850}.rule-card{display:grid;gap:14px}.rule-formula{padding:16px;border-radius:16px;color:#fff;background:${T.navy};text-align:center;font:800 clamp(14px,2.3vw,19px) 'JetBrains Mono',monospace}.rule-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.rule-steps>div{min-height:90px;padding:11px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;opacity:.18;background:#F8F8F4}.rule-steps>div.active{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.2)}.rule-steps b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.accent};font:900 11px 'JetBrains Mono',monospace}.rule-steps span{font-size:12px;font-weight:800;line-height:1.35}.boundary{display:grid;gap:18px}.number-line{height:80px;position:relative;margin:15px 4%;border-top:4px solid ${T.navy}}.number-line span,.number-line b{position:absolute;top:-19px;transform:translateX(-50%);width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#fff;box-shadow:0 8px 18px -12px rgba(${T.shadowBase},.6);font:900 13px 'JetBrains Mono',monospace}.number-line b{opacity:.12;color:#fff;background:${T.accent}}.boundary>p{opacity:.12;color:${T.success};text-align:center;font-weight:850}.data-row{padding:14px;display:flex;justify-content:center;gap:8px}.data-row span{padding:12px 14px;border-radius:13px;color:${T.navy};background:${T.cyanSoft};font:900 17px 'JetBrains Mono',monospace}.input-row{display:flex;gap:10px}.answer-input{min-width:0;min-height:54px;flex:1;padding:10px 16px;border:0;border-radius:15px;outline:0;color:${T.navy};background:#F8F8F4;box-shadow:inset 0 0 0 2px rgba(135,148,157,.2);font:900 20px 'JetBrains Mono',monospace}.answer-input:focus{box-shadow:0 0 0 4px rgba(22,143,163,.14)}.answer-input.is-correct{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.3)}.answer-input.is-wrong{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.3)}.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace}.order-area{display:grid;gap:11px}.order-result{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;min-height:76px}.order-result>div{padding:10px;border-radius:14px;display:grid;grid-template-columns:25px 1fr;align-items:center;gap:7px;background:${T.cyanSoft};font-size:11px;font-weight:800}.order-result b{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.card-bank{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.card-bank button,.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;cursor:pointer;background:#F8F8F4;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.card-bank button:disabled{opacity:.35}.tiny-action{justify-self:end;color:${T.accent};background:${T.accentSoft}}.line-choice{padding:22px;display:flex;align-items:center;justify-content:center;gap:0}.line-choice span,.line-choice b{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;color:${T.navy};background:${T.cyanSoft};font:900 15px 'JetBrains Mono',monospace}.line-choice b{color:#fff;background:${T.accent}}.line-choice i{width:90px;height:4px;background:linear-gradient(90deg,${T.cyan},${T.accent})}.bit-error{padding:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.bit-error span{padding:9px;border-radius:12px;background:${T.cyanSoft};text-align:center;font:900 14px 'JetBrains Mono',monospace}.bit-error b{grid-column:1/-1;padding:12px;border-radius:13px;color:${T.warn};background:${T.warnSoft};text-align:center;font:900 17px 'JetBrains Mono',monospace}.passengers{padding:14px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.passengers>div{padding:12px;border-radius:15px;display:grid;gap:6px;text-align:center;background:${T.cyanSoft}}.passengers span{color:${T.ink3};font-size:11px}.passengers b{color:${T.navy};font:900 18px 'JetBrains Mono',monospace}.passengers strong{grid-column:1/-1;padding:11px;border-radius:13px;color:#fff;background:${T.navy};text-align:center;font:900 16px 'JetBrains Mono',monospace}.summary-grid{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:12px}.summary-formula{padding:16px;border-radius:16px;color:#fff;background:${T.navy};font:900 clamp(15px,2.4vw,20px) 'JetBrains Mono',monospace;text-align:center}.summary-rules{grid-template-columns:repeat(4,1fr)}.bridge{padding:13px 16px;border-radius:16px;display:grid;gap:4px;opacity:.15;color:#fff;background:${T.navy}}.bridge span{color:#9DE3E7;font-size:10px;font-weight:900;letter-spacing:.08em}.bridge strong{font:750 16px 'Source Serif 4',Georgia,serif}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 8px 20px -14px rgba(${T.shadowBase},.6)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;color:${T.ink2};background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFFFFF;background:${T.accent}}.g1-bit-ant{transform-origin:60px 28px;animation:antenna 2.1s ease-in-out 2}.g1-bit-wave,.bit-wave-left,.bit-wave-right,.bit-think-hand,.bit-point-arm,.bit-nod-hand{transform-origin:84px 76px;animation:think 1.7s ease-in-out 2}.bit-double-wave,.bit-awkward-hands,.bit-focus-hands{transform-origin:center;animation:happy 1.2s ease-in-out 2 alternate}.bit-idea-bulb,.bit-point-target,.bit-focus-scan,.bit-nod-check{animation:pulse 1.35s ease-in-out 2 alternate}
.finale-heading{min-width:0;padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{display:flex;align-items:center;gap:6px;color:${T.accent};font:900 9px/1.2 'JetBrains Mono',monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:${T.navy};font:750 clamp(21px,3vw,28px)/1.08 'Source Serif 4',Georgia,serif}.finale-heading p{margin-top:4px!important;color:${T.ink2};font-size:11px;line-height:1.35}
.finale-main{min-width:0;display:grid;grid-template-columns:minmax(260px,.92fr) minmax(300px,1.08fr);align-items:stretch;gap:10px}.finale-payoff{min-width:0;padding:11px 13px;border-radius:18px;display:grid;align-content:center;gap:7px;background:#fff;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.5)}.finale-payoff>small{color:${T.cyan};font-size:9px;font-weight:900;letter-spacing:.09em}.finale-bars .bars-wrap{min-height:148px;padding:0 4px}.finale-bars .bars{height:128px}.finale-bars .bar-col{height:122px}.finale-bars .bars-title{font-size:11px}.finale-mean-formula{min-width:0;padding:7px 9px;border-radius:11px;opacity:.14;transform:translateY(5px);color:${T.navy};background:${T.cyanSoft};text-align:center;font:900 10px/1.25 'JetBrains Mono',monospace;transition:.42s ease}.finale-comparison{min-width:0;display:grid;grid-template-columns:1fr 1fr auto;align-items:center;gap:5px;opacity:.14;transform:translateY(5px);transition:.42s ease}.finale-comparison span,.finale-comparison strong{min-width:0;padding:6px;border-radius:9px;text-align:center;font:850 9px/1.2 'JetBrains Mono',monospace}.finale-comparison span{color:${T.ink2};background:#F8F8F4}.finale-comparison span b{color:${T.navy}}.finale-comparison strong{color:${T.success};background:${T.successSoft}}
.finale-takeaways{min-width:0;display:grid;gap:6px}.finale-takeaway{min-width:0;min-height:40px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px minmax(0,1fr);align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:opacity .42s ease,transform .42s ease,background .42s ease}.finale-takeaway.show{opacity:1;transform:none;background:${T.cyanSoft}}.finale-takeaway b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 9px/1 'JetBrains Mono',monospace}.finale-takeaway span{min-width:0;color:${T.ink2};font-size:11px;font-weight:800;line-height:1.3;overflow-wrap:anywhere}
.finale-bottom{min-width:0;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(270px,.8fr);gap:10px}.finale-bridge{min-width:0;padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#fff;background:${T.navy};transition:.42s ease}.finale-bridge.show{opacity:1;transform:none}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px/1.3 'Source Serif 4',Georgia,serif}
.finale-reward{min-width:0;min-height:100px;position:relative;overflow:hidden;padding:12px 72px 11px 58px;border-radius:17px;display:grid;align-content:center;color:#fff;background:linear-gradient(135deg,#234B62,${T.navy});box-shadow:0 17px 34px -27px rgba(${T.shadowBase},.74);transition:filter .45s ease,box-shadow .45s ease}.finale-reward:not(.complete){filter:saturate(.72)}.finale-reward.complete{box-shadow:0 17px 36px -22px rgba(149,201,61,.72)}.finale-medal{position:absolute;left:11px;top:50%;width:38px;height:38px;border:3px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:${T.navy};background:${T.lime};font-size:17px;font-weight:900}.finale-reward-copy{min-width:0;display:grid;gap:3px}.finale-reward-copy>small{color:#98E1E5;font-size:8px;font-weight:900;letter-spacing:.09em}.finale-reward-copy>strong{font:750 15px/1.15 'Source Serif 4',Georgia,serif}.finale-status{min-width:0;display:flex;align-items:center;gap:6px}.finale-status b{flex:none;color:#FFE284;font:900 11px/1 'JetBrains Mono',monospace}.finale-status span{min-width:0;color:rgba(255,255,255,.72);font-size:8px;line-height:1.2}.finale-reward-bit{position:absolute;right:2px;bottom:-4px;width:68px;height:86px}.finale-reward-bit .g1-char{width:100%;height:100%}.finale-reward.complete .finale-reward-bit{animation:happy 2.8s ease-in-out 2 alternate}.finale-confetti{position:absolute;inset:0;pointer-events:none}.finale-confetti i{position:absolute;top:-12px;width:5px;height:9px;border-radius:2px;background:#FFC23C;animation:finaleFall 2.8s linear 2}.finale-confetti i:nth-child(2n){background:${T.accent}}.finale-confetti i:nth-child(3n){background:#77E1EA}.finale-confetti i:nth-child(1){left:9%;animation-delay:-.2s}.finale-confetti i:nth-child(2){left:22%;animation-delay:-1.1s}.finale-confetti i:nth-child(3){left:35%;animation-delay:-.7s}.finale-confetti i:nth-child(4){left:48%;animation-delay:-1.8s}.finale-confetti i:nth-child(5){left:61%;animation-delay:-.4s}.finale-confetti i:nth-child(6){left:73%;animation-delay:-1.4s}.finale-confetti i:nth-child(7){left:84%;animation-delay:-.9s}.finale-confetti i:nth-child(8){left:93%;animation-delay:-2s}@keyframes finaleFall{to{transform:translateY(118px) rotate(180deg)}}
@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes antenna{50%{transform:rotate(5deg)}}@keyframes think{50%{transform:rotate(-5deg) translateY(-2px)}}@keyframes happy{to{transform:translateY(-3px)}}@keyframes pulse{to{transform:scale(1.06)}}
.stage-hook .duel{background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%)}
.stage-hook .duel .bars-title,.stage-hook .duel .best{color:#EAF9FB}
@media(max-width:639.98px){.stage-header{padding-top:60px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:68px}.heading h1{font-size:26px}.heading .g1-char{width:66px;height:82px}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.duel,.summary-grid{grid-template-columns:1fr}.bars-wrap{min-height:166px}.bars{height:126px}.bar-col{height:118px}.bar{transform:scaleY(.82);transform-origin:bottom}.why-grid{grid-template-columns:1fr}.compare-card{grid-template-columns:1fr 24px 1fr}.rule-steps,.summary-rules{grid-template-columns:1fr}.rule-steps>div{min-height:55px}.formula-flow{min-height:145px}.order-result{grid-template-columns:1fr}.input-row{flex-direction:column}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.passengers{grid-template-columns:1fr 1fr 1fr}}
@media(max-width:639.98px){.stage-hook .stack{gap:10px}.stage-hook .duel{grid-template-columns:1fr 1fr;gap:8px}.stage-hook .duel .bars-wrap{min-height:125px;padding:2px 2px 0}.stage-hook .duel .bars{height:106px;gap:4px}.stage-hook .duel .bar-col{height:100px}.stage-hook .duel .best{gap:8px;font-size:14px}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.formula-chip,.formula-flow i,.sum-badge,.mean-badge,.compare-card>div,.compare-card>strong,.compare-card>p,.boundary>p,.number-line b,.bridge{opacity:1!important;transform:none!important}}
@media(max-width:639.98px){.finale-heading{padding:9px 11px}.finale-heading h1{font-size:21px}.finale-heading p{font-size:9px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-payoff{padding:9px 11px}.finale-bars .bars-wrap{min-height:135px}.finale-bars .bars{height:115px}.finale-bars .bar-col{height:110px}.finale-comparison{grid-template-columns:1fr 1fr}.finale-comparison strong{grid-column:1/-1}.finale-takeaway{min-height:38px;padding:6px 8px}.finale-reward{min-height:92px;padding:10px 62px 9px 51px}.finale-medal{left:9px;width:34px;height:34px}.finale-reward-bit{width:58px;height:74px}.finale-reward-copy>strong{font-size:14px}}
@media(max-width:639.98px){.stage-summary .stack{gap:9px}.stage-summary .finale-heading{padding:7px 9px}.stage-summary .finale-heading p{font-size:8.5px;line-height:1.25}.stage-summary .finale-main,.stage-summary .finale-bottom{gap:8px}.stage-summary .finale-payoff{padding:7px 9px;gap:5px}.stage-summary .finale-bars .bars-wrap{min-height:105px}.stage-summary .finale-bars .bars{height:88px}.stage-summary .finale-bars .bar-col{height:84px}.stage-summary .finale-bars .bar{transform:scaleY(.68)}.stage-summary .finale-mean-formula{padding:5px 7px}.stage-summary .finale-comparison{gap:4px}.stage-summary .finale-comparison span,.stage-summary .finale-comparison strong{padding:4px}.stage-summary .finale-takeaways{gap:4px}.stage-summary .finale-takeaway{min-height:34px;padding:4px 7px;grid-template-columns:25px minmax(0,1fr);gap:6px}.stage-summary .finale-takeaway b{width:24px;height:24px}.stage-summary .finale-takeaway span{font-size:10px;line-height:1.22}.stage-summary .finale-bridge{padding:8px 11px}.stage-summary .finale-bridge strong{font-size:13px}.stage-summary .finale-reward{min-height:80px;padding:8px 56px 7px 47px}.stage-summary .finale-medal{left:8px;width:30px;height:30px}.stage-summary .finale-reward-bit{width:52px;height:66px}.stage-summary .finale-reward-copy>strong{font-size:13px}.stage-summary .finale-status span{font-size:7.5px}}
@media(max-width:639.98px){.stage-content{padding-top:7px;padding-bottom:7px}.heading{min-height:60px}.heading .g1-char{width:54px;height:68px}.stack{gap:8px}.input-row{flex-direction:row}.feedback{min-height:50px;padding:7px 9px}.stage-nav{min-height:58px}.stage-summary .finale-heading{padding-right:68px}.summary-happy-bit{right:9px;width:52px;height:66px}}
@media(prefers-reduced-motion:reduce){.finale-takeaway,.finale-mean-formula,.finale-comparison,.finale-bridge{opacity:1!important;transform:none!important}}
.stage-content{position:relative;overflow:hidden!important;padding-bottom:10px!important}.stage-body{height:100%;min-height:0;overflow:visible}.caption.caption-slot{position:absolute;left:clamp(14px,5vw,48px);right:clamp(14px,5vw,48px);bottom:5px;width:auto;max-width:none;min-height:40px;margin:0;display:grid;place-items:center;visibility:hidden;opacity:0;pointer-events:none}.caption.caption-slot.visible{visibility:visible;opacity:1}.activity-slot{min-height:48px;margin-top:7px;display:flex;align-items:center;justify-content:center;gap:6px}.activity-slot button{min-height:44px;padding:7px 12px;border:0;border-radius:13px;color:${T.cyan};background:${T.cyanSoft};font-weight:900;cursor:pointer}.activity-slot button.selected{color:#fff;background:${T.success}}.finale-reflection{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.finale-reflection button{min-width:0;font-size:11px}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed;transform:none}.lesson-root,.stage,.stage-content{overflow:hidden;overscroll-behavior:none}.stage-body{overscroll-behavior:none}@media(max-width:390px){.caption.caption-slot{left:14px;right:14px}.finale-reflection button{padding:5px 6px;font-size:9px}}@media(max-height:700px){.stage-header{padding-top:7px;padding-bottom:5px}.stage-content{padding-top:5px!important}.stack{gap:7px}.heading{min-height:54px}.heading h1{font-size:23px}.heading .g1-char{width:50px;height:62px}.activity-slot{margin-top:4px}.stage-nav{min-height:56px}.stage-hook .heading{min-height:46px}.stage-hook .heading .g1-char{width:42px;height:52px}.stage-hook .bars-wrap{min-height:88px;padding-block:2px}.stage-hook .bars{height:72px}.stage-hook .bar-col{height:68px}.stage-hook .best{gap:6px;font-size:12px}.stage-hook .question{padding:8px;gap:5px}.stage-hook .question h2{font-size:15px}.stage-hook .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.stage-hook .option{min-height:64px;padding:6px;grid-template-columns:22px minmax(0,1fr);gap:4px;font-size:11px}.stage-hook .option>b{width:22px;height:22px}.stage-hook .feedback{min-height:44px;padding:5px 7px}.why-grid{grid-template-columns:1fr 1fr}.why-grid>div{min-height:120px;padding:10px}}
.sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;border:0!important}
@media(min-width:640px){.stage-hook .stack{grid-template-columns:minmax(0,1fr) minmax(310px,1fr);gap:10px;align-items:start}.stage-hook .heading{grid-column:1/-1;min-height:66px}.stage-hook .duel{align-self:stretch}.stage-hook .bars-wrap{min-height:135px;padding-block:5px}.stage-hook .bars{height:104px}.stage-hook .bar-col{height:98px}.stage-hook .question{align-self:stretch}.stage-hook .option{min-height:50px}.stage-hook .feedback{min-height:48px;padding:6px 8px}}
@media(min-width:640px) and (max-width:1100px){.stage-hook .heading{min-height:58px}.stage-hook .heading h1{font-size:28px}.stage-hook .heading .g1-char{width:54px;height:66px}.stage-hook .bars-wrap{min-height:118px}.stage-hook .bars{height:90px}.stage-hook .bar-col{height:84px}}
@media(min-width:361px) and (max-width:639px){.stage-summary .stack{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:7px}.stage-summary .finale-heading{grid-column:1/-1}.stage-summary .finale-main,.stage-summary .finale-bottom{grid-template-columns:1fr;gap:6px}.stage-summary .finale-bars .bars-wrap{min-height:92px}.stage-summary .finale-bars .bars{height:74px}.stage-summary .finale-bars .bar-col{height:70px}.stage-summary .finale-takeaway{min-height:32px}.stage-summary .finale-bridge{padding:7px 9px}.stage-summary .contract-final-reward{min-height:96px}}
@media(min-width:361px) and (max-width:639px){.stage-summary .stage-content{padding-top:3px!important}.stage-summary .stack{gap:4px}.stage-summary .finale-heading{padding:5px 8px}.stage-summary .finale-heading p{font-size:8px}.stage-summary .finale-main,.stage-summary .finale-bottom{gap:4px}.stage-summary .finale-payoff{padding:5px 7px;gap:3px}.stage-summary .finale-bars .bars-wrap{min-height:78px}.stage-summary .finale-bars .bars{height:62px}.stage-summary .finale-bars .bar-col{height:58px}.stage-summary .finale-mean-formula,.stage-summary .finale-comparison span,.stage-summary .finale-comparison strong{padding:3px 4px}.stage-summary .finale-takeaway{min-height:28px;padding:3px 5px}.stage-summary .finale-takeaway span{font-size:8.5px}.stage-summary .finale-bridge{padding:5px 7px}.stage-summary .finale-bridge strong{font-size:11px}.stage-summary .contract-final-reward{min-height:88px}.stage-summary .final-reflection button,.stage-summary .g4-title-claim{min-height:44px}}
.sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;border:0!important}
@media(max-width:390px) and (max-height:700px){
  .heading{position:relative}.heading>div{width:100%;padding-right:44px}.heading>.g1-char{position:absolute;right:0;top:50%;transform:translateY(-50%)}
  .question{padding:8px!important;gap:5px}.question h2{font-size:15px}.options{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px}.option{min-height:60px;padding:5px;grid-template-columns:20px minmax(0,1fr);gap:4px;font-size:11px;line-height:1.25}.option>b{width:20px;height:20px}.feedback{min-height:50px;padding:5px 7px}.feedback p{font-size:11.5px;line-height:1.3}.feedback-bit{width:28px;height:34px;display:block}.feedback-bit .g1-char{width:28px;height:34px}
  .stage-hook .duel{padding:7px!important;grid-template-columns:1fr 1fr!important;grid-template-rows:72px 16px;align-items:start;gap:6px}.stage-hook .duel .bars-wrap{height:72px;min-height:0!important;padding:0!important;contain:size}.stage-hook .duel .bars{height:48px!important}.stage-hook .duel .bar-col{height:44px!important}.stage-hook .duel .bar{transform:scaleY(.36)!important}.stage-hook .duel .bar b{transform:scaleY(2.777)}.stage-hook .duel .best{font-size:12px}.stage-hook .option{min-height:64px!important;padding:4px!important;grid-template-columns:18px minmax(0,1fr)!important;gap:3px!important}.stage-hook .option>b{width:18px!important;height:18px!important}.stage-hook .feedback{height:64px;min-height:64px!important}.stage-hook .feedback p{font-size:11px}
  .model-card{padding:8px!important}.model-card .bars-wrap{height:108px;min-height:0!important;padding:1px 3px!important;contain:size}.model-card .bars{height:82px!important}.model-card .bar-col{height:78px!important}.model-card .bar{transform:scaleY(.55)!important}.model-card .bar b{transform:scaleY(1.818)}.model-card .target-line{bottom:69px!important}.sum-badge,.mean-badge{margin-top:4px;padding:6px 8px;font-size:12px}
  .data-row{padding:7px;gap:4px}.data-row span{padding:8px 7px;font-size:14px}.formula-flow{min-height:76px!important;gap:5px}.formula-chip{padding:8px 9px;font-size:13px}.formula-flow i{font-size:17px}.why-grid>div{min-height:92px!important;padding:8px}.compare-card{min-height:140px;padding:9px!important;gap:5px}.compare-card>div{padding:9px}.compare-card b{font-size:22px}.rule-card{padding:9px!important;gap:7px}.rule-formula{padding:9px;font-size:12px}.rule-steps{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px}.rule-steps>div{min-height:72px;padding:6px;grid-template-columns:23px minmax(0,1fr);gap:4px}.rule-steps b{width:22px;height:22px}.rule-steps span{font-size:10.5px;line-height:1.25}.boundary{padding:9px!important;gap:7px}.number-line{height:48px;margin:10px 4%}.boundary>p{font-size:12px}
  .order-area{gap:6px}.order-result{grid-template-columns:repeat(3,minmax(0,1fr))!important;min-height:58px;gap:4px}.order-result>div{padding:6px;grid-template-columns:20px minmax(0,1fr);gap:4px;font-size:10px}.order-result b{width:20px;height:20px}.card-bank{gap:5px}.card-bank button,.tiny-action{min-height:44px;padding:6px 8px;font-size:10.5px}.input-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px}.input-row .compact{min-width:96px;padding-inline:9px}.answer-input{min-height:50px;padding:8px 10px}.proof{padding:8px;font-size:12px}
  .line-choice{padding:8px}.line-choice span,.line-choice b{width:44px;height:44px}.line-choice i{width:auto;min-width:0;flex:1}.bit-error{padding:7px;gap:4px}.bit-error span{padding:6px;font-size:12px}.bit-error b{padding:8px;font-size:13px}.passengers{padding:7px;gap:5px}.passengers>div{padding:7px}.passengers b{font-size:15px}.passengers strong{padding:7px;font-size:13px}
  .stage-summary .stack{gap:6px}.stage-summary .finale-heading{padding:6px 8px 6px!important}.stage-summary .finale-heading h1{font-size:18px}.stage-summary .finale-heading p{font-size:8.5px}.stage-summary .finale-main{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)!important;gap:6px}.stage-summary .finale-bottom{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)!important;gap:6px}.stage-summary .finale-payoff{padding:6px!important;gap:4px}.stage-summary .finale-bars .bars-wrap{height:72px;min-height:0!important;padding:0;contain:size}.stage-summary .finale-bars .bars{height:52px!important}.stage-summary .finale-bars .bar-col{height:48px!important}.stage-summary .finale-bars .bar{transform:scaleY(.4)!important}.stage-summary .finale-bars .bar b{transform:scaleY(2.5)}.stage-summary .finale-mean-formula{font-size:9px}.stage-summary .finale-comparison{font-size:9px}.stage-summary .finale-takeaway{min-height:40px;padding:4px 5px;grid-template-columns:22px minmax(0,1fr);gap:4px}.stage-summary .finale-takeaway b{width:22px;height:22px}.stage-summary .finale-takeaway span{font-size:9px}.stage-summary .finale-bridge{padding:7px 8px}.stage-summary .finale-bridge strong{font-size:11px}.contract-final-reward{min-height:100px;gap:4px}.final-reflection{grid-template-columns:repeat(2,minmax(0,1fr))}.final-reflection button,.g4-title-claim{min-height:44px;font-size:9px}
}
.hook-scene-shell{min-width:0;max-width:100%;height:100%;overflow:hidden;border-radius:24px}[data-g4-role="visual-frame"]{position:relative;isolation:isolate;max-width:100%;height:100%;overflow:hidden;color:#EAF9FB;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}[data-g4-role="visual-frame"] :is(img,svg,canvas,video){display:block;max-width:100%;max-height:100%}[data-g4-role="visual-frame"] :is(img,video){width:100%;height:100%;object-fit:contain}.hook-frame-bit{position:absolute;right:5px;bottom:-7px;z-index:4;width:70px;height:88px;display:block;overflow:hidden}.hook-frame-bit>.g1-char,.hook-frame-bit>svg{width:100%;height:100%}.feedback-bit{width:46px;height:58px;display:block;align-self:end;overflow:hidden}.feedback-bit>.g1-char,.feedback-bit>svg{width:100%;height:100%}
[data-g4-role="hook-title"],[data-g4-role="hook-question"]{width:100%;text-align:left}[data-g4-role="hook-title"]{font:650 clamp(26px,4.2vw,36px)/1.08 'Source Serif 4',Georgia,serif;letter-spacing:-.012em}[data-g4-role="hook-question"]{font:750 clamp(17px,2.5vw,21px)/1.3 Manrope,system-ui,sans-serif}
@media(max-width:639.98px){.hook-scene-shell{border-radius:18px}.hook-frame-bit{right:3px;bottom:-5px;width:58px;height:73px}[data-g4-role="hook-title"]{font-size:25px}}
.lesson-root{font-family:'Manrope',system-ui,sans-serif}.lesson-root h1{font-family:'Source Serif 4',Georgia,serif}.lesson-root .question h2{font-family:'Manrope',system-ui,sans-serif}.screen-count,[class*="formula"],[class*="equation"],[class*="proof-label"]{font-family:'JetBrains Mono',monospace}.lead,.heading>div>span{font-size:clamp(14px,1.8vw,16px)}
[data-g4-role="hook-scene"]{width:min(760px, 100%);min-width:0;margin-inline:auto}[data-g4-role="visual-frame"]{position:relative;isolation:isolate;width:100%;min-width:0;min-height:206px;border-radius:24px;overflow:hidden;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}[data-g4-role="hook-bit"]{right:42px!important;bottom:-4px!important;width:88px!important;height:110px!important}[data-g4-role="hook-bit"]>.g1-char,[data-g4-role="hook-bit"]>svg{width:100%!important;height:100%!important}
[data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;grid-template-columns:62px minmax(0,1fr)}[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]{width:62px;height:76px}[data-g4-feedback="solution"]{min-height:72px;padding:7px 12px 7px 6px;border-radius:15px;background:linear-gradient(135deg,#FFFFFF,#E7F3EC);box-shadow:inset 4px 0 #227A53}[data-g4-feedback="solution"] [data-g4-role="feedback-bit"]{width:51px;height:64px}[data-g4-feedback="wrong"]{background:linear-gradient(135deg,#FFFFFF,#FFF5D9);box-shadow:inset 4px 0 #A96F13}[data-g4-role~="bit-answer-comment"] p{font:700 clamp(15px,2vw,18px)/1.35 'Source Serif 4',Georgia,serif}
@media(max-width:639.98px){[data-g4-role="visual-frame"]{min-height:164px;border-radius:18px}[data-g4-role="hook-bit"]{right:12px!important;bottom:-7px!important;width:68px!important;height:85px!important}[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]{width:54px;height:68px}[data-g4-feedback="solution"] [data-g4-role="feedback-bit"]{width:47px;height:59px}}
.lesson-root [data-g4-role~="hook-title"]{font-size:clamp(26px,4.2vw,36px);font-family:'Source Serif 4',Georgia,serif}
.lesson-root [data-g4-role~="hook-question"]{font-size:clamp(17px,2.5vw,21px);font-family:'Manrope',system-ui,sans-serif}
.lesson-root [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{width:100%;min-height:206px;border-radius:24px;overflow:hidden}
.lesson-root [data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;grid-template-columns:62px minmax(0,1fr)}
.lesson-root [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:62px;height:76px}
.lesson-root [data-g4-feedback="solution"]{min-height:72px;padding:7px 12px 7px 6px;border-radius:15px;grid-template-columns:51px minmax(0,1fr);background:linear-gradient(135deg,#FFFFFF,#E7F3EC)}
.lesson-root [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:51px;height:64px}
.lesson-root [data-g4-feedback="wrong"]{background:linear-gradient(135deg,#FFFFFF,#FFF5D9)}
.lesson-root .summary-happy-bit[data-g4-role~="visual-frame"]{position:absolute;isolation:isolate;min-width:0;max-width:100%;overflow:hidden}
@media(max-width:639.98px){.lesson-root [data-g4-role~="hook-title"]{font-size:25px}.lesson-root [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}.lesson-root [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:54px;height:68px}.lesson-root [data-g4-feedback="solution"]{min-height:68px}.lesson-root [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:47px;height:59px}}
.lesson-root .stage-hook .hook-layout{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto auto auto auto!important;align-content:start!important;gap:10px!important}
.lesson-root .stage-hook .hook-layout>.heading,.lesson-root .stage-hook .hook-layout>[data-g4-role~="hook-question"],.lesson-root .stage-hook .hook-layout>[data-g4-role~="hook-scene"],.lesson-root .stage-hook .hook-layout>.question{grid-column:1!important;position:relative!important;inset:auto!important;width:100%!important;margin:0!important}
.lesson-root [data-g4-screen="hook"]{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto auto auto auto!important;align-content:start!important;gap:10px!important}
.lesson-root [data-g4-screen="hook"]>.heading,.lesson-root [data-g4-screen="hook"]>[data-g4-role~="hook-question"],.lesson-root [data-g4-screen="hook"]>.question{grid-column:1!important;position:relative!important;inset:auto!important;width:100%!important;margin:0!important}
.lesson-root [data-g4-screen="hook"]>[data-g4-role~="hook-scene"]{grid-column:1!important;position:relative!important;inset:auto!important;width:min(760px,100%)!important;margin:0 auto!important}
.lesson-root .stage-hook .feedback[aria-hidden="true"]{display:none!important}
.lesson-root .stage-hook .question:has(.feedback[aria-hidden="false"]) .options{display:none!important}
@media(max-width:639.98px){.lesson-root .stage-hook .hook-layout,.lesson-root [data-g4-screen="hook"]{gap:6px!important}.lesson-root .stage-hook .heading{min-height:52px!important}.lesson-root .stage-hook [data-g4-role~="hook-title"]{font-size:25px!important}.lesson-root .stage-hook .question{padding:7px!important;gap:6px!important}.lesson-root .stage-hook .option{min-height:44px!important}}
/* ===== Etalon dizayn tizimi bo'yicha qo'shimchalar ===== */

/* Mobil: maket 390 px kenglikda tuziladi va butunlay masshtablanadi.
   Etalon Dars01 bilan bir xil mexanizm (mobileZoom.js, fitHeight:false). */
@media(max-width:639.98px){
  .lesson-root{width:390px}
}

/* Dars mavzusi chipi — etalonda hook ekranida eyebrow o'rnida shu turadi. */
.topic-chip{
  display:inline-block;padding:5px 11px;border-radius:999px;
  font:800 11px/1.1 'Manrope',system-ui,sans-serif;letter-spacing:.09em;text-transform:uppercase;
  color:${T.cyan};background:${T.cyanSoft};box-shadow:0 0 0 1px rgba(22,143,163,.13)
}

/* Tayyorlik signali: ekran haqiqatan bajarilganda tugma etalondagidek
   to'q sariq bo'lib pulslanadi. Tugma bloklanmaydi — faqat holatni bildiradi. */
.btn-ready{color:#FFFFFF!important;background:${T.accent}!important;
  box-shadow:0 12px 28px -12px rgba(255,91,53,.65)!important;animation:g4-ready-pulse 1.6s ease-in-out 3}
@keyframes g4-ready-pulse{50%{transform:scale(1.035);box-shadow:0 14px 32px -10px rgba(255,91,53,.68)}}
@media(prefers-reduced-motion:reduce){.btn-ready{animation:none}}

/* Ovoz ketayotganda javob variantlari qulflangani ko'rinib turadi. */
.options.is-locked .option{opacity:.5;cursor:not-allowed}

/* Feedback sarlavhasi va matni orasida ajratuvchi. */
.feedback-label{display:block;margin-bottom:3px}
.feedback-text{display:block}

/* Mashq ekranlarining kichik chizmasi. Balandlik kenglik orqali cheklanadi:
   aspect-ratio saqlanadi, shuning uchun 3x2 to'rtburchak 3x2 bo'lib qoladi.
   max-height bilan cheklash figurani cho'zib yuborardi. overflow ham kesilmaydi,
   chunki tomon yozuvlari chegara ustida absolute joylashgan. */
.compact-visual{padding:8px 12px;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap}
.compact-visual .shape-model{min-height:0;padding:10px 24px}
.compact-visual .rect-shape{width:min(150px,46%);min-width:118px}
@media(max-width:639.98px){
  .compact-visual{padding:6px 10px;gap:10px}
  .compact-visual .shape-model{padding:8px 20px}
  .compact-visual .rect-shape{width:min(128px,44%);min-width:104px}
}

/* Raqamli kiritish: 44 px minimal tap zonasi. */
.answer-input{min-height:48px}
.btn-white-accent.compact{min-height:48px}

/* Ekran ichida vertikal taqsimot: tana qolgan joyni oladi, izoh qatori pastda
   qoladi. Ilgari .stage-body height:100% bo'lib, caption bilan birga
   .stage-content dan chiqib ketardi. */
.stage-content{display:flex;flex-direction:column;min-height:0}
.stage-body{flex:1 1 auto;height:auto;min-height:0;display:flex;flex-direction:column;gap:0}
.stage-body>.stack{flex:0 1 auto;min-height:0}
.caption-slot{flex:0 0 auto}
/* Model tekshirish tugmasi doim kartadan keyin, alohida qatorda turadi. */
.activity-slot{flex:0 0 auto;width:100%}

/* Ustun sarlavhasi ustunlar ustiga tushmasligi uchun alohida qatorga chiqadi. */
.bars-wrap{display:flex;flex-direction:column;gap:6px}
.bars-title{position:static!important;order:-1;padding-bottom:2px}
/* Bit chizmani yopib qo'ymaydi. */
.duel .hook-frame-bit{position:absolute;right:6px;bottom:6px;width:44px;pointer-events:none;opacity:.92}
@media(max-width:639.98px){.duel .hook-frame-bit{width:34px;right:4px;bottom:4px}}
/* Son o'qidagi noma'lum nuqta: javob emas, savol belgisi. */
.line-choice .line-unknown{
  min-width:34px;padding:3px 9px;border-radius:999px;
  color:${T.accent};background:${T.accentSoft};
  box-shadow:0 0 0 2px rgba(255,91,53,.22);font-weight:800
}

/* Zoom qatlami bilan birga balandlik ham to'g'rilanadi: .stage ichida 100dvh
   viewport balandligini beradi, keyin zoom uni kichraytirardi va ekran pastida
   bo'sh joy qolardi. Zoomga bo'lish ekranni to'liq egallashni ta'minlaydi va
   qisqa telefonlarda qo'shimcha vertikal joy beradi. */
.lesson-root{min-height:calc(100dvh / var(--g4z, 1))}
.stage{height:calc(100dvh / var(--g4z, 1))}

/* Qisqa ekranlarda vertikal ritm siqiladi, lekin hech narsa yashirilmaydi:
   izoh qatori ham qoladi (ovoz o'chirilganda matn shu yerda ko'rinadi). */
@media(max-height:700px){
  .stack{gap:7px!important}
  .heading{min-height:42px!important}
  .compact-visual{padding:4px 8px!important;gap:8px!important}
  .compact-visual .shape-model{padding:4px 14px!important;min-height:0!important}
  .option{min-height:44px!important;padding:6px 8px!important}
  .feedback{min-height:40px!important;padding:5px 8px!important}
  .caption.caption-slot{min-height:0!important;font-size:10px!important}
}

/* ===== Qobiq qo'shgan elementlar ===== */

/* Tartibga qo'yish mashqi: tuzilgan tartib va gaplar banki alohida freymlarda
   (methodist talabi). Ilgari ikkisi bir uyumda turardi. */
.order-frame,.bank-frame{
  padding:9px 11px 10px;border-radius:15px;
  display:flex;flex-direction:column;gap:6px;
  background:rgba(255,255,255,.72);box-shadow:inset 0 0 0 1px rgba(80,97,109,.10)
}
.bank-frame{background:rgba(229,245,246,.5);box-shadow:inset 0 0 0 1px rgba(22,143,163,.16)}
.order-frame-label,.bank-frame-label{
  font:800 9.5px/1.1 'Manrope',system-ui,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:${T.ink3}
}
.bank-frame-label{color:${T.cyan}}
.order-result>div.is-empty{opacity:.5;border-style:dashed}
.order-result>div.is-empty span{min-height:14px}
@media(max-width:639.98px){
  .order-frame,.bank-frame{padding:7px 9px 8px;gap:5px;border-radius:13px}
  .order-frame-label,.bank-frame-label{font-size:9px}
}

/* multi — bir nechta javobni belgilash. Belgilangan variant to'ldirilgan
   holatda ko'rinadi, katakcha ishlatilmaydi (3-sinf kanoni §3.3). */
.options-multi .option[aria-pressed="true"]{
  box-shadow:0 0 0 2px ${T.cyan} inset,0 10px 24px -17px rgba(${T.shadowBase},.44)
}
.check-wide{width:100%;justify-content:center;margin-top:2px}

/* Unvon freymi: ilgari o'ng tomoni yuvilib ketgan och-yashil tumanga
   aylanardi va Bit fonga singib ketardi. Endi butun karta bir xil to'q navy,
   iliq nur faqat medal ortida qoladi. */
.g4-title-card{
  background:
    radial-gradient(circle at 12% 50%,rgba(255,194,60,.30),transparent 34%),
    linear-gradient(104deg,${T.navy} 0%,#123449 58%,#0E2C3E 100%)!important
}
.g4-title-card-bit{opacity:.96;filter:drop-shadow(0 6px 14px rgba(0,0,0,.35))}

/* ===== Interaktiv tushuntirish chizmalari (Dars15) ===== */
.board-title{font:800 10px/1.1 'Manrope',system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:rgba(234,249,251,.78);text-align:center}
.bar-board{display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 14px}
.bar-board .bars{display:flex;align-items:flex-end;justify-content:center;gap:8px;min-height:118px}
.bar-btn{
  width:38px;min-height:26px;padding:0;border:0;border-radius:9px 9px 4px 4px;cursor:pointer;
  display:flex;align-items:flex-start;justify-content:center;
  background:linear-gradient(180deg,rgba(121,211,218,.34),rgba(22,143,163,.5));
  box-shadow:inset 0 0 0 1px rgba(234,249,251,.28);transition:height .45s ease,background .3s ease
}
.bar-btn b{margin-top:4px;font:800 11px/1 'JetBrains Mono',monospace;color:#EAF9FB}
.bar-btn:hover:not(:disabled){background:linear-gradient(180deg,rgba(149,201,61,.42),rgba(22,143,163,.55))}
.bar-btn.is-on{background:linear-gradient(180deg,rgba(149,201,61,.62),rgba(34,122,83,.62))}
.bar-btn.is-flat{background:linear-gradient(180deg,rgba(255,194,60,.55),rgba(255,91,53,.5))}
.bar-btn:disabled{cursor:default}
.board-total{display:flex;align-items:center;gap:8px;font:700 12px/1.2 'Manrope',system-ui,sans-serif;color:rgba(234,249,251,.8)}
.board-total strong{padding:3px 9px;border-radius:9px;background:rgba(234,249,251,.14);color:#EAF9FB;font-family:'JetBrains Mono',monospace}
.board-action{font:600 11.5px/1.3 'Manrope',system-ui,sans-serif;color:rgba(234,249,251,.82);text-align:center}
.board-result{font:800 13px/1.3 'JetBrains Mono',monospace;color:#FFE284;text-align:center;display:flex;flex-direction:column;gap:2px;align-items:center}
.board-result b{color:#FFF}
.board-result em{font:600 10.5px/1.25 'Manrope',system-ui,sans-serif;font-style:normal;color:rgba(234,249,251,.72)}
.level-pick{display:flex;flex-direction:column;align-items:center;gap:6px}
.level-pick-label{font:600 11px/1.25 'Manrope',system-ui,sans-serif;color:rgba(234,249,251,.82);text-align:center}
.level-chips{display:flex;gap:7px;flex-wrap:wrap;justify-content:center}
.level-chip{
  min-height:44px;min-width:58px;padding:6px 12px;border:0;border-radius:12px;cursor:pointer;
  font:800 12px/1 'JetBrains Mono',monospace;color:#0E2C3E;background:rgba(234,249,251,.9)
}
.level-chip:hover{background:#FFF}
.level-chip.is-wrong{color:#FFF;background:rgba(255,91,53,.75)}
.level-hint{font:600 10.5px/1.3 'Manrope',system-ui,sans-serif;color:#FFC23C;text-align:center}
.divisor-board{display:flex;flex-direction:column;align-items:center;gap:9px;padding:14px}
.divisor-cards{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.divisor-card{
  min-height:64px;min-width:120px;padding:10px 14px;border:0;border-radius:14px;cursor:pointer;
  display:flex;flex-direction:column;align-items:center;gap:4px;
  background:rgba(234,249,251,.12);box-shadow:inset 0 0 0 1px rgba(234,249,251,.24)
}
.divisor-card b{font:800 16px/1 'JetBrains Mono',monospace;color:#EAF9FB}
.divisor-card span{font:600 10px/1.25 'Manrope',system-ui,sans-serif;color:rgba(234,249,251,.8);text-align:center}
.divisor-card.is-right{background:rgba(34,122,83,.5);box-shadow:inset 0 0 0 2px rgba(149,201,61,.7)}
.divisor-card.is-wrong{background:rgba(255,91,53,.34);box-shadow:inset 0 0 0 2px rgba(255,91,53,.6)}
.mean-line-board{display:flex;flex-direction:column;align-items:center;gap:14px;padding:20px 26px 14px}
.mean-line{position:relative;width:min(280px,100%);height:46px}
.mean-line-axis{position:absolute;left:0;right:0;top:22px;height:3px;border-radius:3px;background:rgba(234,249,251,.34)}
.mean-point{position:absolute;top:8px;transform:translateX(-50%);padding:3px 8px;border-radius:9px;font:800 11px/1 'JetBrains Mono',monospace;color:#0E2C3E;background:rgba(234,249,251,.88)}
.mean-spot{
  position:absolute;top:2px;transform:translateX(-50%);min-width:44px;min-height:44px;padding:0;
  border:0;border-radius:50%;cursor:pointer;font:800 12px/1 'JetBrains Mono',monospace;
  color:#FFF;background:rgba(255,91,53,.42);box-shadow:0 0 0 2px rgba(255,91,53,.5)
}
.mean-spot.is-right{background:${T.accent};box-shadow:0 0 0 3px rgba(255,194,60,.6)}
.mean-spot.is-wrong{background:rgba(120,120,120,.4);box-shadow:0 0 0 2px rgba(255,255,255,.24)}
.compare-board{display:flex;flex-direction:column;align-items:center;gap:9px;padding:14px}
.compare-rows{display:flex;flex-direction:column;gap:7px;width:min(260px,100%)}
.compare-row{
  min-height:48px;padding:8px 14px;border:0;border-radius:13px;cursor:pointer;
  display:flex;align-items:center;justify-content:space-between;gap:10px;
  background:rgba(234,249,251,.12);box-shadow:inset 0 0 0 1px rgba(234,249,251,.22)
}
.compare-row span{font:700 12.5px/1.2 'Manrope',system-ui,sans-serif;color:#EAF9FB}
.compare-row b{font:800 15px/1 'JetBrains Mono',monospace;color:#FFE284}
.compare-row.is-right{background:rgba(34,122,83,.5);box-shadow:inset 0 0 0 2px rgba(149,201,61,.7)}
.compare-row.is-wrong{background:rgba(255,91,53,.3);box-shadow:inset 0 0 0 2px rgba(255,91,53,.55)}
.rule-board{display:flex;flex-direction:column;align-items:center;gap:11px;padding:14px}
.rule-line{display:flex;align-items:center;gap:7px;flex-wrap:wrap;justify-content:center}
.rule-lead{font:700 12px/1.2 'Manrope',system-ui,sans-serif;color:rgba(234,249,251,.86)}
.rule-div{font:800 16px/1 'JetBrains Mono',monospace;color:#EAF9FB}
.rule-slot{
  min-height:44px;min-width:104px;padding:7px 11px;border:0;border-radius:12px;cursor:pointer;
  font:700 11.5px/1.2 'Manrope',system-ui,sans-serif;color:#0E2C3E;
  background:rgba(234,249,251,.82);box-shadow:inset 0 0 0 2px transparent
}
.rule-slot.is-active{box-shadow:inset 0 0 0 2px ${T.accent}}
.rule-slot.is-right{background:rgba(149,201,61,.85)}
.rule-slot.is-wrong{background:rgba(255,91,53,.6);color:#FFF}
.rule-parts{display:flex;gap:7px;flex-wrap:wrap;justify-content:center}
.rule-part{
  min-height:44px;padding:7px 12px;border:0;border-radius:12px;cursor:pointer;
  font:700 11px/1.2 'Manrope',system-ui,sans-serif;color:#EAF9FB;
  background:rgba(234,249,251,.14);box-shadow:inset 0 0 0 1px rgba(234,249,251,.26)
}
.rule-part:hover:not(:disabled){background:rgba(234,249,251,.24)}
.mini-bars{display:flex;flex-direction:column;align-items:center;gap:5px}
.mini-bars .bars{display:flex;align-items:flex-end;gap:5px;min-height:96px}
.mini-bars .bar{width:26px;border-radius:7px 7px 3px 3px;display:flex;justify-content:center;background:linear-gradient(180deg,rgba(121,211,218,.4),rgba(22,143,163,.55))}
.mini-bars .bar b{margin-top:3px;font:800 10px/1 'JetBrains Mono',monospace;color:#EAF9FB}

@media(max-width:639.98px){
  .bar-board .bars{min-height:100px;gap:6px}
  .bar-btn{width:32px}
  .mini-bars .bars{min-height:78px;gap:4px}
  .mini-bars .bar{width:20px}
  .divisor-card{min-width:104px;min-height:58px}
  .mean-line{width:min(240px,100%)}
  .rule-slot{min-width:92px;font-size:11px}
  .board-result{font-size:12px}
}

/* multi: to'rtta variant 2x2 to'rda (3-sinf kanoni §1A) — bitta ekranga sig'adi. */
.options-multi{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.options-multi .option{min-height:48px}
@media(max-width:639.98px){
  .options-multi{gap:6px}
  .options-multi .option{min-height:44px;font-size:12px}
}

/* Desktopda kontent vertikal markazda turadi — ilgari pastda katta bo'sh joy
   qolardi. Mobil'da flex-start qoladi, aks holda joy tor bo'lganda yuqorisi
   kesilib ketardi. */
@media(min-width:640px){
  .stage-body{justify-content:center}
}

/* ===== Geometriya chizmalari (Dars16) ===== */
.geo-board{display:flex;flex-direction:column;align-items:center;gap:11px;padding:16px 18px}
.geo-shape{
  position:relative;width:min(190px,58%);min-width:132px;
  border:5px solid ${T.accent};border-radius:6px;
  background:linear-gradient(150deg,rgba(121,211,218,.16),rgba(22,143,163,.08))
}
.geo-shape-compact{width:min(140px,46%);min-width:112px;border-width:4px}
.geo-square{width:min(140px,44%);min-width:112px}
.geo-side{
  position:absolute;min-width:34px;min-height:30px;padding:3px 8px;border:0;border-radius:9px;
  display:grid;place-items:center;cursor:pointer;
  font:800 12px/1 'JetBrains Mono',monospace;color:${T.navy};background:rgba(234,249,251,.9);
  box-shadow:0 0 0 2px rgba(23,59,82,.14);transition:background .25s ease,color .25s ease
}
.geo-side:disabled{cursor:default}
.geo-side.is-on{color:#FFF;background:${T.accent};box-shadow:0 0 0 2px rgba(255,194,60,.5)}
.geo-top{top:-17px;left:50%;transform:translateX(-50%)}
.geo-bottom{bottom:-17px;left:50%;transform:translateX(-50%)}
.geo-left{left:-19px;top:50%;transform:translateY(-50%)}
.geo-right{right:-19px;top:50%;transform:translateY(-50%)}
.dimension-note{font:700 11px/1.2 'Manrope',system-ui,sans-serif;color:rgba(234,249,251,.8)}

.pair-chips{display:flex;gap:9px;flex-wrap:wrap;justify-content:center}
.pair-chip{
  min-height:44px;padding:8px 14px;border:0;border-radius:12px;cursor:pointer;
  font:800 13px/1 'JetBrains Mono',monospace;color:${T.navy};background:rgba(234,249,251,.88)
}
.pair-chip.is-on{color:#FFF;background:${T.success}}

.letter-board .letter-rows{display:flex;flex-direction:column;gap:7px;width:min(240px,100%)}
.letter-row{display:flex;align-items:center;justify-content:space-between;gap:10px}
.letter-row>span{font:700 12px/1.2 'Manrope',system-ui,sans-serif;color:rgba(234,249,251,.88)}
.letter-slot{
  min-width:52px;min-height:44px;padding:6px 10px;border:0;border-radius:11px;cursor:pointer;
  font:800 15px/1 'JetBrains Mono',monospace;color:${T.navy};background:rgba(234,249,251,.82);
  box-shadow:inset 0 0 0 2px transparent
}
.letter-slot.is-active{box-shadow:inset 0 0 0 2px ${T.accent}}
.letter-slot.is-right{background:rgba(149,201,61,.88)}
.letter-slot.is-wrong{color:#FFF;background:rgba(255,91,53,.6)}
.letter-chips{display:flex;gap:8px;justify-content:center}
.letter-chip{
  min-width:48px;min-height:44px;border:0;border-radius:12px;cursor:pointer;
  font:800 15px/1 'JetBrains Mono',monospace;color:#EAF9FB;
  background:rgba(234,249,251,.14);box-shadow:inset 0 0 0 1px rgba(234,249,251,.26)
}
.letter-chip:hover:not(:disabled){background:rgba(234,249,251,.24)}

.substitute-line{display:flex;align-items:center;gap:4px;flex-wrap:wrap;justify-content:center;
  font:800 15px/1 'JetBrains Mono',monospace;color:#EAF9FB}
.substitute-part{display:inline-flex;align-items:center;gap:4px}
.substitute-part i{font-style:normal}
.substitute-slot{
  min-width:44px;min-height:44px;border:0;border-radius:11px;cursor:pointer;
  font:800 15px/1 'JetBrains Mono',monospace;color:${T.navy};background:rgba(234,249,251,.85)
}
.substitute-slot.is-on{color:#FFF;background:${T.success}}

.tile-rows{display:flex;flex-direction:column;gap:4px}
.tile-row{display:flex;gap:4px;padding:0;border:0;background:none;cursor:pointer}
.tile-row:disabled{cursor:default}
.tile-row i{
  width:26px;height:26px;border-radius:5px;
  background:rgba(234,249,251,.14);box-shadow:inset 0 0 0 1px rgba(234,249,251,.3);
  transition:background .25s ease
}
.tile-row.is-on i{background:rgba(149,201,61,.7);box-shadow:inset 0 0 0 1px rgba(149,201,61,.85)}
.tile-row:not(:disabled):not(.is-on) i{box-shadow:inset 0 0 0 2px ${T.accent}}

@media(max-width:639.98px){
  .geo-board{padding:12px 14px;gap:9px}
  .geo-shape{width:min(150px,50%);min-width:118px}
  .geo-shape-compact{width:min(116px,40%);min-width:100px}
  .geo-square{width:min(112px,38%);min-width:96px}
  .geo-side{min-width:30px;min-height:28px;font-size:11px;padding:2px 6px}
  .letter-board .letter-rows{width:min(212px,100%)}
  .tile-row i{width:21px;height:21px}
  .substitute-line{font-size:13px}
}

`;
