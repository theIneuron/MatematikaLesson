// Dars 20 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D20_01 from './D20_01.jsx';
import D20_02 from './D20_02.jsx';
import D20_03 from './D20_03.jsx';
import D20_04 from './D20_04.jsx';
import D20_05 from './D20_05.jsx';
import D20_06 from './D20_06.jsx';
import D20_07 from './D20_07.jsx';
import D20_08 from './D20_08.jsx';
import D20_09 from './D20_09.jsx';
import D20_10 from './D20_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[20];
const QUESTIONS = [
  D20_01,
  D20_02,
  D20_03,
  D20_04,
  D20_05,
  D20_06,
  D20_07,
  D20_08,
  D20_09,
  D20_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars20Practice() {
  return <PracticeBank bank={BANK} />;
}
