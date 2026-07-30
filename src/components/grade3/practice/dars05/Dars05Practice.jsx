// Dars 5 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import PracticeBank from '../PracticeBank.jsx';
import D05_01 from './D05_01.jsx';
import D05_04 from './D05_04.jsx';
import D05_08 from './D05_08.jsx';
import D05_02 from './D05_02.jsx';
import D05_05 from './D05_05.jsx';
import D05_09 from './D05_09.jsx';
import D05_03 from './D05_03.jsx';
import D05_06 from './D05_06.jsx';
import D05_10 from './D05_10.jsx';
import D05_07 from './D05_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Chiziqda top", C: D05_01 },
  { id: '02', label: "🟢 Yumaloq o'nlik", C: D05_02 },
  { id: '03', label: "🟢 Moslashtir", C: D05_03 },
  { id: '04', label: "🟡 Yumaloq yuzlik", C: D05_04 },
  { id: '05', label: "🟡 O'rtadagi son", C: D05_05 },
  { id: '06', label: "🟡 Yuzlikni ter", C: D05_06 },
  { id: '07', label: "🟡 350 qayoqqa?", C: D05_07 },
  { id: '08', label: "🔴 Xatoni top", C: D05_08 },
  { id: '09', label: "🔴 Ikki qadam", C: D05_09 },
  { id: '10', label: "🔴 Taxminiy hisob", C: D05_10 },
];

const TITLE = "Dars 5 · Eng yaqin yumaloq son";

const BANK = {
  title: TITLE,
  items: ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    level: '',
    Component: item.C,
  })),
};

export default function Dars05Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
