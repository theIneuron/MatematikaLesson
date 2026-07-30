// Dars 43 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D43_01 from './D43_01.jsx';
import D43_02 from './D43_02.jsx';
import D43_03 from './D43_03.jsx';
import D43_04 from './D43_04.jsx';
import D43_05 from './D43_05.jsx';
import D43_06 from './D43_06.jsx';
import D43_07 from './D43_07.jsx';
import D43_08 from './D43_08.jsx';
import D43_09 from './D43_09.jsx';
import D43_10 from './D43_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[43];
const QUESTIONS = [
  D43_01,
  D43_02,
  D43_03,
  D43_04,
  D43_05,
  D43_06,
  D43_07,
  D43_08,
  D43_09,
  D43_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars43Practice() {
  return <PracticeBank bank={BANK} />;
}
