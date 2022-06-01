import { createPlayer } from "../utils/player";

export default function App() {
  const {initialized, play} = createPlayer();

  return (
    <div class="column">
      <h1>L.FM</h1>
      <div class="player">
        <div class="player-content">
          <span>{initialized() ? "Ready" : "Initializing"}</span>
        </div>
        <button disabled={!initialized()} onClick={play}>
          Play
        </button>
      </div>
    </div>
  );
};
