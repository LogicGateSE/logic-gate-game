import LogicGateLevel from './logicgate_level';
import Levels from './level_list';

function App(props) {
  //   props.root.render(<LogicGateLevel root={props.root} challenge={latchExample}/>);

  const handleStart = () => {
    props.root.render(<Levels root={props.root} />);
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