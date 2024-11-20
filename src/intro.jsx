import LogicGateLevel from './logicgate_level';

function App(props) {

  const handleStart = () => {
    let latchExample = {
      inputs: [
        "S",
        "R"
      ],
      outputs: [
        "Q",
        "Q'"
      ],
      text: "Make a latch",
      testCasesGen: ()=>{
        return [
          {inputs: [0, 1], outputs: [1, 0]},
          {inputs: [0, 0], outputs: [1, 0]},
          {inputs: [1, 0], outputs: [0, 1]},
          {inputs: [0, 0], outputs: [0, 1]},
          {inputs: [1, 1], outputs: [0, 0]},
          ];
      }
    };

    props.root.render(<LogicGateLevel root={props.root} challenge={latchExample}/>);    
  };

  const handleSettings = () => {};

  return (
    <div>
      <h1>Logic Gate Game</h1>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleSettings}>Settings</button>
    </div>
  );
}

export default App;