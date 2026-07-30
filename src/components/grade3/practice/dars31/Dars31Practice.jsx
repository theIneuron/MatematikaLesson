// Dars 31 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D31_01 from './D31_01.jsx';
import D31_02 from './D31_02.jsx';
import D31_03 from './D31_03.jsx';
import D31_04 from './D31_04.jsx';
import D31_05 from './D31_05.jsx';
import D31_06 from './D31_06.jsx';
import D31_07 from './D31_07.jsx';
import D31_08 from './D31_08.jsx';
import D31_09 from './D31_09.jsx';
import D31_10 from './D31_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[31];
const QUESTIONS = [
  D31_01,
  D31_02,
  D31_03,
  D31_04,
  D31_05,
  D31_06,
  D31_07,
  D31_08,
  D31_09,
  D31_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars31Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
