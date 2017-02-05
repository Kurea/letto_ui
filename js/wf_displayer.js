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
  console.log(zspace);
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
