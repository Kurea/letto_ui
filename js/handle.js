class Handle {
  constructor(container, name,inPoints) {
    this.name = name;

    // create new draggable div
    this.elem = container.ownerDocument.createElement('div');
    this.elem.className = "draggable";

    // create the handle div
    var h = container.ownerDocument.createElement('div');
    h.className = "handle"
    this.elem.appendChild(h);

    // add handle to page
    container.appendChild(this.elem);

    // make the handle draggable
    var draggie = new Draggabilly( this.elem, {
      handle: '.handle',
      containment: '.zone'
    });

    // make the lines to update with the hanlce
    // TODO : update only the lines connected to the handle
    draggie.on('dragMove', function( event, pointer, moveVector ){
      // todo for all lines
      Line.each("updateWithDraggie", event.target.parentNode);
    });

    draggie.on( 'staticClick', function(event, pointer) {
      document.querySelector('#modale').style.display = 'block';
      document.querySelector('#modulename').innerHTML = event.target.parentNode.jsObject.name;
      Handle.currentHandle = event.target.parentNode.jsObject;
      document.querySelector('#deletemodule').onclick = function(e) {
        document.querySelector('#modale').style.display = 'none';
        Handle.currentHandle.delete();
        Handle.currentHandle = null;
      };
    });

    // create the inputs points and save refs to them
    this.in = [];
    for (var i=0; i<inPoints; i++) {
      this.in.push(new Point(this.elem, this, "in"));
    }

    this.out = new Point(this.elem, this, "out");

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
    this.out.delete();
    // delte input points
    for(var i=0, ln = this.in.length; i<ln; i++) {
      this.in[i].delete();
    }
    // remove child from DOM
    this.elem.parentElement.removeChild(this.elem, false);
    // remove from static list
    var i = 0;
    while (Handle.all[i] !== this) { i++; }
    Handle.all.splice(i, 1);
  }

  // execute fn function on each elem
  static each(fn, arg) {
    var l = Point.all.length;
    for (var i=l; i > 0; i--) {
      Point.all[i-1][fn](arg);
    }
  };

}
Handle.all = [];
Handle.currentHandle = null;
