
window.onload = function() {

  var currentLine;

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
  }

  var startLine = function(e) {
    currentLine = new Line(document);
    currentLine.start(e.target);
    document.onmousemove = function(e) {
      if (currentLine) {
        currentLine.updateFromMouse(e.pageX, e.pageY);
      }
    };
  }

  var stopLine = function(e) {
    console.log("stopLine");
    currentLine.end(e.target);
    currentLine = null;
    document.onmousemove = function(e) {};
  }

  var cancelLine = function(e) {
    console.log("doc mouse up");
    if (currentLine) {
      console.log("cancelLine");
      currentLine.delete();
      currentLine = null;
      document.onmousemove = function(e) {};
    }
  }

  var points = document.querySelectorAll('.point');
  for ( var i=0, len = points.length; i < len; i++ ) {
    point = points[i];
    point.addEventListener("mousedown", startLine, false);
    point.addEventListener("mouseup", stopLine, false);
  }
  document.addEventListener("mouseup", cancelLine, false);


}
