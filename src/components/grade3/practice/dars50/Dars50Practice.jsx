// Dars 50 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D50_01 from './D50_01.jsx';
import D50_02 from './D50_02.jsx';
import D50_03 from './D50_03.jsx';
import D50_04 from './D50_04.jsx';
import D50_05 from './D50_05.jsx';
import D50_06 from './D50_06.jsx';
import D50_07 from './D50_07.jsx';
import D50_08 from './D50_08.jsx';
import D50_09 from './D50_09.jsx';
import D50_10 from './D50_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[50];
const QUESTIONS = [
  D50_01,
  D50_02,
  D50_03,
  D50_04,
  D50_05,
  D50_06,
  D50_07,
  D50_08,
  D50_09,
  D50_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars50Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
