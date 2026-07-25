// Dars 37 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D37_01 from './D37_01.jsx';
import D37_02 from './D37_02.jsx';
import D37_03 from './D37_03.jsx';
import D37_04 from './D37_04.jsx';
import D37_05 from './D37_05.jsx';
import D37_06 from './D37_06.jsx';
import D37_07 from './D37_07.jsx';
import D37_08 from './D37_08.jsx';
import D37_09 from './D37_09.jsx';
import D37_10 from './D37_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[37];
const QUESTIONS = [
  D37_01,
  D37_02,
  D37_03,
  D37_04,
  D37_05,
  D37_06,
  D37_07,
  D37_08,
  D37_09,
  D37_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars37Practice() {
  return <PracticeBank bank={BANK} />;
}
