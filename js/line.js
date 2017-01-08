class Line {
  constructor(container) {
    // create new div
    this.elem = container.createElement('div');
    this.elem.className = "line";
    this.elem.jsObject = this;
    // update config
    container.querySelector(".zone").appendChild(this.elem);
    Line.all.push(this);
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

  updateWithDraggie(draggie) {
    this.update();
  }

  updateFromMouse(x, y) {
    this.update(x, y);
  }

  delete() {
    this.elem.parentElement.removeChild(this.elem);
    var i = 0;
    while (Line.all[i] !== this) { i++; }
    Line.all.splice(i, 1);
  }

  start(point) {
    this.startPoint = point;
    this.update(this.startPoint.getX(), this.startPoint.getY());
  }

  end(point) {
    if(this.startPoint !== point) {
      this.endPoint = point;
      this.update();
    }
    else {
      this.delete();
    }
    this.elem.onclick = function(e) {
      if (confirm ("Vous allez supprimer cette ligne")){
        this.jsObject.delete();
      }
    }
  }

  static each(fn, arg) {
    var l = Line.all.length;
    for (var i=0; i < l; i++) {
      Line.all[i][fn](arg);
    }
};

}
Line.all = [];
