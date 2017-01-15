class PlusMenu {
  constructor(div) {
    this.elem = div
    this.elem.jsObject = this;
    this.elem.addEventListener("click", this.toggleBtnsVisibility);
  }

  toggleBtnsVisibility(e) {
    var fnbtns = document.querySelectorAll(".fnbtn");
    var fnbtn;
    for(var i=0, ln=fnbtns.length; i<ln; i++) {
      fnbtn = fnbtns[i]
      if (!fnbtn.className.includes("plusbtn")) {
        if (fnbtn.style.display == "none") {
            fnbtn.style.display = "block";
        }
        else {
          fnbtn.style.display = "none";
        }
      }
    }
  }

}
