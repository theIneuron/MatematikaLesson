// Dars 24 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D24_01 from './D24_01.jsx';
import D24_02 from './D24_02.jsx';
import D24_03 from './D24_03.jsx';
import D24_04 from './D24_04.jsx';
import D24_05 from './D24_05.jsx';
import D24_06 from './D24_06.jsx';
import D24_07 from './D24_07.jsx';
import D24_08 from './D24_08.jsx';
import D24_09 from './D24_09.jsx';
import D24_10 from './D24_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[24];
const QUESTIONS = [
  D24_01,
  D24_02,
  D24_03,
  D24_04,
  D24_05,
  D24_06,
  D24_07,
  D24_08,
  D24_09,
  D24_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars24Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
