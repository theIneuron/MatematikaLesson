// Dars 22 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D22_01 from './D22_01.jsx';
import D22_02 from './D22_02.jsx';
import D22_03 from './D22_03.jsx';
import D22_04 from './D22_04.jsx';
import D22_05 from './D22_05.jsx';
import D22_06 from './D22_06.jsx';
import D22_07 from './D22_07.jsx';
import D22_08 from './D22_08.jsx';
import D22_09 from './D22_09.jsx';
import D22_10 from './D22_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[22];
const QUESTIONS = [
  D22_01,
  D22_02,
  D22_03,
  D22_04,
  D22_05,
  D22_06,
  D22_07,
  D22_08,
  D22_09,
  D22_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars22Practice() {
  return <PracticeBank bank={BANK} />;
}
