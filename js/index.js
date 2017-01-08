
window.onload = function() {

  var currentLine;

  var startLine = function(e) {
    currentLine = new Line(document);
    currentLine.start(this.jsObject);
    document.onmousemove = function(e) {
      if (currentLine) {
        currentLine.updateFromMouse(e.pageX, e.pageY);
      }
    };
  }

  var cancelLine = function(e) {
    currentLine.delete();
    currentLine = null;
    document.onmousemove = function(e) {};
  }

  var endLine = function(point) {
    currentLine.end(point);
    currentLine = null;
    document.onmousemove = function(e) {};
  }

  var stopLine = function(e) {
    if (currentLine) {
      var point = Point.firstTo("contains", event)
      if (point)
      {
        endLine(point);
      }
      else {
        cancelLine();
      }
    }
  }

  var items = document.querySelectorAll('.draggable');
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    var draggie = new Draggabilly( item, {
    handle: '.handle'
    });
    draggie.on( 'dragMove', function( event, pointer, moveVector )
    {
      // todo for all lines
      Line.each("updateWithDraggie", event.target.parentNode);
    });
    for (j=0; j<3; j++) {
      point = new Point(item);
      point.addEventListener("mousedown", startLine, false);
    }
  }
  document.addEventListener("mouseup", stopLine, false);


}
