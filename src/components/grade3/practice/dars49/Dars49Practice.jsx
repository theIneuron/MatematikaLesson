// Dars 49 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D49_01 from './D49_01.jsx';
import D49_02 from './D49_02.jsx';
import D49_03 from './D49_03.jsx';
import D49_04 from './D49_04.jsx';
import D49_05 from './D49_05.jsx';
import D49_06 from './D49_06.jsx';
import D49_07 from './D49_07.jsx';
import D49_08 from './D49_08.jsx';
import D49_09 from './D49_09.jsx';
import D49_10 from './D49_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[49];
const QUESTIONS = [
  D49_01,
  D49_02,
  D49_03,
  D49_04,
  D49_05,
  D49_06,
  D49_07,
  D49_08,
  D49_09,
  D49_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars49Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
