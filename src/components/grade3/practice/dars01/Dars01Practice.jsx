// Dars 1 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import PracticeBank from '../PracticeBank.jsx';
import D01_01 from './D01_01.jsx';
import D01_04 from './D01_04.jsx';
import D01_08 from './D01_08.jsx';
import D01_02 from './D01_02.jsx';
import D01_05 from './D01_05.jsx';
import D01_09 from './D01_09.jsx';
import D01_03 from './D01_03.jsx';
import D01_06 from './D01_06.jsx';
import D01_10 from './D01_10.jsx';
import D01_07 from './D01_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Nechta yuzlik?", C: D01_01 },
  { id: '02', label: "🟢 Sonni yig'", C: D01_02 },
  { id: '03', label: "🟢 Rasmni o'qi", C: D01_03 },
  { id: '04', label: "🟡 Sonni ter", C: D01_04 },
  { id: '05', label: "🟡 Son o'qi", C: D01_05 },
  { id: '06', label: "🟡 Nechta o'nlik?", C: D01_06 },
  { id: '07', label: "🟡 Raqam qiymati", C: D01_07 },
  { id: '08', label: "🔴 Razryad savatlari", C: D01_08 },
  { id: '09', label: "🔴 Oldingi son", C: D01_09 },
  { id: '10', label: "🔴 Minglik blok", C: D01_10 },
];

const TITLE = "Dars 1 · Yuzliklar, o'nliklar va birliklar";

const BANK = {
  title: TITLE,
  items: ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    level: '',
    Component: item.C,
  })),
};

export default function Dars01Practice() {
  return <PracticeBank bank={BANK} />;
}
