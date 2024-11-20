import LogicGateLevel from './logicgate_level';

function App(props) {

  const handleStart = () => {
    let testChallenge = {
      inputCount: 2,
      outputCount: 1,
      text: "Add an OR gate",
      testCasesGen: ()=>{
        return [
          {inputs: [0, 0], outputs: [0]},
          {inputs: [0, 1], outputs: [1]},
          {inputs: [1, 0], outputs: [1]},
          {inputs: [1, 1], outputs: [1]}
        ]
      }
    };

    props.root.render(<LogicGateLevel root={props.root} challenge={testChallenge}/>);    
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