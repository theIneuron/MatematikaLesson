// Dars 35 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D35_01 from './D35_01.jsx';
import D35_02 from './D35_02.jsx';
import D35_03 from './D35_03.jsx';
import D35_04 from './D35_04.jsx';
import D35_05 from './D35_05.jsx';
import D35_06 from './D35_06.jsx';
import D35_07 from './D35_07.jsx';
import D35_08 from './D35_08.jsx';
import D35_09 from './D35_09.jsx';
import D35_10 from './D35_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[35];
const QUESTIONS = [
  D35_01,
  D35_02,
  D35_03,
  D35_04,
  D35_05,
  D35_06,
  D35_07,
  D35_08,
  D35_09,
  D35_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars35Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
