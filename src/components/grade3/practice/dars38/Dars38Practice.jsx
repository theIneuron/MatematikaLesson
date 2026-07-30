// Dars 38 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D38_01 from './D38_01.jsx';
import D38_02 from './D38_02.jsx';
import D38_03 from './D38_03.jsx';
import D38_04 from './D38_04.jsx';
import D38_05 from './D38_05.jsx';
import D38_06 from './D38_06.jsx';
import D38_07 from './D38_07.jsx';
import D38_08 from './D38_08.jsx';
import D38_09 from './D38_09.jsx';
import D38_10 from './D38_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[38];
const QUESTIONS = [
  D38_01,
  D38_02,
  D38_03,
  D38_04,
  D38_05,
  D38_06,
  D38_07,
  D38_08,
  D38_09,
  D38_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars38Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
