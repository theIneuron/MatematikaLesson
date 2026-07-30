import PracticeBank from '../PracticeBank.jsx';
import { DARS18_BANK } from '../newBanks.js';
import D18_01 from './D18_01.jsx';
import D18_02 from './D18_02.jsx';
import D18_03 from './D18_03.jsx';
import D18_04 from './D18_04.jsx';
import D18_05 from './D18_05.jsx';
import D18_06 from './D18_06.jsx';
import D18_07 from './D18_07.jsx';
import D18_08 from './D18_08.jsx';
import D18_09 from './D18_09.jsx';
import D18_10 from './D18_10.jsx';

const QUESTIONS = [
  D18_01,
  D18_02,
  D18_03,
  D18_04,
  D18_05,
  D18_06,
  D18_07,
  D18_08,
  D18_09,
  D18_10,
];
const BANK = {
  ...DARS18_BANK,
  items: DARS18_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars18Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
