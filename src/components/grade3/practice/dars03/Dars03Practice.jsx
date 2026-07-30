// Dars 3 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import PracticeBank from '../PracticeBank.jsx';
import D03_01 from './D03_01.jsx';
import D03_04 from './D03_04.jsx';
import D03_08 from './D03_08.jsx';
import D03_02 from './D03_02.jsx';
import D03_05 from './D03_05.jsx';
import D03_09 from './D03_09.jsx';
import D03_03 from './D03_03.jsx';
import D03_06 from './D03_06.jsx';
import D03_10 from './D03_10.jsx';
import D03_07 from './D03_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Yoyilmani top", C: D03_01 },
  { id: '02', label: "🟢 Yig'indini top", C: D03_02 },
  { id: '03', label: "🟢 Moslashtir", C: D03_03 },
  { id: '04', label: "🟡 700 + 50", C: D03_04 },
  { id: '05', label: "🟡 854 yoyilmasi", C: D03_05 },
  { id: '06', label: "🟡 903 yoyilmasi", C: D03_06 },
  { id: '07', label: "🟡 Nima qoldi?", C: D03_07 },
  { id: '08', label: "🔴 Plitalardan yig'", C: D03_08 },
  { id: '09', label: "🔴 Masala", C: D03_09 },
  { id: '10', label: "🔴 Xatoni top", C: D03_10 },
];

const TITLE = "Dars 3 · Razryad qo'shiluvchilari";

const BANK = {
  title: TITLE,
  items: ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    level: '',
    Component: item.C,
  })),
};

export default function Dars03Practice() {
  return <PracticeBank bank={BANK} />;
}
