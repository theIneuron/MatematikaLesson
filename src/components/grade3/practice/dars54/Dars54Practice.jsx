// Dars 54 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D54_01 from './D54_01.jsx';
import D54_02 from './D54_02.jsx';
import D54_03 from './D54_03.jsx';
import D54_04 from './D54_04.jsx';
import D54_05 from './D54_05.jsx';
import D54_06 from './D54_06.jsx';
import D54_07 from './D54_07.jsx';
import D54_08 from './D54_08.jsx';
import D54_09 from './D54_09.jsx';
import D54_10 from './D54_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[54];
const QUESTIONS = [
  D54_01,
  D54_02,
  D54_03,
  D54_04,
  D54_05,
  D54_06,
  D54_07,
  D54_08,
  D54_09,
  D54_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars54Practice() {
  return <PracticeBank bank={BANK} />;
}
