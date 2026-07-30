import PracticeBank from '../PracticeBank.jsx';
import { DARS10_BANK } from '../newBanks.js';
import D10_01 from './D10_01.jsx';
import D10_02 from './D10_02.jsx';
import D10_03 from './D10_03.jsx';
import D10_04 from './D10_04.jsx';
import D10_05 from './D10_05.jsx';
import D10_06 from './D10_06.jsx';
import D10_07 from './D10_07.jsx';
import D10_08 from './D10_08.jsx';
import D10_09 from './D10_09.jsx';
import D10_10 from './D10_10.jsx';

const QUESTIONS = [
  D10_01,
  D10_02,
  D10_03,
  D10_04,
  D10_05,
  D10_06,
  D10_07,
  D10_08,
  D10_09,
  D10_10,
];
const BANK = {
  ...DARS10_BANK,
  items: DARS10_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars10Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
