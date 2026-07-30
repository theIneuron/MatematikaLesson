// Dars 9 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host, grade5 dars04 format-palitrasida.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import PracticeBank from '../PracticeBank.jsx';
import D09_01 from './D09_01.jsx';
import D09_04 from './D09_04.jsx';
import D09_08 from './D09_08.jsx';
import D09_02 from './D09_02.jsx';
import D09_05 from './D09_05.jsx';
import D09_09 from './D09_09.jsx';
import D09_03 from './D09_03.jsx';
import D09_06 from './D09_06.jsx';
import D09_10 from './D09_10.jsx';
import D09_07 from './D09_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Savatlar", C: D09_01 },
  { id: '02', label: "🟢 Og'zaki 7×8", C: D09_02 },
  { id: '03', label: "🟢 Moslashtir", C: D09_03 },
  { id: '04', label: "🟡 O'rin almashtirish", C: D09_04 },
  { id: '05', label: "🟡 Yo'qolgan son", C: D09_05 },
  { id: '06', label: "🟡 99 × 0", C: D09_06 },
  { id: '07', label: "🟡 Qulay usul", C: D09_07 },
  { id: '08', label: "🔴 Masala (uzum)", C: D09_08 },
  { id: '09', label: "🔴 Qulay usul 2", C: D09_09 },
  { id: '10', label: "🔴 Teskari jadval", C: D09_10 },
];

const TITLE = "Dars 9 · Ko'paytirish jadvali";

const BANK = {
  title: TITLE,
  items: ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    level: '',
    Component: item.C,
  })),
};

export default function Dars09Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
