class Point {
  constructor(container, handle) {
    // create new div
    this.elem = container.ownerDocument.createElement('div');
    this.elem.className = "point";
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

  // execute the fn function on each points
  static each(fn, arg) {
    var l = Point.all.length;
    for (var i=0; i < l; i++) {
      Point.all[i][fn](arg);
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
