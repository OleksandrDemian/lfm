import {INoteSequence, Player} from "@magenta/music/es6";
import {MusicVAE} from "@magenta/music/es6/music_vae";
import {MusicGenerator} from "./types";

export function useVae(): MusicGenerator {
  const player = new Player();
  const mvae = new MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');
  let sample: INoteSequence | undefined;
  
  const init = async () => {
    await mvae.initialize();
    const samples = await mvae.sample(5);
    sample = samples[0];
  };
  
  const play = () => {
    if (sample) {
      player.start(sample);
    } else {
      throw new Error("useVae: No sample");
    }
  };
  
  return {
    init,
    play,
  }
}