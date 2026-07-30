import PracticeBank from '../PracticeBank.jsx';
import { DARS15_BANK } from '../newBanks.js';
import D15_01 from './D15_01.jsx';
import D15_02 from './D15_02.jsx';
import D15_03 from './D15_03.jsx';
import D15_04 from './D15_04.jsx';
import D15_05 from './D15_05.jsx';
import D15_06 from './D15_06.jsx';
import D15_07 from './D15_07.jsx';
import D15_08 from './D15_08.jsx';
import D15_09 from './D15_09.jsx';
import D15_10 from './D15_10.jsx';

const QUESTIONS = [
  D15_01,
  D15_02,
  D15_03,
  D15_04,
  D15_05,
  D15_06,
  D15_07,
  D15_08,
  D15_09,
  D15_10,
];
const BANK = {
  ...DARS15_BANK,
  items: DARS15_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars15Practice() {
  return <PracticeBank bank={BANK} />;
}
