import PracticeBank from '../PracticeBank.jsx';
import { DARS14_BANK } from '../newBanks.js';
import D14_01 from './D14_01.jsx';
import D14_02 from './D14_02.jsx';
import D14_03 from './D14_03.jsx';
import D14_04 from './D14_04.jsx';
import D14_05 from './D14_05.jsx';
import D14_06 from './D14_06.jsx';
import D14_07 from './D14_07.jsx';
import D14_08 from './D14_08.jsx';
import D14_09 from './D14_09.jsx';
import D14_10 from './D14_10.jsx';

const QUESTIONS = [
  D14_01,
  D14_02,
  D14_03,
  D14_04,
  D14_05,
  D14_06,
  D14_07,
  D14_08,
  D14_09,
  D14_10,
];
const BANK = {
  ...DARS14_BANK,
  items: DARS14_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars14Practice() {
  return <PracticeBank bank={BANK} />;
}
