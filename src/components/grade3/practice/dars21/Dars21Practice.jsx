// Dars 21 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D21_01 from './D21_01.jsx';
import D21_02 from './D21_02.jsx';
import D21_03 from './D21_03.jsx';
import D21_04 from './D21_04.jsx';
import D21_05 from './D21_05.jsx';
import D21_06 from './D21_06.jsx';
import D21_07 from './D21_07.jsx';
import D21_08 from './D21_08.jsx';
import D21_09 from './D21_09.jsx';
import D21_10 from './D21_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[21];
const QUESTIONS = [
  D21_01,
  D21_02,
  D21_03,
  D21_04,
  D21_05,
  D21_06,
  D21_07,
  D21_08,
  D21_09,
  D21_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars21Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
