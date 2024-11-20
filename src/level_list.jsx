import levels from "./levels/levels";

import LogicGateLevel from './logicgate_level';

function Levels(props) {
  return (
    <div>
      <h1>Logic Gate Levels</h1>
      {levels.map((world) => (<>
        <h2> {world.name} </h2>
        {world.levels.map((level) => (
            <p> - {level.name} </p>
        ))}
        </>            
      ))}
    </div>
  );
}

export default Levels;