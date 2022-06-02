import styles from "./index.module.css";
import {createPlayer} from "../../utils/player";

export const Player = () => {
  const {initialized, play, generatorName} = createPlayer();
  
  return (
    <div class={styles.player}>
      <div style={{ flex: 1 }}>
        <span class={styles.title}>{generatorName}</span>
      </div>
      <button class={styles.playButton} disabled={!initialized()} onClick={play}>
        {initialized() ? "Play" : "Loading"}
      </button>
    </div>
  );
};
