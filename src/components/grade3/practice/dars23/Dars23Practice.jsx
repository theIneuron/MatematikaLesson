// Dars 23 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D23_01 from './D23_01.jsx';
import D23_02 from './D23_02.jsx';
import D23_03 from './D23_03.jsx';
import D23_04 from './D23_04.jsx';
import D23_05 from './D23_05.jsx';
import D23_06 from './D23_06.jsx';
import D23_07 from './D23_07.jsx';
import D23_08 from './D23_08.jsx';
import D23_09 from './D23_09.jsx';
import D23_10 from './D23_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[23];
const QUESTIONS = [
  D23_01,
  D23_02,
  D23_03,
  D23_04,
  D23_05,
  D23_06,
  D23_07,
  D23_08,
  D23_09,
  D23_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars23Practice() {
  return <PracticeBank bank={BANK} />;
}
