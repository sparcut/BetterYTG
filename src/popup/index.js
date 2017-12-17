import { h, render } from 'preact';
import Popup from './Popup'; 

import 'stylus/popup.styl';

render(
  <Popup />,
  document.getElementById('container')
);