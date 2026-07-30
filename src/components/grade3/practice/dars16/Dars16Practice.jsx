import PracticeBank from '../PracticeBank.jsx';
import { DARS16_BANK } from '../newBanks.js';
import D16_01 from './D16_01.jsx';
import D16_02 from './D16_02.jsx';
import D16_03 from './D16_03.jsx';
import D16_04 from './D16_04.jsx';
import D16_05 from './D16_05.jsx';
import D16_06 from './D16_06.jsx';
import D16_07 from './D16_07.jsx';
import D16_08 from './D16_08.jsx';
import D16_09 from './D16_09.jsx';
import D16_10 from './D16_10.jsx';

const QUESTIONS = [
  D16_01,
  D16_02,
  D16_03,
  D16_04,
  D16_05,
  D16_06,
  D16_07,
  D16_08,
  D16_09,
  D16_10,
];
const BANK = {
  ...DARS16_BANK,
  items: DARS16_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars16Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
