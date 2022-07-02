import styles from "./index.module.css";
import {createPlayer, ManagerId, ManagerIdType} from "../../utils/player";
import {ManagerState} from "../../utils/player/manager";

export type PlayerProps = {
  id: ManagerIdType;
};
export const Player = (props: PlayerProps) => {
  const {state, play, generatorName, init} = createPlayer({
    id: props.id,
  });

  return (
    <div class={styles.player}>
      <div style={{ flex: 1 }}>
        <span class={styles.title}>{generatorName}</span>
      </div>
      {state() === ManagerState.IDLE && (
        <button class={styles.playButton} onClick={init}>
          Init
        </button>
      )}
      {state() === ManagerState.INITIALIZING && (
        <button class={styles.playButton} disabled>
          Loading
        </button>
      )}
      {state() === ManagerState.READY && (
        <button class={styles.playButton} onClick={play}>
          Play
        </button>
      )}
      {state() === ManagerState.PLAYING && (
        <button class={styles.playButton} disabled>
          Is playing
        </button>
      )}
    </div>
  );
};
