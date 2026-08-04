// Dars 6 (3-sinf) — yagona metodik yo'nalishga yig'ilgan 10 topshiriq.
// Mexanikalar: o'qish → masshtab → nuqta → oraliq → taqqoslash → harakat
// → moslashtirish → asoslash → xatoni tuzatish → bilimni ko'chirish.
import PracticeBank from '../PracticeBank.jsx';
import D06_01 from './D06_01.jsx';
import D06_02 from './D06_02.jsx';
import D06_03 from './D06_03.jsx';
import D06_04 from './D06_04.jsx';
import D06_05 from './D06_05.jsx';
import D06_06 from './D06_06.jsx';
import D06_07 from './D06_07.jsx';
import D06_08 from './D06_08.jsx';
import D06_09 from './D06_09.jsx';
import D06_10 from './D06_10.jsx';

// Metodik xarita: qiyinlik asta-sekin oshadi, mexanika takrorlanmaydi.
const ITEMS = [
  { id: '01', label: "🟢 O'qni o'qi", C: D06_01 },
  { id: '02', label: '🟢 Masshtabni top', C: D06_02 },
  { id: '03', label: "🟢 Nuqtani qo'y", C: D06_03 },
  { id: '04', label: "🟡 Oraliqni ko'r", C: D06_04 },
  { id: '05', label: "🟡 Chap va o'ng", C: D06_05 },
  { id: '06', label: "🟡 O'qda harakat", C: D06_06 },
  { id: '07', label: '🟡 Moslashtir', C: D06_07 },
  { id: '08', label: '🔴 Javobni asosla', C: D06_08 },
  { id: '09', label: '🔴 Xatoni tuzat', C: D06_09 },
  { id: '10', label: "🔴 Bilimni ko'chir", C: D06_10 },
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

export default function Dars06Practice() {
  return <PracticeBank bank={BANK} />;
}
