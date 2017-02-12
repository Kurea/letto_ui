class Handle {
  constructor(container, name, args, style) {
    this.name = name;
    this.args = args;

    // create new draggable div
    this.elem = container.ownerDocument.createElement('div');
    this.elem.className = "draggable";
    this.elem.style = style;

    // create delete button
    if (this.name != "workflow") {
      var btnDelete = container.ownerDocument.createElement('img');
      btnDelete.className = "btndelete";
      btnDelete.src = "./images/close_pop.png";
      btnDelete.width = 20;
      btnDelete.height = 20;
      btnDelete.onclick = function(e) {
        if (confirm ("Vous allez supprimer ce module")){
          e.target.parentNode.jsObject.delete();
        }
      };
      this.elem.appendChild(btnDelete);
    }

    // create text
    var p = container.ownerDocument.createElement('p');
    p.className = "label"
    p.innerHTML = name;
    this.elem.appendChild(p);

    // add handle to page
    container.appendChild(this.elem);

    // make the handle draggable
    var draggie = new Draggabilly( this.elem, {
      //handle: '.handle',
      containment: '.zone'
    });

    // make the lines to update with the hanlce
    // TODO : update only the lines connected to the handle
    draggie.on('dragMove', function( event, pointer, moveVector ){
      // todo for all lines
      Line.each("updateWithDraggie", event.target.parentNode);
    });

    var inputIndxStart = 0;
    if (this.name == "workflow" || this.name == "value") {
      // replace input point with a field
      this.inputField = container.ownerDocument.createElement('input');
      this.inputField.className = "inputfield";
      this.inputField.type = "text";
      this.elem.appendChild(this.inputField);
      inputIndxStart = 1;
    }

    // create the inputs points and save refs to them
    this.in = [];
    var inPoints = args["inputs"];
    var acceptMultipleConnections;
    for (var i=inputIndxStart; i<inPoints.length; i++) {
      acceptMultipleConnections = (inPoints[i].slice(-4) == " (+)");
      this.in.push(new Point(this.elem, this, "in", inPoints[i], acceptMultipleConnections));
    }

    if (this.name !== "workflow") this.out = new Point(this.elem, this, "out");

    // save ref to this js object in the dom elem
    this.elem.jsObject = this;

    // update config

    Handle.all.push(this);
  }

  addEventListener(eventType, fn, disp) {
    this.elem.addEventListener(eventType, fn, disp);
  }

  // return true if the elem is located inside the handle
  contains(elem) {
    var rectPoint = this.elem.getBoundingClientRect();
    return (elem.x <= rectPoint.right) && (elem.x >= rectPoint.left) && (elem.y <= rectPoint.bottom) && (elem.y >= rectPoint.top);
  }

  // delte the current handle
  delete() {
    // delte output point
    if (this.out) this.out.delete();
    if (this.in){
      // delte input points
      for(var i=this.in.length-1; i>=0; i--) {
        this.in[i].delete();
      }
    }
    // remove child from DOM
    this.elem.remove();
    // remove from static list
    var i = 0;
    while (Handle.all[i] !== this) { i++; }
    Handle.all.splice(i, 1);
  }

  serialize() {
    var json = {};
    json["type"] = this.args["type"];
    if (this.args["name_arg"]) json[this.args["name_arg"]] = this.name;
    var hashToComplete = json;
    var jsonIndx = 0;
    var ln = this.args["inputs"].length;
    if (this.name == "workflow" || this.name == "value") {
      // what if the value should be numeric ?
      json[this.args["inputs"][jsonIndx]] = this.inputField.value;
      ln = ln - 1;
      jsonIndx++;
    }
    else if (this.args["type"] == "operation") {
      json["arguments"] = {};
      hashToComplete = json["arguments"];
    }
    var i;
    var otherSideHandles;
    var j, ln2;
    for (i = 0; i < ln; i++) {
      otherSideHandles = this.getOtherSideHandles(this.in[i]);
      ln2 = otherSideHandles.length;
      if (ln2 == 0) {
        hashToComplete[this.args["inputs"][jsonIndx]] = null;
      }
      else if (ln2 == 1) {
        hashToComplete[this.args["inputs"][jsonIndx]] = otherSideHandles[0].serialize();
      }
      else {
        // hash case to be completed
        hashToComplete[this.args["inputs"][jsonIndx]] = [];
        for (j = 0; j < ln2; j++) {
          hashToComplete[this.args["inputs"][jsonIndx]].push(otherSideHandles[j].serialize());
        }
      }
      jsonIndx++;
    }
    return json;
  }

  getOtherSideHandles(input) {
    return input.getOtherSideHandles();
  }

  setInputField(value) {
    if(this.inputField) {this.inputField.value = value;}
  }

  setStyle(style) {
    var i;
    var prop, val;
    var regex, cssString;
    for (i in style) {
      prop = i;
      val = style[i];
      this.elem.style[prop] = val;
    }
  }

  // execute fn function on each elem
  static each(fn, arg) {
    var l = Handle.all.length;
    for (var i=l; i > 0; i--) {
      Handle.all[i-1][fn](arg);
    }
  };

  // return the first point for wich le fn function return true
  static firstTo(fn, arg) {
    var l = Handle.all.length;
    for (var i=0; i < l; i++) {
      if (Handle.all[i][fn](arg)) {
        return Handle.all[i];
      }
    }
  };


}
Handle.all = [];
Handle.currentHandle = null;
