// Dars 39 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D39_01 from './D39_01.jsx';
import D39_02 from './D39_02.jsx';
import D39_03 from './D39_03.jsx';
import D39_04 from './D39_04.jsx';
import D39_05 from './D39_05.jsx';
import D39_06 from './D39_06.jsx';
import D39_07 from './D39_07.jsx';
import D39_08 from './D39_08.jsx';
import D39_09 from './D39_09.jsx';
import D39_10 from './D39_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[39];
const QUESTIONS = [
  D39_01,
  D39_02,
  D39_03,
  D39_04,
  D39_05,
  D39_06,
  D39_07,
  D39_08,
  D39_09,
  D39_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars39Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
