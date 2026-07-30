// Dars 8 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import PracticeBank from '../PracticeBank.jsx';
import D08_01 from './D08_01.jsx';
import D08_04 from './D08_04.jsx';
import D08_08 from './D08_08.jsx';
import D08_02 from './D08_02.jsx';
import D08_05 from './D08_05.jsx';
import D08_09 from './D08_09.jsx';
import D08_03 from './D08_03.jsx';
import D08_06 from './D08_06.jsx';
import D08_10 from './D08_10.jsx';
import D08_07 from './D08_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 X belgisi", C: D08_01 },
  { id: '02', label: "🟢 XII ni o'qi", C: D08_02 },
  { id: '03', label: "🟢 Moslashtir", C: D08_03 },
  { id: '04', label: "🟡 23 ni yasa", C: D08_04 },
  { id: '05', label: "🟡 IX nechchi?", C: D08_05 },
  { id: '06', label: "🟡 XIV ni o'qi", C: D08_06 },
  { id: '07', label: "🟡 Xatoni top", C: D08_07 },
  { id: '08', label: "🔴 9 ni yasa", C: D08_08 },
  { id: '09', label: "🔴 Oylar rimchada", C: D08_09 },
  { id: '10', label: "🔴 Qaysi katta?", C: D08_10 },
];

const TITLE = "Dars 8 · Rim raqamlari";

const BANK = {
  title: TITLE,
  items: ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    level: '',
    Component: item.C,
  })),
};

export default function Dars08Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
