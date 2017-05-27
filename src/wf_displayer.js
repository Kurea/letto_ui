import Handle from './handle';
import MenuX from './menu';
import Line from './line';
import { NAME_FROM_TYPE, EXPECTED_HANDLE_ARGS, WF } from './api';

export function clearZone () {
  Handle.each('delete');
  document.querySelector('.limitpoint').style = {left: '1px', right: '1px'};
  addWorkflowBox();
}

function addWorkflowBox () {
  var zspace = document.querySelector('.zone').getBoundingClientRect();
  // workflow should be at the maximim right position
  var rpos = zspace.right - zspace.left - 105;
  // workflow shoud be in the middle of the zone
  var tpos = (zspace.bottom - zspace.top) / 2 - 50; // add half the workflow box size
  var style = 'left:' + rpos + 'px; top:' + tpos + 'px;';
  MenuX.addModule('workflow', style);
}

// auto render the existing workflow
export function makeBeautiful () {
  var tlimit = 7;
  var lastModule = Handle.all[0];
  var colTlimit = [];
  colTlimit[0] = tlimit;
  var lastModuleVPos = setPos(lastModule, 0, tlimit, colTlimit);
  setColPos(lastModule, 0, colTlimit);
  Line.each('update');
  // position scroll on the workflow block
  var zspace = document.querySelector('.zone');
  var hScroll = Math.max(colTlimit.length * 130 - zspace.clientWidth, 0);
  var lastModuleMiddle = lastModuleVPos['top'] + (lastModuleVPos['bottom'] - lastModuleVPos['top']) / 2;
  var vScroll = Math.max(lastModuleMiddle - zspace.clientHeight / 2, 0);
  zspace.scrollTop = vScroll;
  zspace.scrollLeft = hScroll;
}

/*
  1. set horizontal position in columns
  2. For each column, vertical align blocks at min(max(top of zone, bottom of the block over + 10 margin, in front of output block), bottom of zone - height of block),  then go to the block under
    in front of output block = (top of output block + 1/2 height of output block) - height of current block
  3. For each column, starting at left, align output block in front of input blocks (and lower blocks under this one) until column 1
    align output block =  top of first input + (bottom of last input - top of first input - height of output block) / 2 - 5
  4. reposition columns from end
*/
function setPos (m, colNum, tlimit, colTlimit) {
  // get the height of the current block
  var zspace = m.elem.getBoundingClientRect();
  var height = zspace.bottom - zspace.top;

  // calculate the vertical position : from parameter or bottom of the column
  var realtlimit = Math.max(tlimit - (height) / 2, colTlimit[colNum]);
  // calculate the next column position
  var newColNum = colNum + 1;
  // init vars
  var otherSideHandles;
  var i, j;
  var ln = m.in.length;
  var ln2;
  var newTlimit = realtlimit; // input blocks are at least at actual top position
  var inputsVPos = {};
  inputsVPos['bottom'] = 0;
  var firstInputVPos;
  // recurse on otherside Handles : nb of inputs
  for (i = 0; i < ln; i++) {
    // get the input blocks for each input
    otherSideHandles = m.in[i].getOtherSideHandles();
    ln2 = otherSideHandles.length;
    for (j = 0; j < ln2; j++) {
      // inputs are positioned at 7 from top (first one) or below the previous one (last sibling or last in column)
      colTlimit[newColNum] = Math.max(colTlimit[newColNum] || 7, inputsVPos['bottom']);
      // recurse on input blocks
      inputsVPos = setPos(otherSideHandles[j], newColNum, newTlimit, colTlimit);
      // save the first vertical input
      if (!firstInputVPos) firstInputVPos = inputsVPos['top'];
      // save the last vertical position in the column
      colTlimit[newColNum] = inputsVPos['bottom'];
    }
  }
  // if block have inputs set and displayed
  if (ln > 0 && firstInputVPos) {
    // top of first input + (height of all inputs - height of actual block) / 2 - 10
    // center the current block in front of its inputs
    realtlimit = firstInputVPos + (colTlimit[newColNum] - firstInputVPos - height) / 2 - 10 / 2;
    // or display it at the bottom of its column (if lower)
    realtlimit = Math.max(realtlimit, colTlimit[colNum]);
  }
  // set the vertical position
  m.setStyle({'top': realtlimit + 'px'});

  // return the bottom position of this block
  return {'top': realtlimit, 'bottom': realtlimit + height + 10};
}

// set the horizontal position
function setColPos (m, colNum, colTlimit) {
  var colPos = colTlimit.length - colNum - 1;
  m.setStyle({'left': colPos * 130 + 'px'});
  var newColNum = colNum + 1;
  var i, j;
  var ln = m.in.length;
  var ln2;
  var otherSideHandles;
  for (i = 0; i < ln; i++) {
    // get the input blocks
    otherSideHandles = m.in[i].getOtherSideHandles();
    ln2 = otherSideHandles.length;
    for (j = 0; j < ln2; j++) {
      // recurse on input blocks
      setColPos(otherSideHandles[j], newColNum, colTlimit);
    }
  }
}

// display a workflow
export function displayWorkflow () {
  Handle.each('delete');
  displayModule(WF);
  makeBeautiful();
}


function displayModule (wf, parent, inputn) {
  if (!wf) return;
  var name = wf[NAME_FROM_TYPE[wf['type']]]; // get the the field containing the name of the handle from its type
  var m = MenuX.addModule(name); // create handle
  // add line between modules
  if (parent) {
    var l = new Line(document);
    l.start(parent.in[inputn]);
    l.end(m.out);
  }
  // if there is arguments, add them
  var args = wf['arguments'] || wf;
  var inputs = EXPECTED_HANDLE_ARGS[name]['inputs']; // get the input names from the handle name
  if (inputs) {
    var startInx = 0;
    if (name === 'workflow' || name === 'value') {
      m.setInputField(args[inputs[0]]); // get the value to complete the input field
      startInx = 1;
    }
    var i;
    var ln = inputs.length;
    for (i = startInx; i < ln; i++) {
      if (name === 'hash' || name === 'array') {
        var inputName = inputs[i];
        var j = 0;
        var k;
        var ln2 = args[inputName].length;
        if (ln2) {
          // array
          for (j = 0; j < ln2; j++) {
            displayModule(args[inputName][j], m, i - startInx);
          }
        } else {
          // hash
          var id = 0;
          m.removePointById(0);
          for (k in args[inputName]) {
            m.addInputValue(k);
            displayModule(args[inputName][k], m, id);
            id = id + 1;
          }
        }
      } else {
        displayModule(args[inputs[i]], m, i - startInx);
      }
    }
  }
}

// serialize a workflow
export function saveWorkflow () {
  // find the last handle, the one with no output connected
  var lastModule = Handle.all[0];
  if (lastModule) {
    var json = lastModule.serialize();
  } else {
    alert('last module not found');
  }
  return json;
}
