class Line {
  constructor(container) {
    // create new div
    this.elem = container.createElement('div');
    this.elem.className = "line";
    this.elem.jsObject = this;
    // update config
    container.querySelector('.zone').appendChild(this.elem);
    Line.all.push(this);

    // start the line from startPoint
//    this.start(startPoint);
  }

  // update the line display to match ethe geographic coordinates
  updateElement(x, y, length, angle) {
    var styles = 'width: ' + length + 'px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '
               + '-ms-transform: rotate(' + angle + 'rad); '
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; ';
    this.elem.setAttribute('style', styles);
  }

  // calculate the geographic coordinates to update line display with optional coordinates for end point
  update(x2, y2) {
    var x1 = this.startPoint.getX();
    var y1 = this.startPoint.getY();
    x2 = (typeof x2 !== 'undefined') ? x2 : this.endPoint.getX(),
    y2 = (typeof y2 !== 'undefined') ? y2 : this.endPoint.getY();

    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    this.updateElement(x, y, c, alpha);
  }

  // update line with draggable objects
  updateWithDraggie(draggie) {
//    if (this.startPoint.handle.elem == draggie || this.endPoint.handle.elem == draggie) {
      this.update();
//    }
  }

  // update from mouse coordinates (so that the line follows the mouse)
  updateFromMouse(x, y) {
    this.update(x, y);
  }

  // delete the line
  delete() {
    this.elem.remove();
    if (this.startPoint) this.startPoint.removeLine(this);
    if (this.endPoint) this.endPoint.removeLine(this);
    var i = 0;
    while (Line.all[i] !== this) { i++; }
    Line.all.splice(i, 1);
  }

  // start line from one point
  start(point) {
    if (point.addLine(this)) {
      this.startPoint = point;
      this.update(this.startPoint.getX(), this.startPoint.getY());
    }
    else {
      CurrentLine.removeEventAndRef();
      this.delete();
    }
  }

  // terminate line to one point if the point is not the start point and if the type of point is different (an input and an output) and the handle is different
  end(point) {
    if(this.isAValidEndPoint(point)) {
      this.endPoint = point;
      this.update();
      // add event to remove line
      this.elem.onclick = function(e) {
        if (confirm ("Vous allez supprimer cette ligne")){
          this.jsObject.delete();
        }
      }
    }
    else {
      CurrentLine.removeEventAndRef();
      this.delete();
    }
  }

  isAValidEndPoint(point) {
    return this.startPoint !== point && this.startPoint.type !== point.type && this.startPoint.handle !== point.handle && point.addLine(this);
  }

  getOtherSideHandle(point) {
    var otherSidePoint;
    if(this.startPoint == point) otherSidePoint = this.endPoint;
    if(this.endPoint == point) otherSidePoint = this.startPoint;
    return otherSidePoint.handle;
  }

  // delete line if the point is a start or an end point of the line
  //deleteWithPoint(point) {
  //  if (this.startPoint == point || this.endPoint == point) {
  //    this.delete();
  //  }
  //}

  // execute the fn function on each lines
  static each(fn, arg) {
    var l = Line.all.length;
    for (var i=l; i > 0; i--) {
      Line.all[i-1][fn](arg);
    }
};

}
Line.all = [];
