// Dars 52 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D52_01 from './D52_01.jsx';
import D52_02 from './D52_02.jsx';
import D52_03 from './D52_03.jsx';
import D52_04 from './D52_04.jsx';
import D52_05 from './D52_05.jsx';
import D52_06 from './D52_06.jsx';
import D52_07 from './D52_07.jsx';
import D52_08 from './D52_08.jsx';
import D52_09 from './D52_09.jsx';
import D52_10 from './D52_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[52];
const QUESTIONS = [
  D52_01,
  D52_02,
  D52_03,
  D52_04,
  D52_05,
  D52_06,
  D52_07,
  D52_08,
  D52_09,
  D52_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars52Practice() {
  return <PracticeBank bank={BANK} />;
}
