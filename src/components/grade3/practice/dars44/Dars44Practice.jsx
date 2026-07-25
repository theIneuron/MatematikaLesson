// Dars 44 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D44_01 from './D44_01.jsx';
import D44_02 from './D44_02.jsx';
import D44_03 from './D44_03.jsx';
import D44_04 from './D44_04.jsx';
import D44_05 from './D44_05.jsx';
import D44_06 from './D44_06.jsx';
import D44_07 from './D44_07.jsx';
import D44_08 from './D44_08.jsx';
import D44_09 from './D44_09.jsx';
import D44_10 from './D44_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[44];
const QUESTIONS = [
  D44_01,
  D44_02,
  D44_03,
  D44_04,
  D44_05,
  D44_06,
  D44_07,
  D44_08,
  D44_09,
  D44_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars44Practice() {
  return <PracticeBank bank={BANK} />;
}
