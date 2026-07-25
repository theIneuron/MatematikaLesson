// Dars 56 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D56_01 from './D56_01.jsx';
import D56_02 from './D56_02.jsx';
import D56_03 from './D56_03.jsx';
import D56_04 from './D56_04.jsx';
import D56_05 from './D56_05.jsx';
import D56_06 from './D56_06.jsx';
import D56_07 from './D56_07.jsx';
import D56_08 from './D56_08.jsx';
import D56_09 from './D56_09.jsx';
import D56_10 from './D56_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[56];
const QUESTIONS = [
  D56_01,
  D56_02,
  D56_03,
  D56_04,
  D56_05,
  D56_06,
  D56_07,
  D56_08,
  D56_09,
  D56_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars56Practice() {
  return <PracticeBank bank={BANK} />;
}
