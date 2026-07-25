import PracticeBank from '../PracticeBank.jsx';
import { DARS17_BANK } from '../newBanks.js';
import D17_01 from './D17_01.jsx';
import D17_02 from './D17_02.jsx';
import D17_03 from './D17_03.jsx';
import D17_04 from './D17_04.jsx';
import D17_05 from './D17_05.jsx';
import D17_06 from './D17_06.jsx';
import D17_07 from './D17_07.jsx';
import D17_08 from './D17_08.jsx';
import D17_09 from './D17_09.jsx';
import D17_10 from './D17_10.jsx';

const QUESTIONS = [
  D17_01,
  D17_02,
  D17_03,
  D17_04,
  D17_05,
  D17_06,
  D17_07,
  D17_08,
  D17_09,
  D17_10,
];
const BANK = {
  ...DARS17_BANK,
  items: DARS17_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars17Practice() {
  return <PracticeBank bank={BANK} />;
}
