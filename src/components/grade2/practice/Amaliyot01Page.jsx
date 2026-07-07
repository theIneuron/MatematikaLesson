// Amaliyot01 sahifasi — LessonPage propssiz render qiladi, shuning uchun
// PracticeHost + mashq shu wrapper orqali ulanadi (registry Component'i).
import React from 'react';
import PracticeHost from './PracticeHost.jsx';
import Amaliyot01 from './Amaliyot01.jsx';

export default function Amaliyot01Page() {
  return <PracticeHost Question={Amaliyot01} title="Amaliyot 1. O'nliklar va birliklar" />;
}
