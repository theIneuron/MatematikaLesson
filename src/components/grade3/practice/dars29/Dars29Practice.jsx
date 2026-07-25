// Dars 29 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D29_01 from './D29_01.jsx';
import D29_02 from './D29_02.jsx';
import D29_03 from './D29_03.jsx';
import D29_04 from './D29_04.jsx';
import D29_05 from './D29_05.jsx';
import D29_06 from './D29_06.jsx';
import D29_07 from './D29_07.jsx';
import D29_08 from './D29_08.jsx';
import D29_09 from './D29_09.jsx';
import D29_10 from './D29_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[29];
const QUESTIONS = [
  D29_01,
  D29_02,
  D29_03,
  D29_04,
  D29_05,
  D29_06,
  D29_07,
  D29_08,
  D29_09,
  D29_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars29Practice() {
  return <PracticeBank bank={BANK} />;
}
