class CurrentLine {

  // start a new line
  static startLine(e) {
    // create new line with the clicked point as a start point
    CurrentLine.currentLine = new Line(document, this.jsObject);

    // Update the line to follow the mouse when it is moving (if a line is in progress)
    document.onmousemove = function(e) {
      if (CurrentLine.currentLine) {
        CurrentLine.currentLine.updateFromMouse(e.pageX, e.pageY);
      }
    };
  };

  // cancel current line
  static cancelLine(e) {
    // delete le line object
    CurrentLine.currentLine.delete();
    CurrentLine.currentLine = null;
  };

  // end the line and "validate" it
  static endLine(point) {
    // save the end point of the line
    CurrentLine.currentLine.end(point);
    CurrentLine.currentLine = null;
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
        CurrentLine.endLine(point);
      }
      else {
        // if no point was found, cancel line
        CurrentLine.cancelLine();
      }

      // remove the line update
      document.onmousemove = function(e) {};
    }
  };
}
