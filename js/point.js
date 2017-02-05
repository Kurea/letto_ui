class Point {
  constructor(container, handle, type, acceptMultipleConnections) {
    this.type = type;
    this.acceptMultipleConnections = acceptMultipleConnections;
    this.lines = [];
    // create new div
    this.elem = container.ownerDocument.createElement('div');
    this.elem.className = "point";
    if (type == "out") {
      this.elem.className += " out";
    }
    this.elem.addEventListener("mousedown", CurrentLine.startLine, false);
    this.elem.jsObject = this;
    // add to document
    container.appendChild(this.elem);

    // save ref. to hendle
    this.handle = handle;

    // save ref. to point
    Point.all.push(this);
  }

  // get the x coordinate of the center of the point
  getX() {
    var rectPoint = this.elem.getBoundingClientRect();
    return rectPoint.left + ( ( rectPoint.right - rectPoint.left ) / 2 );;
  }

  // get the y coordinate of the center of the point
  getY() {
    var rectPoint = this.elem.getBoundingClientRect();
    return rectPoint.top + ( ( rectPoint.bottom - rectPoint.top ) / 2 );
  }

  // return true if the elem is located in the point
  contains(elem) {
    var rectPoint = this.elem.getBoundingClientRect();
    return (elem.x <= rectPoint.right) && (elem.x >= rectPoint.left) && (elem.y <= rectPoint.bottom) && (elem.y >= rectPoint.top);
  }

  // remove current point
  delete() {
    // remove attached lines
    //Line.each("deleteWithPoint", this);
    var i;
    for (i=0; i<this.lines.length; i++) {
      this.lines[i].delete();
    }
    // remove from DOM
    this.elem.remove();
    // remove from static list
    i = 0;
    while (Point.all[i] !== this) { i++; }
    Point.all.splice(i, 1);
  }

  addLine(line) {
    if (this.lines.length == 0 || this.acceptMultipleConnections) {
      this.lines.push(line);
      return true;
    }
    return false;
  }

  removeLine(line) {
    var i = 0;
    while (this.lines[i] !== line) { i++; }
    this.lines.splice(i, 1);
  }

  // execute the fn function on each points
  static each(fn, arg) {
    var l = Point.all.length;
    for (var i=l; i > 0; i--) {
      Point.all[i-1][fn](arg);
    }
  };

  // return the first point for wich le fn function return true
  static firstTo(fn, arg) {
    var l = Point.all.length;
    for (var i=0; i < l; i++) {
      if (Point.all[i][fn](arg)) {
        return Point.all[i];
      }
    }
  };

}
Point.all = [];
