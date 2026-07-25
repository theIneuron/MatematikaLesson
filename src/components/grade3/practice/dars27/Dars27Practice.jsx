// Dars 27 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D27_01 from './D27_01.jsx';
import D27_02 from './D27_02.jsx';
import D27_03 from './D27_03.jsx';
import D27_04 from './D27_04.jsx';
import D27_05 from './D27_05.jsx';
import D27_06 from './D27_06.jsx';
import D27_07 from './D27_07.jsx';
import D27_08 from './D27_08.jsx';
import D27_09 from './D27_09.jsx';
import D27_10 from './D27_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[27];
const QUESTIONS = [
  D27_01,
  D27_02,
  D27_03,
  D27_04,
  D27_05,
  D27_06,
  D27_07,
  D27_08,
  D27_09,
  D27_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars27Practice() {
  return <PracticeBank bank={BANK} />;
}
