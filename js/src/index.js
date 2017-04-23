import CurrentLine from './current_line';
import Menu from './menu';
import {clearZone, displayWorkflow} from './wf_displayer';

window.onload = function () {
  // If mouse up event occurs anywhere, execute stopLine function
  document.addEventListener('mouseup', CurrentLine.stopLine, false);

  var moduleslist = document.querySelector('.moduleslist > dl');
  new Menu(moduleslist);
  clearZone();

  document.getElementById('dispwf').addEventListener('click', displayWorkflow);
  document.getElementById('clear').addEventListener('click', clearZone);
};
