// Dars 36 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D36_01 from './D36_01.jsx';
import D36_02 from './D36_02.jsx';
import D36_03 from './D36_03.jsx';
import D36_04 from './D36_04.jsx';
import D36_05 from './D36_05.jsx';
import D36_06 from './D36_06.jsx';
import D36_07 from './D36_07.jsx';
import D36_08 from './D36_08.jsx';
import D36_09 from './D36_09.jsx';
import D36_10 from './D36_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[36];
const QUESTIONS = [
  D36_01,
  D36_02,
  D36_03,
  D36_04,
  D36_05,
  D36_06,
  D36_07,
  D36_08,
  D36_09,
  D36_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars36Practice() {
  return <PracticeBank bank={BANK} />;
}
