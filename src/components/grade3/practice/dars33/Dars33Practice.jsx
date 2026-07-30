// Dars 33 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D33_01 from './D33_01.jsx';
import D33_02 from './D33_02.jsx';
import D33_03 from './D33_03.jsx';
import D33_04 from './D33_04.jsx';
import D33_05 from './D33_05.jsx';
import D33_06 from './D33_06.jsx';
import D33_07 from './D33_07.jsx';
import D33_08 from './D33_08.jsx';
import D33_09 from './D33_09.jsx';
import D33_10 from './D33_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[33];
const QUESTIONS = [
  D33_01,
  D33_02,
  D33_03,
  D33_04,
  D33_05,
  D33_06,
  D33_07,
  D33_08,
  D33_09,
  D33_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars33Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
