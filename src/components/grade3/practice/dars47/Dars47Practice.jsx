// Dars 47 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D47_01 from './D47_01.jsx';
import D47_02 from './D47_02.jsx';
import D47_03 from './D47_03.jsx';
import D47_04 from './D47_04.jsx';
import D47_05 from './D47_05.jsx';
import D47_06 from './D47_06.jsx';
import D47_07 from './D47_07.jsx';
import D47_08 from './D47_08.jsx';
import D47_09 from './D47_09.jsx';
import D47_10 from './D47_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[47];
const QUESTIONS = [
  D47_01,
  D47_02,
  D47_03,
  D47_04,
  D47_05,
  D47_06,
  D47_07,
  D47_08,
  D47_09,
  D47_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars47Practice() {
  return <PracticeBank bank={BANK} />;
}
