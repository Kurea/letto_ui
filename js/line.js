class Line {
  constructor(container) {
    // create new div
    this.elem = container.createElement('div');
    this.elem.className = "line";
    // update config
    container.querySelector(".zone").appendChild(this.elem);
    Line.all.push(this);
    this.elem.onmouseup = function(e) {console.log("line up");}
  }

  updateFromStartPoint() {
    var rectPoint = this.startPoint.getBoundingClientRect();
    this.x1 = rectPoint.left + ( ( rectPoint.right - rectPoint.left )  / 2 );
    this.y1 = rectPoint.top + ( ( rectPoint.bottom - rectPoint.top ) / 2 );
  }

  updateFromEndPoint() {
    var rectPoint = this.endPoint.getBoundingClientRect();
    this.x2 = rectPoint.left + ( ( rectPoint.right - rectPoint.left ) / 2 );
    this.y2 = rectPoint.top + ( ( rectPoint.bottom - rectPoint.top ) / 2 );
  }

  start(point) {
    this.startPoint = point;
    this.updateFromStartPoint();
    this.x2 = this.x1;
    this.y2 = this.y2;
    this.update();
  }

  end(point) {
    if(this.startPoint !== point) {
      this.endPoint = point;
      this.updateFromEndPoint();
      this.update();
    }
    else {
      this.delete();
    }
  }

  delete() {
    this.elem.parentElement.removeChild(this.elem);
    var i = 0;
    while (Line.all[i] !== this) { i++; }
    Line.all.splice(i, 1);
  }

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

  update() {
    var a = this.x1 - this.x2,
        b = this.y1 - this.y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (this.x1 + this.x2) / 2,
        sy = (this.y1 + this.y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    this.updateElement(x, y, c, alpha);
  }

  updateWithDraggie(draggie) {
    var points = draggie.querySelectorAll(".point");
    for (var i = 0, l = points.length ; i<l ; i++) {
      point = points[i];
      if (this.startPoint === point) {
        this.updateFromStartPoint();
        this.update();
      }
      if (this.endPoint === point) {
        this.updateFromEndPoint();
        this.update();
      }
    }
  }

  updateFromMouse(x, y) {
    this.x2 = x;
    this.y2 = y;
    this.update();
  }

  static each(fn, arg) {
    var l = Line.all.length;
    for (var i=0; i < l; i++) {
      Line.all[i][fn](arg);
    }
};

}
Line.all = [];
