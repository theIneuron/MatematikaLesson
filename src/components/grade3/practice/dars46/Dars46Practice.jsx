// Dars 46 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D46_01 from './D46_01.jsx';
import D46_02 from './D46_02.jsx';
import D46_03 from './D46_03.jsx';
import D46_04 from './D46_04.jsx';
import D46_05 from './D46_05.jsx';
import D46_06 from './D46_06.jsx';
import D46_07 from './D46_07.jsx';
import D46_08 from './D46_08.jsx';
import D46_09 from './D46_09.jsx';
import D46_10 from './D46_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[46];
const QUESTIONS = [
  D46_01,
  D46_02,
  D46_03,
  D46_04,
  D46_05,
  D46_06,
  D46_07,
  D46_08,
  D46_09,
  D46_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars46Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
