import {Player} from "../Player";
import {ManagerId} from "../../utils/player";
import styles from './index.module.css';

export const PlayersList = () => (
  <div class={[styles.container, 'column'].join(' ')}>
    <Player id={ManagerId.TEST} />
    <Player id={ManagerId.RNN} />
    <Player id={ManagerId.VAE} />
  </div>
);
