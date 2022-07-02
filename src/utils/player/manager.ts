import {ManagerListener, MusicGenerator} from "./types";

export const ManagerState = {
  IDLE: 0,
  INITIALIZING: 1,
  READY: 2,
  PLAYING: 3,
};

export type ManagerProps = {
  musicGenerator: MusicGenerator;
};
export type ManagerType = {
  isReady: () => boolean;
  isPlaying: () => boolean;
  isInitializing: () => boolean;
  setState: (newState: number) => void;
  addListener: (listener: ManagerListener) => () => void;
  init: () => void;
  play: () => void;
  getName: () => string;
  getState: () => number;
};
export const Manager = (props: ManagerProps): ManagerType => {
  const listeners: ManagerListener[] = [];
  let state = ManagerState.IDLE;
  let current: MusicGenerator = props.musicGenerator;
  
  const isReady = () => state === ManagerState.READY || state === ManagerState.PLAYING;
  const isPlaying = () => state === ManagerState.PLAYING;
  const isInitializing = () => state === ManagerState.INITIALIZING;

  const setState = (newState: number) => {
    state = newState;
    listeners.forEach((l) => l.onState(newState));
  };

  const addListener = (listener: ManagerListener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  const init = () => {
    if (state === ManagerState.IDLE && current) {
      setState(ManagerState.INITIALIZING);
      current.init().then(() => {
        setState(ManagerState.READY);
      });
    }
  }
  
  const play = () => {
    setState(ManagerState.PLAYING);
    current?.play();
  };
  
  return {
    isReady,
    isPlaying,
    isInitializing,
    setState,
    addListener,
    init,
    play,
    getName: () => current?.generatorName,
    getState: () => state,
  }
};