import {createSignal, onCleanup, onMount} from "solid-js";
import {useRnn} from "./rnnPlayer";
import {useVae} from "./vaePlayer";
import {Manager} from "./manager";

// Manager.use(useVae());
Manager.use(useRnn());
Manager.init();

export const createPlayer = () => {
  const [initialized, setInitialized] = createSignal(Manager.isReady());
  
  onMount(() => {
    if (!Manager.isReady()) {
      const listenerCleanup = Manager.addListener(() => {
        setInitialized(true);
      });
      onCleanup(listenerCleanup);
    }
  });
  
  return {
    initialized,
    play: Manager.play,
  }
}
