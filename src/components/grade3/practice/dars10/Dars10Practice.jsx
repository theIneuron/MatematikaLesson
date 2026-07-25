// Dars 10 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host, grade5 dars04 format-palitrasida.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import PracticeBank from '../PracticeBank.jsx';
import D10_01 from './D10_01.jsx';
import D10_04 from './D10_04.jsx';
import D10_08 from './D10_08.jsx';
import D10_02 from './D10_02.jsx';
import D10_05 from './D10_05.jsx';
import D10_09 from './D10_09.jsx';
import D10_03 from './D10_03.jsx';
import D10_06 from './D10_06.jsx';
import D10_10 from './D10_10.jsx';
import D10_07 from './D10_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Savatlar", C: D10_01 },
  { id: '02', label: "🟢 Og'zaki 7×8", C: D10_02 },
  { id: '03', label: "🟢 Moslashtir", C: D10_03 },
  { id: '04', label: "🟡 O'rin almashtirish", C: D10_04 },
  { id: '05', label: "🟡 Yo'qolgan son", C: D10_05 },
  { id: '06', label: "🟡 99 × 0", C: D10_06 },
  { id: '07', label: "🟡 Qulay usul", C: D10_07 },
  { id: '08', label: "🔴 Masala (uzum)", C: D10_08 },
  { id: '09', label: "🔴 Qulay usul 2", C: D10_09 },
  { id: '10', label: "🔴 Teskari jadval", C: D10_10 },
];

const TITLE = "Dars 10 · Ko'paytirish jadvali";

const BANK = {
  title: TITLE,
  items: ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    level: '',
    Component: item.C,
  })),
};

export default function Dars10Practice() {
  return <PracticeBank bank={BANK} />;
}
