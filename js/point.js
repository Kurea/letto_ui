class Point {
  constructor(container) {
    // create new div
    this.elem = container.ownerDocument.createElement('div');
    this.elem.className = "point";
    this.elem.jsObject = this;
    // update config
    container.appendChild(this.elem);
    Point.all.push(this);
  }

  getX() {
    var rectPoint = this.elem.getBoundingClientRect();
    return rectPoint.left + ( ( rectPoint.right - rectPoint.left ) / 2 );;
  }

  getY() {
    var rectPoint = this.elem.getBoundingClientRect();
    return rectPoint.top + ( ( rectPoint.bottom - rectPoint.top ) / 2 );
  }

  addEventListener(eventType, fn, disp) {
    this.elem.addEventListener(eventType, fn, disp);
  }

  contains(elem) {
    var rectPoint = this.elem.getBoundingClientRect();
    return (elem.x <= rectPoint.right) && (elem.x >= rectPoint.left) && (elem.y <= rectPoint.bottom) && (elem.y >= rectPoint.top);
  }

  static each(fn, arg) {
    var l = Point.all.length;
    for (var i=0; i < l; i++) {
      Point.all[i][fn](arg);
    }
  };

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
