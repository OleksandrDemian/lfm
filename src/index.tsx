/* @refresh reload */
import {render} from 'solid-js/web';

import './style.css';
import App from './ui/App';

const appRoot = document.getElementById('app');
if (appRoot) {
  render(() => <App />, appRoot);
}