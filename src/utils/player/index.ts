import {createSignal, onCleanup, onMount} from "solid-js";
import {Manager, ManagerState, ManagerType} from "./manager";
import {useRnn} from "./rnnPlayer";
import {useVae} from "./vaePlayer";
import {useTest} from "./testPlayer";

export const ManagerId = {
  VAE: 'vae',
  RNN: 'rnn',
  TEST: 'test',
} as const;
type ManagerIdKeys = keyof typeof ManagerId;
export type ManagerIdType = typeof ManagerId[ManagerIdKeys];

const Managers: {[p in ManagerIdType]: ManagerType} = {
  [ManagerId.VAE]: Manager({
    musicGenerator: useVae(),
  }),
  [ManagerId.RNN]: Manager({
    musicGenerator: useRnn(),
  }),
  [ManagerId.TEST]: Manager({
    musicGenerator: useTest(),
  }),
};

export type CreatePlayerProps = {
  id: ManagerIdType;
};
export const createPlayer = ({ id }: CreatePlayerProps) => {
  const manager = Managers[id];
  const [state, setState] = createSignal<number>(manager.getState());
  
  onMount(() => {
    onCleanup(manager.addListener({
      onState: setState,
    }));
  });
  
  const init = () => {
    if (manager.getState() === ManagerState.IDLE) {
      manager.init();
    }
  };

  return {
    play: manager.play,
    generatorName: manager.getName(),
    init,
    state,
  }
}
