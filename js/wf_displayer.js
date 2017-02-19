var clearZone = function() {
  Handle.each("delete");
  addWorkflowBox();
}

var addWorkflowBox = function () {
  var zspace = document.querySelector('.zone').getBoundingClientRect();
  // workflow should be at the maximim right position
  var rpos = zspace.right - zspace.left - 105;
  // workflow shoud be in the middle of the zone
  var tpos = (zspace.bottom - zspace.top) / 2 - 50// add half the workflow box size
  var style = "left:" + rpos + "px; top:" + tpos + "px;"
  Menu.addModule("workflow", style);
}

var makeBeautiful = function() {
  var tlimit = 7;
  var lastModule = Handle.all[0];
  var colTlimit = [];
  colTlimit[0] = tlimit;
  setPos(lastModule, 0, tlimit, colTlimit);
  setColPos(lastModule, 0, colTlimit);
  Line.each("update");
  /*var lnoffset;
  var tnoffset;
  lnoffset = Math.max(loffset - 150, hlimit);
  tnoffset = Math.min(toffset + (i*110), vlimit);*/
}

/*
  1. set horizontal position in columns
  2. For each column, vertical align blocks at min(max(top of zone, bottom of the block over + 10 margin, in front of output block), bottom of zone - height of block),  then go to the block under
  	in front of output block = (top of output block + 1/2 height of output block) - height of current block
  3. For each column, starting at left, align output block in front of input blocks (and lower blocks under this one) until column 1
  	align output block =  top of first input + (bottom of last input - top of first input - height of output block) / 2 - 5
  4. reposition columns from end
*/
var setPos = function(m, colNum, tlimit, colTlimit) {
  // get the height of the current block
  var zspace = m.elem.getBoundingClientRect();
  var height = zspace.bottom - zspace.top;

  // calculate the vertical position : from parameter or bottom of the page
  var realtlimit = Math.max(tlimit - (height)/2, colTlimit[colNum]);
  // calculate the next column position
  var newColNum = colNum + 1//Math.max(rlimit - 130, llimit);
  // recurse on otherside Handles
  var otherSideHandles;
  var i, j;
  var ln = m.in.length, ln2;
  var newTlimit = realtlimit - height;
  var siblingVPos = {};
  siblingVPos["bottom"] = colTlimit[newColNum] || 0;
  var firstInputVPos;
  for(i=0; i<ln; i++) {
    // get the input blocks
    otherSideHandles = m.getOtherSideHandles(m.in[i]);
    ln2 = otherSideHandles.length;
    for(j=0; j<ln2; j++) {
      colTlimit[newColNum] = Math.max(colTlimit[newColNum] || 7, siblingVPos["bottom"]);
      // recurse on input blocks
      siblingVPos = setPos(otherSideHandles[j], newColNum, newTlimit, colTlimit);
      // save the first vertical input
      if (!firstInputVPos) firstInputVPos = siblingVPos["top"];
      // save the last vertical position in the column
      colTlimit[newColNum] = siblingVPos["bottom"];
    }
  }
  // set vertical position of the block
  if (ln > 0 && firstInputVPos) {
    realtlimit = firstInputVPos + (colTlimit[newColNum] - firstInputVPos - height) / 2 - 10;
    realtlimit = Math.max(realtlimit, colTlimit[colNum]);
  }
  // set the vertical position
  m.setStyle({"top": realtlimit + "px"});

  // set the horizontal position
  var colPos = colTlimit.length - colNum - 1;
  m.setStyle({"left": colPos*130 + "px"});

  // return the bottom position of this block
  return {"top" : realtlimit, "bottom" : realtlimit + height + 10};
}

var setColPos = function(m, colNum, colTlimit) {
  // set the horizontal position
  var colPos = colTlimit.length - colNum - 1;
  m.setStyle({"left": colPos*130 + "px"});
  var newColNum = colNum + 1;
  var i, j;
  var ln = m.in.length, ln2;
  var otherSideHandles;
  for(i=0; i<ln; i++) {
    // get the input blocks
    otherSideHandles = m.getOtherSideHandles(m.in[i]);
    ln2 = otherSideHandles.length;
    for(j=0; j<ln2; j++) {
      // recurse on input blocks
      setColPos(otherSideHandles[j], newColNum, colTlimit);
    }
  }

}

var displayWorkflow = function(wf) {
  Handle.each("delete");
  displayModule(wf);
  makeBeautiful();
}


var displayModule = function(wf, parent, inputn) {
  if (!wf) return;
  var name = wf[NAME_FROM_TYPE[wf["type"]]];
  var m = Menu.addModule(name);
  // add line between modules
  if (parent) {
    var l = new Line(document);
    l.start(parent.in[inputn]);
    l.end(m.out);
  }
  // if there is arguments, add them
  var args = wf["arguments"] || wf;
  var inputs = EXPECTED_HANDLE_ARGS[name]["inputs"];
  if (inputs) {
    var startInx = 0;
    if (name == "workflow" || name == "value") {
      m.setInputField(args[inputs[0]]);
      startInx = 1;
    }
    var i;
    var ln = inputs.length;
    for (i=startInx; i<ln; i++) {
      if (inputs[i].slice(-4) == " (+)") {
        var inputName = inputs[i].slice(0, -4);
        var j;
        var ln2 = args[inputName].length;
        if (ln2) {
          for (j=0; j < ln2; j++) {
            displayModule(args[inputName][j], m, i - startInx);
          }
        }
        else {
          for (j in args[inputName]) {
            displayModule(args[inputName][j], m, i - startInx);
          }
        }
      }
      else {
        displayModule(args[inputs[i]], m, i - startInx);
      }
    }
  }
}

var saveWorkflow = function() {
  // find the last handle, the one with no output connected
  var lastModule = Handle.all[0];
  if (lastModule) {
    var json = JSON.stringify(lastModule.serialize());
    console.log(json);
  }
  else {
    alert("last module not found");
  }
}
