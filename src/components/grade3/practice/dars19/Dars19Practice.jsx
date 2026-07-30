import PracticeBank from '../PracticeBank.jsx';
import { DARS19_BANK } from '../newBanks.js';
import D19_01 from './D19_01.jsx';
import D19_02 from './D19_02.jsx';
import D19_03 from './D19_03.jsx';
import D19_04 from './D19_04.jsx';
import D19_05 from './D19_05.jsx';
import D19_06 from './D19_06.jsx';
import D19_07 from './D19_07.jsx';
import D19_08 from './D19_08.jsx';
import D19_09 from './D19_09.jsx';
import D19_10 from './D19_10.jsx';

const QUESTIONS = [
  D19_01,
  D19_02,
  D19_03,
  D19_04,
  D19_05,
  D19_06,
  D19_07,
  D19_08,
  D19_09,
  D19_10,
];
const BANK = {
  ...DARS19_BANK,
  items: DARS19_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars19Practice() {
  return <PracticeBank bank={BANK} />;
}
