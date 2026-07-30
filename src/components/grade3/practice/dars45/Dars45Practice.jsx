// Dars 45 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D45_01 from './D45_01.jsx';
import D45_02 from './D45_02.jsx';
import D45_03 from './D45_03.jsx';
import D45_04 from './D45_04.jsx';
import D45_05 from './D45_05.jsx';
import D45_06 from './D45_06.jsx';
import D45_07 from './D45_07.jsx';
import D45_08 from './D45_08.jsx';
import D45_09 from './D45_09.jsx';
import D45_10 from './D45_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[45];
const QUESTIONS = [
  D45_01,
  D45_02,
  D45_03,
  D45_04,
  D45_05,
  D45_06,
  D45_07,
  D45_08,
  D45_09,
  D45_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars45Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
