import PracticeBank from '../PracticeBank.jsx';
import { DARS11_BANK } from '../newBanks.js';
import D11_01 from './D11_01.jsx';
import D11_02 from './D11_02.jsx';
import D11_03 from './D11_03.jsx';
import D11_04 from './D11_04.jsx';
import D11_05 from './D11_05.jsx';
import D11_06 from './D11_06.jsx';
import D11_07 from './D11_07.jsx';
import D11_08 from './D11_08.jsx';
import D11_09 from './D11_09.jsx';
import D11_10 from './D11_10.jsx';

const QUESTIONS = [
  D11_01,
  D11_02,
  D11_03,
  D11_04,
  D11_05,
  D11_06,
  D11_07,
  D11_08,
  D11_09,
  D11_10,
];
const BANK = {
  ...DARS11_BANK,
  items: DARS11_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars11Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
