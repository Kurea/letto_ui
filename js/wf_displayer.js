var clearZone = function() {
  Handle.each("delete");
  addWorkflowBox();
}

var addWorkflowBox = function () {
  var zspace = document.querySelector('.zone').getBoundingClientRect();
  // workflow should be at the maximim right position
  var rpos = zspace.right - 105;
  // workflow shoud be in the middle of the zone
  var tpos = zspace.top + (zspace.bottom - zspace.top) / 2 - 50// add half the workflow box size
  var style = "left:" + rpos + "px; top:" + tpos + "px;"
  Menu.addModule("workflow", style);
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
        for (j=0; j < ln2; j++) {
          displayModule(args[inputName][j], m, i - startInx);
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
