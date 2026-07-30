// Dars 4 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import PracticeBank from '../PracticeBank.jsx';
import D04_01 from './D04_01.jsx';
import D04_04 from './D04_04.jsx';
import D04_08 from './D04_08.jsx';
import D04_02 from './D04_02.jsx';
import D04_05 from './D04_05.jsx';
import D04_09 from './D04_09.jsx';
import D04_03 from './D04_03.jsx';
import D04_06 from './D04_06.jsx';
import D04_10 from './D04_10.jsx';
import D04_07 from './D04_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Belgini qo'y", C: D04_01 },
  { id: '02', label: "🟢 348 va 523", C: D04_02 },
  { id: '03', label: "🟢 Qaysi baland?", C: D04_03 },
  { id: '04', label: "🟡 987 va 879", C: D04_04 },
  { id: '05', label: "🟡 Tengmi?", C: D04_05 },
  { id: '06', label: "🟡 600 va 599", C: D04_06 },
  { id: '07', label: "🟡 Tartibla", C: D04_07 },
  { id: '08', label: "🔴 519 va 591", C: D04_08 },
  { id: '09', label: "🔴 Masala (minora)", C: D04_09 },
  { id: '10', label: "🔴 Eng katta son", C: D04_10 },
];

const TITLE = "Dars 4 · Uch xonali sonlarni taqqoslash";

const BANK = {
  title: TITLE,
  items: ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    level: '',
    Component: item.C,
  })),
};

export default function Dars04Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
