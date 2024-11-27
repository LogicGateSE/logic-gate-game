console.log("app.js loaded");

const wires = [];
const gates = [];
const terminals = [];

const inputs = [];
let output = null;

let on_finish = [];

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

let last_state = ""
let stable_count = 0
let finished = false

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
  const $tr = $(this);
  const s1 = $tr.find("td").eq(0).text();
  const s2 = $tr.find("td").eq(1).text();
  const s3 = $tr.find("td").eq(2).text();
  const s4 = $tr.find("td").eq(3).text();
  const states = [s1, s2, s3, s4];

  for(let i = 0; i < states.length; i++){
    const input = inputs[i];
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
  const $trs = $("#truthtable tr");
  for (let i = 1; i < $trs.length; i++) {
    const $tr = $trs.eq(i);
    $tr.css("background-color", "yellow");
    const s1 = $tr.find("td").eq(0).text();
    const s2 = $tr.find("td").eq(1).text();
    const s3 = $tr.find("td").eq(2).text();
    const s4 = $tr.find("td").eq(3).text();
    const states = [s1, s2, s3, s4];

    for (let j = 0; j < states.length; j++) {
      const input = inputs[j];
      if (states[j] === "1") {
        input.state = State.ON;
      } else {
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

    const expected_output = $tr.find("td").eq(4).text() === "1" ? State.ON : State.OFF;
    const actual_output = output.in1.state;
    if (actual_output === expected_output) {
      $tr.css("background-color", "green");
    } else {
      $tr.css("background-color", "red");
    }
  }
  this.disabled = false;
});

// noinspection JSUnusedGlobalSymbols
function NewAndGate(){
  return new Gate((a, b) => a && b);
}

// noinspection JSUnusedGlobalSymbols
function NewOrGate(){
  return new Gate((a, b) => a || b);
}

// noinspection JSUnusedGlobalSymbols
function NewXorGate(){
  return new Gate((a, b) => a !== b);
}

// noinspection JSUnusedGlobalSymbols
function NewNullGate(){
  const gate = new Gate((_, __) => false);
  gate.func = (_, __) => gate.out.state;
  return gate;
}

// noinspection JSUnusedGlobalSymbols
function NewNotGate(){
  return new Gate((a, _) => !a);
}

function onHoverBoarder(e) {
  e.addEventListener("mouseover", function () {
    e.style.border = "1px solid white";
  });
  e.addEventListener("mouseout", function () {
    e.style.border = "none";
  });
}

class Draggable {
  constructor(gate){
    this.e = gate.dom_element;
    this.isMouseDown = false;
    this.offsetX = 0;
    this.offsetY = 0;

    this.e.addEventListener("mousedown", (event) => {
      event.preventDefault();
      this.isMouseDown = true;
      this.offsetX = event.offsetX;
      this.offsetY = event.offsetY;
    });
    this.e.addEventListener("mouseup", (_) => {
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
    this.e.addEventListener("mouseout", (_) => {
      this.isMouseDown = false;
      this.e.style.left = Math.round(parseInt(this.e.style.left) / 10) * 10 + "px";
    });
  }
}

class Removable {
  constructor(gate){
    this.e = gate.dom_element;
    this.e.addEventListener("dblclick", () => {
      this.e.remove();
      gate.delete();
    });
  }
}

// noinspection JSUnusedGlobalSymbols
function onClickFunction(e, func) {
  e.addEventListener("click", func);
}

function createAndGate(left, top) {
  const gate = document.createElement("div");
  gate.style.width = "50px";
  gate.style.height = "50px";
  gate.style.backgroundColor = "red";
  gate.style.position = "absolute";
  gate.style.left = `${left}px`;
  gate.style.top = `${top}px`;

  gate.style.borderRadius = "0px 25px 25px 0px";

  const terminal1 = document.createElement("div");
  terminal1.style.width = "10px";
  terminal1.style.height = "10px";
  terminal1.style.backgroundColor = "black";
  terminal1.style.position = "absolute";
  terminal1.style.left = "0px";
  terminal1.style.top = "10px";
  onHoverBoarder(terminal1);
  gate.appendChild(terminal1);

  const terminal2 = document.createElement("div");
  terminal2.style.width = "10px";
  terminal2.style.height = "10px";
  terminal2.style.backgroundColor = "black";
  terminal2.style.position = "absolute";
  terminal2.style.left = "0px";
  terminal2.style.bottom = "10px";
  onHoverBoarder(terminal2);
  gate.appendChild(terminal2);

  const terminal3 = document.createElement("div");
  terminal3.style.width = "10px";
  terminal3.style.height = "10px";
  terminal3.style.backgroundColor = "black";
  terminal3.style.position = "absolute";
  terminal3.style.right = "0px";
  terminal3.style.top = "20px";
  onHoverBoarder(terminal3);
  gate.appendChild(terminal3);

  const _gate = NewAndGate();
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

  new Draggable(_gate);
  new Removable(_gate);

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

  new Draggable(_gate);
  new Removable(_gate);

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

  new Draggable(_gate);
  new Removable(_gate);

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

  new Draggable(_gate);
  new Removable(_gate);

  return _gate;
}

function createOutput(left, top) {
  const gate = document.createElement("div");
  gate.style.width = "50px";
  gate.style.height = "50px";
  gate.style.backgroundColor = "#44f";
  gate.style.position = "absolute";
  gate.style.left = `${left}px`;
  gate.style.top = `${top}px`;

  const terminal1 = document.createElement("div");
  terminal1.style.width = "10px";
  terminal1.style.height = "10px";
  terminal1.style.backgroundColor = "black";
  terminal1.style.position = "absolute";
  terminal1.style.left = "0px";
  terminal1.style.top = "20px";
  onHoverBoarder(terminal1);
  gate.appendChild(terminal1);

  const _gate = NewNullGate();
  _gate.setDomElement(gate);
  _gate.in1.dom_element = terminal1;

  terminal1.addEventListener("click", function(){
    makeConnection(_gate.in1);
  });

  div.appendChild(gate);

  new Draggable(_gate);
  new Removable(_gate);

  return _gate;
}

function getWiresFrom(t){
  const result = [];
  for(let i = 0; i < wires.length; i++){
    const wire = wires[i];
    if (wire.terminal1 === t || wire.terminal2 === t){
      result.push(wire);
    }
  }
  return result;
}

function getWiresBetween(t1, t2){
  const result = [];
  for(let i = 0; i < wires.length; i++){
    const wire = wires[i];
    if((wire.terminal1 === t1 && wire.terminal2 === t2) || (wire.terminal1 === t2 && wire.terminal2 === t1)){
      result.push(wire);
    }
  }
  console.log(result);
  return result;
}

function deleteWires(wires_to_remove){
  for(let i = 0; i < wires_to_remove.length; i++){
    wires_to_remove[i].remove();
  }
}

let previousTerminal = null;
function makeConnection(terminal) {
  console.log("makeConnection");
  if (terminal === previousTerminal) { return; }
  if (previousTerminal === null) {
    previousTerminal = terminal;
  } else {
    const existingWires = getWiresBetween(previousTerminal, terminal);
    if(existingWires.length > 0){
      deleteWires(existingWires);
    }else{
      new Wire(previousTerminal, terminal);
    }
    previousTerminal = null;
  }
}

function drawWires() {
  const ctx = canvas.getContext("2d");
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(finished){
    ctx.fillStyle = "green";
  }else{
    ctx.fillStyle = "red";
  }
  ctx.fillRect(0, 0, 10, 10);



  for (var i = 0; i < wires.length; i++) {
    const wire = wires[i];

    const jq_terminal1 = $(wire.terminal1.dom_element);
    const jq_terminal2 = $(wire.terminal2.dom_element);

    const position1 = jq_terminal1.offset()
    const position2 = jq_terminal2.offset()

    position1.top -= jq_terminal1.height() / 2;
    position1.left -= jq_terminal1.width() / 2;

    position2.top -= jq_terminal2.height() / 2;
    position2.left -= jq_terminal2.width() / 2;

    const x_mid = (position1.left + position2.left) / 2;

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
  for(let i = 0; i < terminals.length; i++){
    const terminal = terminals[i];
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
  for(let i = 0; i < gates.length; i++){
    const gate = gates[i];
    gate.update();
  }
}

function updateWires(){
  for(let i = 0; i < wires.length; i++){
    const wire = wires[i];
    const t1 = wire.terminal1;
    const t2 = wire.terminal2;
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
  for(let i = 0; i < wires.length; i++){
    const wire = wires[i];
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
  for(let i = 0; i < terminals.length; i++){
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
  if(stable_count === 3){
    on_finish.forEach(f => f());
    on_finish = [];
  }
  finished = stable_count >= 3;
}

const and1 = createAndGate(150, 100);
const and2 = createAndGate(150, 300);
const and3 = createAndGate(300, 200);

const switch1 = createSwitch(10, 50);
const switch2 = createSwitch(10, 150);
const switch3 = createSwitch(10, 250);
const switch4 = createSwitch(10, 350);

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



const add_and_button = document.getElementById("add-and");
const add_or_button = document.getElementById("add-or");
const add_not_button = document.getElementById("add-not");
const add_switch_button = document.getElementById("add-switch");

add_and_button.addEventListener("click", function(){
  createAndGate(150, 100);
});

add_or_button.addEventListener("click", function(){
  createOrGate(150, 100);
});

add_not_button.addEventListener("click", function(){
  createNotGate(150, 100);
});

add_switch_button.addEventListener("click", function(){
  createSwitch(150, 100);
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

let tick_task = setInterval(tick, 1000 / 60); // 30 fps

// <input type="range" min="1" max="100" value="50" class="slider" id="myRange">

const speed_slider = document.getElementById("speed-slider");
const speed_label = document.getElementById("speed-label");
const speed_onchange = function(){
  clearInterval(tick_task);
  const tps = Math.pow(speed_slider.value / 10, 2);
  speed_label.innerHTML = `Speed: ${Math.round(tps, 1)} tps`;
  tick_task = setInterval(tick, 1000 / tps);
}
speed_slider.addEventListener("mouseup", speed_onchange);
speed_onchange();