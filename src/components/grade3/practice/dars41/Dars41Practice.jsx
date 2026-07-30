// Dars 41 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D41_01 from './D41_01.jsx';
import D41_02 from './D41_02.jsx';
import D41_03 from './D41_03.jsx';
import D41_04 from './D41_04.jsx';
import D41_05 from './D41_05.jsx';
import D41_06 from './D41_06.jsx';
import D41_07 from './D41_07.jsx';
import D41_08 from './D41_08.jsx';
import D41_09 from './D41_09.jsx';
import D41_10 from './D41_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[41];
const QUESTIONS = [
  D41_01,
  D41_02,
  D41_03,
  D41_04,
  D41_05,
  D41_06,
  D41_07,
  D41_08,
  D41_09,
  D41_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars41Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
