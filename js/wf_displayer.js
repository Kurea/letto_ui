var wf = {
  "type": "operation",
  "function": "api_call",
  "arguments": [
    {
      "type": "expression",
      "value": "PUT"
    },
    {
      "type": "expression",
      "value": "/cards/{{ action.data.card.id }}"
    },
    {
      "type": "payload",
      "arguments": [
        {
          "type": "expression",
          "value": "[Traité] {{ action.data.card.name }}"
        }
      ]
    }
  ]
};

var clearZone = function() {
  Handle.each("delete");
}

var displayWorkflow = function(wf) {
  clearZone();
  var zspace = document.querySelector(".zone").getBoundingClientRect();
  var loffset = zspace.right - 150;
  var toffset = zspace.top + 5;
  var vlimit = zspace.bottom;
  var hlimit = zspace.left;
  displayModule(wf, loffset, toffset, hlimit, vlimit);
}


var displayModule = function(wf, loffset, toffset, hlimit, vlimit, parent, inputn) {
  var args;
  var name;
  switch(wf["type"]) {
    case "operation" :
      args = EXPECTED_ARGS[wf["function"]];
      name = wf["function"];
      break;
    case "expression" :
      args = [];
      name = wf["type"];
      break;
    case "payload" :
      args = ["*","*"];
      name = wf["type"];
      break;
  }
  var m = Menu.addModule(name, args);
  m.elem.style = "left: "+loffset+"px; top: "+toffset+"px;";
  // add line between modules
  if (parent) {
    var l = new Line(document);
    l.start(parent.in[inputn]);
    l.end(m.out);
  }
  args = wf["arguments"];
  if (args) {
    var i;
    var lnoffset;
    var tnoffset;
    for (i=0, ln = args.length; i<ln; i++) {
      lnoffset = Math.max(loffset - 150, hlimit);
      tnoffset = Math.min(toffset + (i*110), vlimit);
      displayModule(args[i], lnoffset, tnoffset, hlimit, vlimit, m, i);
    }
  }
}

var saveWorkflow = function() {
  // find the last handle, the one with no output connected
  var lastModule = Handle.firstTo("hasNoOutput");
  if (lastModule) {
    var json = JSON.stringify(saveModule(lastModule));
    console.log(json);
  }
  else {
    alert("last module not found");
  }
}

var saveModule = function (handle) {
  var module = {};
  module["type"] = handle.name;
  if (module["type"] !== "expression" && module["type"] !== "payload") {
    module["function"] = handle.name;
    module["type"] = "operation";
  }
  if (handle.in.length > 0) {
    module["arguments"] = [];
    var n = 0;
    var i;
    var ln;
    var otherSideHandle;
    for (i = 0, ln = handle.in.length; i < ln; i++) {
      otherSideHandles = handle.getOtherSideHandles(i);
      var j;
      var ln2;
      for (j=0, ln2 = otherSideHandles.length; j < ln2; j++) {
        module["arguments"][n] = saveModule(otherSideHandles[j]);
        n = n + 1;
      }
    }
  }
  return module;
}
