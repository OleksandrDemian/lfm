import {InitListener, MusicGenerator} from "./types";

const STATE = {
  IDLE: 0,
  INITIALIZING: 1,
  READY: 2,
};

export const Manager = (() => {
  const listeners: InitListener[] = [];
  let state = STATE.IDLE;
  let current: MusicGenerator | undefined;
  
  const isReady = () => state === STATE.READY;
  const setState = (newState: number) => state = newState;

  const addListener = (listener: InitListener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  const triggerReady = () => listeners.forEach(l => l());
  
  const use = (musicGenerator: MusicGenerator) => current = musicGenerator;
  
  const init = () => {
    if (state === STATE.IDLE && current) {
      current.init().then(() => {
        Manager.setState(STATE.READY);
        Manager.triggerReady();
      });
    }
  }
  
  const play = () => current?.play();
  
  return {
    isReady,
    setState,
    addListener,
    triggerReady,
    use,
    init,
    play,
  }
})();