// Dars 30 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D30_01 from './D30_01.jsx';
import D30_02 from './D30_02.jsx';
import D30_03 from './D30_03.jsx';
import D30_04 from './D30_04.jsx';
import D30_05 from './D30_05.jsx';
import D30_06 from './D30_06.jsx';
import D30_07 from './D30_07.jsx';
import D30_08 from './D30_08.jsx';
import D30_09 from './D30_09.jsx';
import D30_10 from './D30_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[30];
const QUESTIONS = [
  D30_01,
  D30_02,
  D30_03,
  D30_04,
  D30_05,
  D30_06,
  D30_07,
  D30_08,
  D30_09,
  D30_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars30Practice() {
  return <PracticeBank bank={BANK} />;
}
