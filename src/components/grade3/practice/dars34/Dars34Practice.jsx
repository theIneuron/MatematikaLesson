// Dars 34 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D34_01 from './D34_01.jsx';
import D34_02 from './D34_02.jsx';
import D34_03 from './D34_03.jsx';
import D34_04 from './D34_04.jsx';
import D34_05 from './D34_05.jsx';
import D34_06 from './D34_06.jsx';
import D34_07 from './D34_07.jsx';
import D34_08 from './D34_08.jsx';
import D34_09 from './D34_09.jsx';
import D34_10 from './D34_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[34];
const QUESTIONS = [
  D34_01,
  D34_02,
  D34_03,
  D34_04,
  D34_05,
  D34_06,
  D34_07,
  D34_08,
  D34_09,
  D34_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars34Practice() {
  return <PracticeBank bank={BANK} />;
}
