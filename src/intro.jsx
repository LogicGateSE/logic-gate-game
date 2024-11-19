function App() {

  const handleStart = () => {
    window.location.href = 'game.html';
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