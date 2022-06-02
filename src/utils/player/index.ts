import {createSignal, onCleanup, onMount} from "solid-js";
import {Manager} from "./manager";
import {useRnn} from "./rnnPlayer";
import {useVae} from "./vaePlayer";
import {useTest} from "./testPlayer";

// Manager.use(useVae());
// Manager.use(useRnn());
Manager.use(useTest());
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
    generatorName: Manager.getName(),
  }
}
