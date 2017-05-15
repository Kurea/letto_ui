import CurrentLine from './current_line';
import Menu from './menu';
import {clearZone, displayWorkflow, saveWorkflow, makeBeautiful} from './wf_displayer';

// on load, add events listener and init menu
window.addEventListener('load', function () {
  // If mouse up event occurs anywhere, execute stopLine function
  document.addEventListener('mouseup', CurrentLine.stopLine, false);

  var moduleslist = document.querySelector('.moduleslist > dl');
  new Menu(moduleslist);
  clearZone();

  document.getElementById('dispwf').addEventListener('click', displayWorkflow);
  document.getElementById('clear').addEventListener('click', clearZone);
  document.getElementById('savewf').addEventListener('click', test);
  document.getElementById('beauty').addEventListener('click', makeBeautiful);
});

var test = function() {
  console.log(JSON.stringify(saveWorkflow()));
};

// parse text to a boolean
Boolean.parse = function(val) {
  if (/^(true|1)$/i.test(val)) return true;
  if (/^(false|0)$/i.test(val)) return false;
  return undefined;
};
