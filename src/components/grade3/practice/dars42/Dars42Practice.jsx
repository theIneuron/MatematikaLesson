// Dars 42 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D42_01 from './D42_01.jsx';
import D42_02 from './D42_02.jsx';
import D42_03 from './D42_03.jsx';
import D42_04 from './D42_04.jsx';
import D42_05 from './D42_05.jsx';
import D42_06 from './D42_06.jsx';
import D42_07 from './D42_07.jsx';
import D42_08 from './D42_08.jsx';
import D42_09 from './D42_09.jsx';
import D42_10 from './D42_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[42];
const QUESTIONS = [
  D42_01,
  D42_02,
  D42_03,
  D42_04,
  D42_05,
  D42_06,
  D42_07,
  D42_08,
  D42_09,
  D42_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars42Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
