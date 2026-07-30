// Dars 26 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D26_01 from './D26_01.jsx';
import D26_02 from './D26_02.jsx';
import D26_03 from './D26_03.jsx';
import D26_04 from './D26_04.jsx';
import D26_05 from './D26_05.jsx';
import D26_06 from './D26_06.jsx';
import D26_07 from './D26_07.jsx';
import D26_08 from './D26_08.jsx';
import D26_09 from './D26_09.jsx';
import D26_10 from './D26_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[26];
const QUESTIONS = [
  D26_01,
  D26_02,
  D26_03,
  D26_04,
  D26_05,
  D26_06,
  D26_07,
  D26_08,
  D26_09,
  D26_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars26Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
