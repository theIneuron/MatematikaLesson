// Dars 2 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import PracticeBank from '../PracticeBank.jsx';
import D02_01 from './D02_01.jsx';
import D02_04 from './D02_04.jsx';
import D02_08 from './D02_08.jsx';
import D02_02 from './D02_02.jsx';
import D02_05 from './D02_05.jsx';
import D02_09 from './D02_09.jsx';
import D02_03 from './D02_03.jsx';
import D02_06 from './D02_06.jsx';
import D02_10 from './D02_10.jsx';
import D02_07 from './D02_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Sonni o'qi", C: D02_01 },
  { id: '02', label: "🟢 So'zdan songa", C: D02_02 },
  { id: '03', label: "🟢 Moslashtir", C: D02_03 },
  { id: '04', label: "🟡 Sonni yoz", C: D02_04 },
  { id: '05', label: "🟡 Nol bilan yoz", C: D02_05 },
  { id: '06', label: "🟡 Qaysi yozuv?", C: D02_06 },
  { id: '07', label: "🟡 Xatoni top", C: D02_07 },
  { id: '08', label: "🔴 Eng katta son", C: D02_08 },
  { id: '09', label: "🔴 Eng kichik son", C: D02_09 },
  { id: '10', label: "🔴 Qaysi son?", C: D02_10 },
];

const TITLE = "Dars 2 · Sonlarni o'qish va yozish";

const BANK = {
  title: TITLE,
  items: ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    level: '',
    Component: item.C,
  })),
};

export default function Dars02Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
