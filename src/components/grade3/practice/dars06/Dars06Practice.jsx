// Dars 6 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import PracticeBank from '../PracticeBank.jsx';
import D06_01 from './D06_01.jsx';
import D06_04 from './D06_04.jsx';
import D06_08 from './D06_08.jsx';
import D06_02 from './D06_02.jsx';
import D06_05 from './D06_05.jsx';
import D06_09 from './D06_09.jsx';
import D06_03 from './D06_03.jsx';
import D06_06 from './D06_06.jsx';
import D06_10 from './D06_10.jsx';
import D06_07 from './D06_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Strelka qayerda?", C: D06_01 },
  { id: '02', label: "🟢 Oraliqni top", C: D06_02 },
  { id: '03', label: "🟢 Orasidagi o'nlik", C: D06_03 },
  { id: '04', label: "🟡 Belgilarni sana", C: D06_04 },
  { id: '05', label: "🟡 Chapda qaysi?", C: D06_05 },
  { id: '06', label: "🟡 O'qda harakat", C: D06_06 },
  { id: '07', label: "🟡 A, B, C nuqtalar", C: D06_07 },
  { id: '08', label: "🔴 Oraliqdagi son", C: D06_08 },
  { id: '09', label: "🔴 Nechta son?", C: D06_09 },
  { id: '10', label: "🔴 O'qdagi tartib", C: D06_10 },
];

const TITLE = "Dars 6 · Son o'qida son";

const BANK = {
  title: TITLE,
  items: ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    level: '',
    Component: item.C,
  })),
};

export default function Dars06Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
