// Dars 51 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D51_01 from './D51_01.jsx';
import D51_02 from './D51_02.jsx';
import D51_03 from './D51_03.jsx';
import D51_04 from './D51_04.jsx';
import D51_05 from './D51_05.jsx';
import D51_06 from './D51_06.jsx';
import D51_07 from './D51_07.jsx';
import D51_08 from './D51_08.jsx';
import D51_09 from './D51_09.jsx';
import D51_10 from './D51_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[51];
const QUESTIONS = [
  D51_01,
  D51_02,
  D51_03,
  D51_04,
  D51_05,
  D51_06,
  D51_07,
  D51_08,
  D51_09,
  D51_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars51Practice() {
  return <PracticeBank bank={BANK} />;
}
