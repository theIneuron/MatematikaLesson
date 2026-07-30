import PracticeBank from '../PracticeBank.jsx';
import { DARS12_BANK } from '../newBanks.js';
import D12_01 from './D12_01.jsx';
import D12_02 from './D12_02.jsx';
import D12_03 from './D12_03.jsx';
import D12_04 from './D12_04.jsx';
import D12_05 from './D12_05.jsx';
import D12_06 from './D12_06.jsx';
import D12_07 from './D12_07.jsx';
import D12_08 from './D12_08.jsx';
import D12_09 from './D12_09.jsx';
import D12_10 from './D12_10.jsx';

const QUESTIONS = [
  D12_01,
  D12_02,
  D12_03,
  D12_04,
  D12_05,
  D12_06,
  D12_07,
  D12_08,
  D12_09,
  D12_10,
];
const BANK = {
  ...DARS12_BANK,
  items: DARS12_BANK.items.map((spec, index) => ({ ...spec, Component: QUESTIONS[index] })),
};

export default function Dars12Practice(runtimeProps) {
  return <PracticeBank bank={BANK} {...runtimeProps} />;
}
