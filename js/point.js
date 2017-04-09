class Point {
  constructor (container, handle, type, name, acceptMultipleConnections) {
    this.type = type
    this.name = name
    this.acceptMultipleConnections = acceptMultipleConnections
    this.lines = []
    // create new div containing the whole point object with label
    this.elem = container.ownerDocument.createElement('div')
    if (type === 'out') {
      // if out, simple point
      this.elem.className = 'point'
      this.elem.className += ' out'
      this.point = this.elem
    } else {
      // if in add a label
      this.elem.className = 'input'
      this.point = container.ownerDocument.createElement('p')
      this.point.className = 'point'
      this.label = container.ownerDocument.createElement('p')
      this.label.className = 'inputlabel'
      this.label.innerHTML = this.name
      this.elem.appendChild(this.point)
      this.elem.appendChild(this.label)
    }

    // create a line on click on the point
    this.point.addEventListener('mousedown', CurrentLine.startLine, false)

    this.point.jsObject = this
    // add to document
    container.appendChild(this.elem)

    // save ref. to hendle
    this.handle = handle

    // save ref. to point
    Point.all.push(this)
  }

  // get the x coordinate of the center of the point
  getX () {
    var zoneElem = document.querySelector('.zone')
    var zoneOffsetX = zoneElem.offsetLeft - zoneElem.scrollLeft
    var pointLeft = this.point.getBoundingClientRect().left
    return pointLeft - zoneOffsetX + 7
  }

  // get the y coordinate of the center of the point
  getY () {
    var zoneElem = document.querySelector('.zone')
    var zoneOffsetY = zoneElem.offsetTop - zoneElem.scrollTop
    var pointTop = this.point.getBoundingClientRect().top
    return pointTop - zoneOffsetY + 7
  }

  // return true if the elem is located in the point
  contains (elem) {
    var rectPoint = this.point.getBoundingClientRect()
    return (elem.x <= rectPoint.right) && (elem.x >= rectPoint.left) && (elem.y <= rectPoint.bottom) && (elem.y >= rectPoint.top)
  }

  // remove current point
  delete () {
    // remove attached lines
    // Line.each('deleteWithPoint', this);
    var i
    for (i = this.lines.length - 1; i >= 0; i--) {
      this.lines[i].delete()
    }
    // remove from DOM
    this.elem.remove()
    // remove from static list
    i = 0
    while (Point.all[i] !== this) { i++ }
    Point.all.splice(i, 1)
  }

  // add a line to the point
  addLine (line) {
    if (this.lines.length === 0 || this.acceptMultipleConnections) {
      this.lines.push(line)
      return true
    }
    return false
  }

  // remove line from point
  removeLine (line) {
    var i = 0
    while (this.lines[i] !== line) { i++ }
    this.lines.splice(i, 1)
  }

  // return true if the point have at least one line
  hasLine () {
    return this.lines.length !== 0
  }

  // get handles at the other side of lines
  getOtherSideHandles () {
    var ln = this.lines.length
    var i
    var handles = []
    for (i = 0; i < ln; i++) {
      handles.push(this.lines[i].getOtherSideHandle(this))
    }
    return handles
  }

  // execute the fn function on each points
  static each (fn, arg) {
    var l = Point.all.length
    for (var i = l; i > 0; i--) {
      Point.all[i - 1][fn](arg)
    }
  };

  // return the first point for wich le fn function return true
  static firstTo (fn, arg) {
    var l = Point.all.length
    for (var i = 0; i < l; i++) {
      if (Point.all[i][fn](arg)) {
        return Point.all[i]
      }
    }
  };
}

Point.all = []
