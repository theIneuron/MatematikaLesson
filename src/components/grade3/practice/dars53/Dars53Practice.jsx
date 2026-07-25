// Dars 53 amaliyoti — 10 ta mustaqil jsx-question fayli.
import PracticeBank from '../PracticeBank.jsx';
import { GRADE3_THEORY_DERIVED_BANKS } from '../theoryDerivedBanks.js';
import D53_01 from './D53_01.jsx';
import D53_02 from './D53_02.jsx';
import D53_03 from './D53_03.jsx';
import D53_04 from './D53_04.jsx';
import D53_05 from './D53_05.jsx';
import D53_06 from './D53_06.jsx';
import D53_07 from './D53_07.jsx';
import D53_08 from './D53_08.jsx';
import D53_09 from './D53_09.jsx';
import D53_10 from './D53_10.jsx';

const BASE_BANK = GRADE3_THEORY_DERIVED_BANKS[53];
const QUESTIONS = [
  D53_01,
  D53_02,
  D53_03,
  D53_04,
  D53_05,
  D53_06,
  D53_07,
  D53_08,
  D53_09,
  D53_10,
];
const BANK = {
  ...BASE_BANK,
  items: BASE_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars53Practice() {
  return <PracticeBank bank={BANK} />;
}
