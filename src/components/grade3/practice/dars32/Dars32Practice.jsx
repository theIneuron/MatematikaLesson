// Dars 32 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D32_01 from './D32_01.jsx';
import D32_02 from './D32_02.jsx';
import D32_03 from './D32_03.jsx';
import D32_04 from './D32_04.jsx';
import D32_05 from './D32_05.jsx';
import D32_06 from './D32_06.jsx';
import D32_07 from './D32_07.jsx';
import D32_08 from './D32_08.jsx';
import D32_09 from './D32_09.jsx';
import D32_10 from './D32_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[32];
const QUESTIONS = [
  D32_01,
  D32_02,
  D32_03,
  D32_04,
  D32_05,
  D32_06,
  D32_07,
  D32_08,
  D32_09,
  D32_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars32Practice() {
  return <PracticeBank bank={BANK} />;
}
