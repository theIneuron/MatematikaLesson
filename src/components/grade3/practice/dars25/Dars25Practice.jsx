// Dars 25 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D25_01 from './D25_01.jsx';
import D25_02 from './D25_02.jsx';
import D25_03 from './D25_03.jsx';
import D25_04 from './D25_04.jsx';
import D25_05 from './D25_05.jsx';
import D25_06 from './D25_06.jsx';
import D25_07 from './D25_07.jsx';
import D25_08 from './D25_08.jsx';
import D25_09 from './D25_09.jsx';
import D25_10 from './D25_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[25];
const QUESTIONS = [
  D25_01,
  D25_02,
  D25_03,
  D25_04,
  D25_05,
  D25_06,
  D25_07,
  D25_08,
  D25_09,
  D25_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars25Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
