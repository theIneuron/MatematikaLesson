// Dars 40 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D40_01 from './D40_01.jsx';
import D40_02 from './D40_02.jsx';
import D40_03 from './D40_03.jsx';
import D40_04 from './D40_04.jsx';
import D40_05 from './D40_05.jsx';
import D40_06 from './D40_06.jsx';
import D40_07 from './D40_07.jsx';
import D40_08 from './D40_08.jsx';
import D40_09 from './D40_09.jsx';
import D40_10 from './D40_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[40];
const QUESTIONS = [
  D40_01,
  D40_02,
  D40_03,
  D40_04,
  D40_05,
  D40_06,
  D40_07,
  D40_08,
  D40_09,
  D40_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars40Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
