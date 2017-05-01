import CurrentLine from './current_line';
import Menu from './menu';
import {clearZone, displayWorkflow, saveWorkflow} from './wf_displayer';

window.addEventListener('load', function () {
  // If mouse up event occurs anywhere, execute stopLine function
  document.addEventListener('mouseup', CurrentLine.stopLine, false);

  var moduleslist = document.querySelector('.moduleslist > dl');
  new Menu(moduleslist);
  clearZone();

  document.getElementById('dispwf').addEventListener('click', displayWorkflow);
  document.getElementById('clear').addEventListener('click', clearZone);
  document.getElementById('savewf').addEventListener('click', test);
});

var test = function() {
  console.log(JSON.stringify(saveWorkflow()));
};
