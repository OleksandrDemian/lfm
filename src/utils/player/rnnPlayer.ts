import {MusicRNN} from "@magenta/music/es6/music_rnn";
import {Synth} from "tone";
import {INoteSequence, sequences} from "@magenta/music/es6";
import {RnnSequence} from "./rnnSequence";
import {fromMidi} from "tonal-note";
import {MusicGenerator} from "./types";

export function useRnn(): MusicGenerator {
  const improvCheckpoint = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv';
  const musicRNN = new MusicRNN(improvCheckpoint);
  const synth = new Synth().toDestination();
  let improvisedMelody: INoteSequence | undefined;

  const init = async () => {
    const quantizedSequence = sequences.quantizeNoteSequence(RnnSequence, 1);
    await musicRNN.initialize();
    improvisedMelody = await musicRNN.continueSequence(
      quantizedSequence,
      60,
      1.1,
      ['Bm', 'Bbm', 'Gb7', 'F7', 'Ab', 'Ab7', 'G7', 'Gb7', 'F7', 'Bb7', 'Eb7', 'AM7']
    );
  }
  
  // const playOriginalMelody = () => {
  //   RnnSequence.notes.forEach(note => {
  //     synth.triggerAttackRelease(fromMidi(note.pitch), note.endTime - note.startTime, note.startTime)
  //   })
  // }

  const playGeneratedMelody = () => {
    if (improvisedMelody && improvisedMelody.notes) {
      let totalDuration = 0;
      improvisedMelody.notes.forEach(note => {
        if (note.pitch && note.quantizedEndStep && note.quantizedStartStep) {
          const noteDuration = note.quantizedEndStep - note.quantizedStartStep;
          totalDuration += noteDuration;
          synth.triggerAttackRelease(
            fromMidi(note.pitch),
            noteDuration,
            note.quantizedStartStep
          );
        }
      });
      return totalDuration;
    }
    return 0;
  }
  
  return {
    init,
    play: playGeneratedMelody,
    generatorName: "MusicRNN",
  }
}