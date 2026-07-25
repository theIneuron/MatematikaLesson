// Dars 55 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D55_01 from './D55_01.jsx';
import D55_02 from './D55_02.jsx';
import D55_03 from './D55_03.jsx';
import D55_04 from './D55_04.jsx';
import D55_05 from './D55_05.jsx';
import D55_06 from './D55_06.jsx';
import D55_07 from './D55_07.jsx';
import D55_08 from './D55_08.jsx';
import D55_09 from './D55_09.jsx';
import D55_10 from './D55_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[55];
const QUESTIONS = [
  D55_01,
  D55_02,
  D55_03,
  D55_04,
  D55_05,
  D55_06,
  D55_07,
  D55_08,
  D55_09,
  D55_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars55Practice() {
  return <PracticeBank bank={BANK} />;
}
