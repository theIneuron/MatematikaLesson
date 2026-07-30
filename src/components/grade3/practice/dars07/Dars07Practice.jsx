// Dars 7 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import PracticeBank from '../PracticeBank.jsx';
import D07_01 from './D07_01.jsx';
import D07_04 from './D07_04.jsx';
import D07_08 from './D07_08.jsx';
import D07_02 from './D07_02.jsx';
import D07_05 from './D07_05.jsx';
import D07_09 from './D07_09.jsx';
import D07_03 from './D07_03.jsx';
import D07_06 from './D07_06.jsx';
import D07_10 from './D07_10.jsx';
import D07_07 from './D07_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Ustunda qo'sh", C: D07_01 },
  { id: '02', label: "🟢 Moslashtir", C: D07_02 },
  { id: '03', label: "🟢 Ustunda ayir", C: D07_03 },
  { id: '04', label: "🟡 To'g'ri yozuv", C: D07_04 },
  { id: '05', label: "🟡 O'tkazish bilan", C: D07_05 },
  { id: '06', label: "🟡 Qarz olish", C: D07_06 },
  { id: '07', label: "🟡 Xatoni top", C: D07_07 },
  { id: '08', label: "🔴 Ikki o'tkazish", C: D07_08 },
  { id: '09', label: "🔴 Masala (do'kon)", C: D07_09 },
  { id: '10', label: "🔴 Ikki qarz", C: D07_10 },
];

const TITLE = "Dars 7 · Yozma qo'shish va ayirish";

const BANK = {
  title: TITLE,
  items: ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    level: '',
    Component: item.C,
  })),
};

export default function Dars07Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
