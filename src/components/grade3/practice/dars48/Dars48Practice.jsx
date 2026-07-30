// Dars 48 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D48_01 from './D48_01.jsx';
import D48_02 from './D48_02.jsx';
import D48_03 from './D48_03.jsx';
import D48_04 from './D48_04.jsx';
import D48_05 from './D48_05.jsx';
import D48_06 from './D48_06.jsx';
import D48_07 from './D48_07.jsx';
import D48_08 from './D48_08.jsx';
import D48_09 from './D48_09.jsx';
import D48_10 from './D48_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[48];
const QUESTIONS = [
  D48_01,
  D48_02,
  D48_03,
  D48_04,
  D48_05,
  D48_06,
  D48_07,
  D48_08,
  D48_09,
  D48_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars48Practice() {
  return <PracticeBank bank={BANK} />;
}
