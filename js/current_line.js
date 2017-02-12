class CurrentLine {

  // start a new line
  static startLine(e) {
    e.stopPropagation(); // still needed ?

    // create new line with the clicked point as a start point
    CurrentLine.currentLine = new Line(document);
    CurrentLine.currentLine.start(this.jsObject);

    if (CurrentLine.currentLine) {
      // Update the line to follow the mouse when it is moving (if a line is in progress)
      document.onmousemove = function(e) {
        if (CurrentLine.currentLine) {
          CurrentLine.currentLine.updateFromMouse(e.pageX, e.pageY);
        }
      };
    }
  };

  // stop the line, either by canceling it or by ending it
  static stopLine(e) {
    // only if a line is currently drawn
    if (CurrentLine.currentLine) {
      // find the point where the mouse ended
      var point = Point.firstTo("contains", event)
      // if a point was found
      if (point)
      {
        // end the line
        CurrentLine.currentLine.end(point);
      }
      else {
        // if no point was found, cancel line
        CurrentLine.currentLine.delete();
      }
      CurrentLine.removeEventAndRef();
    }
  };

  static removeEventAndRef() {
    CurrentLine.currentLine = null;
    // remove the line update
    document.onmousemove = function(e) {};
  }
}
