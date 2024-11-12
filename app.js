console.log("app.js loaded");

var wires = [];
var gates = [];
var terminals = [];

var inputs = [];
var output = null;

var on_finish = [];

const State = Object.freeze({
  ON: true,
  OFF: false
});

class Terminal {
  constructor(e) {
    this.is_source = false;
    this.state = State.OFF;
    this.dom_element = e;
    terminals.push(this);
  }

  remove(){
    var index = terminals.indexOf(this);
    terminals.splice(index, 1);
  }
}

class Wire {
  constructor(terminal1, terminal2) {
    this.terminal1 = terminal1;
    this.terminal2 = terminal2;
    this.state = State.OFF;
    wires.push(this);
  }

  remove(){
    if(!this.terminal1.is_source){
      this.terminal1.state = State.OFF;
    }
    if(!this.terminal2.is_source){
      this.terminal2.state = State.OFF;
    }
    var index = wires.indexOf(this);
    wires.splice(index, 1);
  }
}

class Gate{
  constructor(func){
    this.func = func;
    this.in1 = new Terminal();
    this.in2 = new Terminal();
    this.out = new Terminal();
    this.out.is_source = true;
    this.dom_element = null;
    gates.push(this);
  }

  update(){
    this.out.state = this.func(this.in1.state, this.in2.state);
  }

  setDomElement(e){
    this.dom_element = e;
  }

  delete(){
    getWiresFrom(this.in1).forEach(w => w.remove());
    getWiresFrom(this.in2).forEach(w => w.remove());
    getWiresFrom(this.out).forEach(w => w.remove());
    var index = gates.indexOf(this);
    gates.splice(index, 1);
  }

}

last_state = ""
stable_count = 0
finished = false

var div = document.getElementById("app");
div.style.backgroundColor = "#aaa";
div.style.width = "512px";
div.style.height = "480px";
div.style.position = "relative";

var canvas = document.createElement("canvas");
canvas.width = 512;
canvas.height = 480;
canvas.style.position = "absolute";
canvas.style.left = div.style.left;
canvas.style.top = div.style.top;
div.appendChild(canvas);

var sline = document.getElementById("straight-line");

var clearTableBG = function(){
  var $trs = $("#truthtable tr");
  for(var i = 1; i < $trs.length; i++){
    var $tr = $trs.eq(i);
    $tr.css("background-color", "");
  }
}

var resetFinished = function(){
  finished = false;
  stable_count = 0;
}

$("#truthtable tr").click(function(){
  clearTableBG();
  resetFinished();
  $(this).css("background-color", "yellow");
  var $tr = $(this);
  var s1 = $tr.find("td").eq(0).text();
  var s2 = $tr.find("td").eq(1).text();
  var s3 = $tr.find("td").eq(2).text();
  var s4 = $tr.find("td").eq(3).text();
  var states = [s1, s2, s3, s4];

  for(var i = 0; i < states.length; i++){
    var input = inputs[i];
    if(states[i] === "1"){
      input.state = State.ON;
    }else{
      input.state = State.OFF;
    }
  }
});

$("#checkall").click(async function(){
  clearTableBG();
  resetFinished();
  this.disabled = true;
  var $trs = $("#truthtable tr");
  for(var i = 1; i < $trs.length; i++){
    var $tr = $trs.eq(i);
    $tr.css("background-color", "yellow");
    var s1 = $tr.find("td").eq(0).text();
    var s2 = $tr.find("td").eq(1).text();
    var s3 = $tr.find("td").eq(2).text();
    var s4 = $tr.find("td").eq(3).text();
    var states = [s1, s2, s3, s4];

    for(var j = 0; j < states.length; j++){
      var input = inputs[j];
      if(states[j] === "1"){
        input.state = State.ON;
      }else{
        input.state = State.OFF;
      }
    }
    finished = false;
    stable_count = 0;

    // while(!finished){
    //   await new Promise(r => setTimeout(r, 100));
    // }

    await new Promise(r => {
      on_finish.push(r);
    });

    console.log(output)

    var expected_output = $tr.find("td").eq(4).text() === "1" ? State.ON : State.OFF;
    var actual_output = output.in1.state;
    if(actual_output === expected_output){
      $tr.css("background-color", "green");
    }else{
      $tr.css("background-color", "red");
    }
  }
  this.disabled = false;
});

function NewAndGate(){
  var gate = new Gate((a, b) => a && b);
  return gate;
}

function NewOrGate(){
  var gate = new Gate((a, b) => a || b);
  return gate;
}

function NewXorGate(){
  var gate = new Gate((a, b) => a !== b);
  return gate;
}

function NewNullGate(){
  var gate = new Gate((a, b) => false);
  gate.func = (a, b) => gate.out.state;
  return gate;
}

function NewNotGate(){
  var gate = new Gate((a, b) => !a);
  return gate;
}

function onHoverBoarder(e) {
  e.addEventListener("mouseover", function () {
    e.style.border = "1px solid white";
  });
  e.addEventListener("mouseout", function () {
    e.style.border = "none";
  });
}

class Dragable{
  constructor(gate){
    this.e = gate.dom_element;
    this.isMouseDown = false;
    this.offsetX = 0;
    this.offsetY = 0;

    this.e.addEventListener("mousedown", (event) => {
      this.isMouseDown = true;
      this.offsetX = event.offsetX;
      this.offsetY = event.offsetY;
    });
    this.e.addEventListener("mouseup", (event) => {
      this.isMouseDown = false;
      this.e.style.left = Math.round(parseInt(this.e.style.left) / 10) * 10 + "px";
      this.e.style.top = Math.round(parseInt(this.e.style.top) / 10) * 10 + "px";
    });
    this.e.addEventListener("mousemove", (event) => {
      if (this.isMouseDown) {
        this.e.style.left = event.clientX - this.offsetX + "px";
        this.e.style.top = event.clientY - this.offsetY + "px";
      }
    });
    this.e.addEventListener("mouseout", (event) => {
      this.isMouseDown = false;
      this.e.style.left = Math.round(parseInt(this.e.style.left) / 10) * 10 + "px";
    });
}
}

class Removeable{
  constructor(gate){
    this.e = gate.dom_element;
    this.e.addEventListener("dblclick", () => {
      this.e.remove();
      gate.delete();
    });
  }
}

function onClickFunction(e, func) {
  e.addEventListener("click", func);
}

function createAndGate(left, top) {
  var gate = document.createElement("div");
  gate.style.width = "50px";
  gate.style.height = "50px";
  gate.style.backgroundColor = "red";
  gate.style.position = "absolute";
  gate.style.left = `${left}px`;
  gate.style.top = `${top}px`;

  gate.style.borderRadius = "0px 25px 25px 0px";

  var terminal1 = document.createElement("div");
  terminal1.style.width = "10px";
  terminal1.style.height = "10px";
  terminal1.style.backgroundColor = "black";
  terminal1.style.position = "absolute";
  terminal1.style.left = "0px";
  terminal1.style.top = "10px";
  onHoverBoarder(terminal1);
  gate.appendChild(terminal1);

  var terminal2 = document.createElement("div");
  terminal2.style.width = "10px";
  terminal2.style.height = "10px";
  terminal2.style.backgroundColor = "black";
  terminal2.style.position = "absolute";
  terminal2.style.left = "0px";
  terminal2.style.bottom = "10px";
  onHoverBoarder(terminal2);
  gate.appendChild(terminal2);

  var terminal3 = document.createElement("div");
  terminal3.style.width = "10px";
  terminal3.style.height = "10px";
  terminal3.style.backgroundColor = "black";
  terminal3.style.position = "absolute";
  terminal3.style.right = "0px";
  terminal3.style.top = "20px";
  onHoverBoarder(terminal3);
  gate.appendChild(terminal3);

  var _gate = NewAndGate();
  _gate.setDomElement(gate);
  _gate.in1.dom_element = terminal1;
  _gate.in2.dom_element = terminal2;
  _gate.out.dom_element = terminal3;
  _gate.out.is_source = true;

  terminal1.addEventListener("click", function(){
    makeConnection(_gate.in1);
  });
  terminal2.addEventListener("click", function(){
    makeConnection(_gate.in2);
  });
  terminal3.addEventListener("click", function(){
    makeConnection(_gate.out);
  });

  div.appendChild(gate);

  new Dragable(_gate);
  new Removeable(_gate);

  return _gate;
}

function createOrGate(left, top) {
  var gate = document.createElement("div");
  gate.style.width = "50px";
  gate.style.height = "50px";
  gate.style.backgroundColor = "orange";
  gate.style.position = "absolute";
  gate.style.left = `${left}px`;
  gate.style.top = `${top}px`;

  gate.style.borderRadius = "0px 25px 25px 0px";

  var terminal1 = document.createElement("div");
  terminal1.style.width = "10px";
  terminal1.style.height = "10px";
  terminal1.style.backgroundColor = "black";
  terminal1.style.position = "absolute";
  terminal1.style.left = "0px";
  terminal1.style.top = "10px";
  onHoverBoarder(terminal1);
  gate.appendChild(terminal1);

  var terminal2 = document.createElement("div");
  terminal2.style.width = "10px";
  terminal2.style.height = "10px";
  terminal2.style.backgroundColor = "black";
  terminal2.style.position = "absolute";
  terminal2.style.left = "0px";
  terminal2.style.bottom = "10px";
  onHoverBoarder(terminal2);
  gate.appendChild(terminal2);

  var terminal3 = document.createElement("div");
  terminal3.style.width = "10px";
  terminal3.style.height = "10px";
  terminal3.style.backgroundColor = "black";
  terminal3.style.position = "absolute";
  terminal3.style.right = "0px";
  terminal3.style.top = "20px";
  onHoverBoarder(terminal3);
  gate.appendChild(terminal3);

  var _gate = NewOrGate();
  _gate.setDomElement(gate);
  _gate.in1.dom_element = terminal1;
  _gate.in2.dom_element = terminal2;
  _gate.out.dom_element = terminal3;
  _gate.out.is_source = true;

  terminal1.addEventListener("click", function(){
    makeConnection(_gate.in1);
  });
  terminal2.addEventListener("click", function(){
    makeConnection(_gate.in2);
  });
  terminal3.addEventListener("click", function(){
    makeConnection(_gate.out);
  });

  div.appendChild(gate);

  new Dragable(_gate);
  new Removeable(_gate);

  return _gate;
}

function createNotGate(left, top) {
  var gate = document.createElement("div");
  gate.style.width = "50px";
  gate.style.height = "50px";
  gate.style.backgroundColor = "yellow";
  gate.style.position = "absolute";
  gate.style.left = `${left}px`;
  gate.style.top = `${top}px`;
  gate.style.borderRadius = "0px 25px 25px 0px";

  var terminal1 = document.createElement("div");
  terminal1.style.width = "10px";
  terminal1.style.height = "10px";
  terminal1.style.backgroundColor = "black";
  terminal1.style.position = "absolute";
  terminal1.style.left = "0px";
  terminal1.style.top = "20px";
  onHoverBoarder(terminal1);
  gate.appendChild(terminal1);

  var terminal2 = document.createElement("div");
  terminal2.style.width = "10px";
  terminal2.style.height = "10px";
  terminal2.style.backgroundColor = "black";
  terminal2.style.position = "absolute";
  terminal2.style.right = "0px";
  terminal2.style.top = "20px";
  onHoverBoarder(terminal2);
  gate.appendChild(terminal2);

  var _gate = NewNotGate();
  _gate.setDomElement(gate);
  _gate.in1.dom_element = terminal1;
  _gate.out.dom_element = terminal2;
  _gate.out.is_source = true;

  terminal1.addEventListener("click", function(){
    makeConnection(_gate.in1);
  });
  terminal2.addEventListener("click", function(){
    makeConnection(_gate.out);
  });

  div.appendChild(gate);

  new Dragable(_gate);
  new Removeable(_gate);

  return _gate;
}


function createSwitch(left, top) {
  var gate = document.createElement("div");
  gate.style.width = "50px";
  gate.style.height = "50px";
  gate.style.backgroundColor = "#44f";
  gate.style.position = "absolute";
  gate.style.left = `${left}px`;
  gate.style.top = `${top}px`;

  var terminal1 = document.createElement("div");
  terminal1.style.width = "10px";
  terminal1.style.height = "10px";
  terminal1.style.backgroundColor = "black";
  terminal1.style.position = "absolute";
  terminal1.style.right = "0px";
  terminal1.style.top = "20px";
  onHoverBoarder(terminal1);
  gate.appendChild(terminal1);

  var _gate = NewNullGate();
  _gate.setDomElement(gate);
  _gate.out.dom_element = terminal1;
  _gate.out.is_source = true;

  terminal1.addEventListener("click", function(){
    makeConnection(_gate.out);
  });

  gate.addEventListener("click", function(){
    _gate.out.state = !_gate.out.state;
  });

  div.appendChild(gate);

  inputs.push(_gate.out);

  new Dragable(_gate);
  new Removeable(_gate);

  return _gate;
}

function createOutput(left, top) {
  var gate = document.createElement("div");
  gate.style.width = "50px";
  gate.style.height = "50px";
  gate.style.backgroundColor = "#44f";
  gate.style.position = "absolute";
  gate.style.left = `${left}px`;
  gate.style.top = `${top}px`;

  var terminal1 = document.createElement("div");
  terminal1.style.width = "10px";
  terminal1.style.height = "10px";
  terminal1.style.backgroundColor = "black";
  terminal1.style.position = "absolute";
  terminal1.style.left = "0px";
  terminal1.style.top = "20px";
  onHoverBoarder(terminal1);
  gate.appendChild(terminal1);

  var _gate = NewNullGate();
  _gate.setDomElement(gate);
  _gate.in1.dom_element = terminal1;

  terminal1.addEventListener("click", function(){
    makeConnection(_gate.in1);
  });

  div.appendChild(gate);

  new Dragable(_gate);
  new Removeable(_gate);

  return _gate;
}

function getWiresFrom(t){
  var result = [];
  for(var i = 0; i < wires.length; i++){
    var wire = wires[i];
    if(wire.terminal1 === t || wire.terminal2 === t){
      result.push(wire);
    }
  }
  return result;
}

function getWiresBetween(t1, t2){
  var result = [];
  for(var i = 0; i < wires.length; i++){
    var wire = wires[i];
    if((wire.terminal1 === t1 && wire.terminal2 === t2) || (wire.terminal1 === t2 && wire.terminal2 === t1)){
      result.push(wire);
    }
  }
  console.log(result);
  return result;
}

function deleteWires(wires_to_remove){
  for(var i = 0; i < wires_to_remove.length; i++){
    wires_to_remove[i].remove();
  }
}

var previousTerminal = null;
function makeConnection(terminal) {
  console.log("makeConnection");
  if (terminal === previousTerminal) { return; }
  if (previousTerminal === null) {
    previousTerminal = terminal;
  } else {
    var existingWires = getWiresBetween(previousTerminal, terminal);
    if(existingWires.length > 0){
      deleteWires(existingWires);
    }else{
      new Wire(previousTerminal, terminal);
    }
    previousTerminal = null;
  }
}

function drawWires() {
  var ctx = canvas.getContext("2d");
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(finished){
    ctx.fillStyle = "green";
  }else{
    ctx.fillStyle = "red";
  }
  ctx.fillRect(0, 0, 10, 10);



  for (var i = 0; i < wires.length; i++) {
    var wire = wires[i];

    var jq_terminal1 = $(wire.terminal1.dom_element);
    var jq_terminal2 = $(wire.terminal2.dom_element);

    var position1 = jq_terminal1.offset()
    var position2 = jq_terminal2.offset()

    position1.top -= jq_terminal1.height() / 2;
    position1.left -= jq_terminal1.width() / 2;

    position2.top -= jq_terminal2.height() / 2;
    position2.left -= jq_terminal2.width() / 2;

    var x_mid = (position1.left + position2.left) / 2;

    ctx.beginPath();
    ctx.strokeStyle = wire.state === State.ON ? "white" : "black";

    if(sline.checked){
      ctx.moveTo(position1.left, position1.top);
      ctx.lineTo(x_mid, position1.top);
      ctx.lineTo(x_mid, position2.top);
      ctx.lineTo(position2.left, position2.top);
      ctx.stroke();      
    }else{
      ctx.moveTo(position1.left, position1.top);
      ctx.lineTo(position2.left, position2.top);

    }
    ctx.stroke();

  }
}

function updateTerminalsColor(){
  for(var i = 0; i < terminals.length; i++){
    var terminal = terminals[i];
    if (terminal.dom_element === undefined) {
      continue;
    }
    if(terminal.state === State.ON){
      terminal.dom_element.style.backgroundColor = "#fff";
    }else{
      terminal.dom_element.style.backgroundColor = "black";
    }
  }
}

function updateGates(){
  for(var i = 0; i < gates.length; i++){
    var gate = gates[i];
    gate.update();
  }
}

function updateWires(){
  for(var i = 0; i < wires.length; i++){
    var wire = wires[i];
    var t1 = wire.terminal1;
    var t2 = wire.terminal2;
    wire.state = State.OFF;
    if(t1.is_source && t1.state === State.ON){
      wire.state = State.ON;
    }
    if(t2.is_source && t2.state === State.ON){
      wire.state = State.ON;
    }
  }
}

function updateWireOutput(){
  for(var i = 0; i < wires.length; i++){
    var wire = wires[i];
    if(!wire.terminal1.is_source){
      wire.terminal1.state = wire.state;
    }
    if(!wire.terminal2.is_source){
      wire.terminal2.state = wire.state;
    }
  }
}

function checkFinished(){
  let temp = "";
  for(var i = 0; i < terminals.length; i++){
    let t = terminals[i];
    if(t.is_source){
      temp += t.state ? "1" : "0";
    }
  }
  if(temp === last_state){
    stable_count++;
  } else {
    stable_count = 0;
    last_state = temp;
  }
  if(stable_count == 3){
    on_finish.forEach(f => f());
    on_finish = [];
  }
  if(stable_count >= 3){
    finished = true;
  }else{
    finished = false;
  }
}

var and1 = createAndGate(150, 100);
var and2 = createAndGate(150, 300);
var and3 = createAndGate(300, 200);

var switch1 = createSwitch(10, 50);
var switch2 = createSwitch(10, 150);
var switch3 = createSwitch(10, 250);
var switch4 = createSwitch(10, 350);

output = createOutput(450, 200);

makeConnection(switch1.out);
makeConnection(and1.in1);

makeConnection(switch2.out);
makeConnection(and1.in2);

makeConnection(switch3.out);
makeConnection(and2.in1);

makeConnection(switch4.out);
makeConnection(and2.in2);

makeConnection(and1.out);
makeConnection(and3.in1);

makeConnection(and2.out);
makeConnection(and3.in2);



var button = document.createElement("button");
button.innerHTML = "AND";
button.style.position = "absolute";
button.style.left = "10px";
button.style.top = "10px";
button.style.width = "50px";
button.style.height = "30px";
button.style.backgroundColor = "blue";
div.appendChild(button);

button.addEventListener("click", function(){
  createAndGate(150, 200);
});

var button = document.createElement("button");
button.innerHTML = "SWITCH";
button.style.position = "absolute";
button.style.left = "70px";
button.style.top = "10px";
button.style.width = "50px";
button.style.height = "30px";
button.style.backgroundColor = "blue";
div.appendChild(button);

button.addEventListener("click", function(){
  createSwitch(150, 200);
});

var button = document.createElement("button");
button.innerHTML = "OR";
button.style.position = "absolute";
button.style.left = "130px";
button.style.top = "10px";
button.style.width = "50px";
button.style.height = "30px";
button.style.backgroundColor = "blue";
div.appendChild(button);

button.addEventListener("click", function(){
  createOrGate(150, 200);
});

var button = document.createElement("button");
button.innerHTML = "NOT";
button.style.position = "absolute";
button.style.left = "190px";
button.style.top = "10px";
button.style.width = "50px";
button.style.height = "30px";
button.style.backgroundColor = "blue";
div.appendChild(button);

button.addEventListener("click", function(){
  createNotGate(150, 200);
});

function vitualTick(){
  drawWires();
  updateTerminalsColor();
  requestAnimationFrame(vitualTick);
}

// 
function tick() {
  updateGates();
  updateWires();
  updateWireOutput();
  checkFinished();
}

requestAnimationFrame(vitualTick);

var tick_task = setInterval(tick, 1000 / 60); // 30 fps

// <input type="range" min="1" max="100" value="50" class="slider" id="myRange">

var speed_slider = document.getElementById("speed-slider");
var speed_label = document.getElementById("speed-label");
var speed_onchange = function(){
  clearInterval(tick_task);
  var tps = Math.pow(speed_slider.value / 10, 2);
  speed_label.innerHTML = `Speed: ${Math.round(tps, 1)} tps`;
  tick_task = setInterval(tick, 1000 / tps);
}
speed_slider.addEventListener("mouseup", speed_onchange);
speed_onchange();