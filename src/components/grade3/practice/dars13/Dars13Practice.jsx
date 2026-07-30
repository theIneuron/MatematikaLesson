import PracticeBank from '../PracticeBank.jsx';
import { DARS13_BANK } from '../newBanks.js';
import D13_01 from './D13_01.jsx';
import D13_02 from './D13_02.jsx';
import D13_03 from './D13_03.jsx';
import D13_04 from './D13_04.jsx';
import D13_05 from './D13_05.jsx';
import D13_06 from './D13_06.jsx';
import D13_07 from './D13_07.jsx';
import D13_08 from './D13_08.jsx';
import D13_09 from './D13_09.jsx';
import D13_10 from './D13_10.jsx';

const QUESTIONS = [
  D13_01,
  D13_02,
  D13_03,
  D13_04,
  D13_05,
  D13_06,
  D13_07,
  D13_08,
  D13_09,
  D13_10,
];
const BANK = {
  ...DARS13_BANK,
  items: DARS13_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars13Practice() {
  return <PracticeBank bank={BANK} />;
}
