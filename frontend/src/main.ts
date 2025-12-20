import App from './App.svelte';
import './styles/global.css';
import { mount } from 'svelte';

const target = document.getElementById('app');
if (target) {
  mount(App, { target });
}
