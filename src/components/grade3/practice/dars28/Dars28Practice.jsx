// Dars 28 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D28_01 from './D28_01.jsx';
import D28_02 from './D28_02.jsx';
import D28_03 from './D28_03.jsx';
import D28_04 from './D28_04.jsx';
import D28_05 from './D28_05.jsx';
import D28_06 from './D28_06.jsx';
import D28_07 from './D28_07.jsx';
import D28_08 from './D28_08.jsx';
import D28_09 from './D28_09.jsx';
import D28_10 from './D28_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[28];
const QUESTIONS = [
  D28_01,
  D28_02,
  D28_03,
  D28_04,
  D28_05,
  D28_06,
  D28_07,
  D28_08,
  D28_09,
  D28_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars28Practice() {
  return <PracticeBank bank={BANK} />;
}
