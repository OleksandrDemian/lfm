import {MusicGenerator} from "./types";
import {MusicRNN} from "@magenta/music/es6/music_rnn";
import {INoteSequence, sequences} from "@magenta/music/es6";
import {fromMidi} from "tonal-note";

const seed_pattern = [
  [0, 2],
  [],
  [2],
  [],
  [2],
  [],
  [0, 2],
  [],
  [1, 2],
  []
];
const reverseMidiMapping = new Map([
  [36, 0],
  [35, 0],
  [38, 1],
  [27, 1],
  [28, 1],
  [31, 1],
  [32, 1],
  [33, 1],
  [34, 1],
  [37, 1],
  [39, 1],
  [40, 1],
  [56, 1],
  [65, 1],
  [66, 1],
  [75, 1],
  [85, 1],
  [42, 2],
  [44, 2],
  [54, 2],
  [68, 2],
  [69, 2],
  [70, 2],
  [71, 2],
  [73, 2],
  [78, 2],
  [80, 2],
  [46, 3],
  [67, 3],
  [72, 3],
  [74, 3],
  [79, 3],
  [81, 3],
  [45, 4],
  [29, 4],
  [41, 4],
  [61, 4],
  [64, 4],
  [84, 4],
  [48, 5],
  [47, 5],
  [60, 5],
  [63, 5],
  [77, 5],
  [86, 5],
  [87, 5],
  [50, 6],
  [30, 6],
  [43, 6],
  [62, 6],
  [76, 6],
  [83, 6],
  [49, 7],
  [55, 7],
  [57, 7],
  [58, 7],
  [51, 8],
  [52, 8],
  [53, 8],
  [59, 8],
  [82, 8]
]);
const midiDrums = [36, 38, 42, 46, 41, 43, 45, 49, 51];
const ts_num = 4;
const ts_den = 4;
const tempo = 115;
const player_length = 32;
const temperature_drum = 1;

//---------------------------------
// drum to note sequence formation
//---------------------------------
const drum_to_note_sequence = (quantize_tensor: number[][]) => {
  var notes_array: any[] = [];
  var note_index = 0;
  for (let i = 0; i < quantize_tensor.length; i++) {
    var notes = quantize_tensor[i];
    if(notes.length > 0) {
      for (let j = 0; j < notes.length; j++) {
        notes_array[note_index] = {};
        notes_array[note_index]["pitch"] = midiDrums[notes[j]];
        notes_array[note_index]["startTime"] = i * 0.5;
        notes_array[note_index]["endTime"] = (i+1) * 0.5;
        note_index = note_index + 1;
      }
    }
  }
  
  return sequences.quantizeNoteSequence(
    {
      ticksPerQuarter: 220,
      totalTime: quantize_tensor.length / 2,
      timeSignatures: [
        {
          time: 0,
          numerator: ts_num,
          denominator: ts_den
        }
      ],
      tempos: [
        {
          time: 0,
          qpm: tempo
        }
      ],
      notes: notes_array
    },
    1
  );
}

//---------------------------------
// note to drum sequence formation
//---------------------------------
const note_to_drum_sequence = (seq: INoteSequence, pLength: number) => {
  const res: (number[][]) = [];
  for (let i = 0; i < pLength; i++) {
    res.push([]);
  }

  if (seq.notes) {
    for (let { pitch, quantizedStartStep } of seq.notes) {
      if (pitch && quantizedStartStep) {
        const reverseMidi = reverseMidiMapping.get(pitch);
        if (reverseMidi) {
          res[quantizedStartStep].push(reverseMidi);
        }
      }
    }
  } else {
    throw new Error("note_to_drum_sequence: seq.notes is not true");
  }

  return res;
}

// const drumKit = [
//   new Tone.Players({
//     high: `${sampleBaseUrl}/808-kick-vh.mp3`,
//     med: `${sampleBaseUrl}/808-kick-vm.mp3`,
//     low: `${sampleBaseUrl}/808-kick-vl.mp3`
//   }).toMaster(),
//   new Tone.Players({
//     high: `${sampleBaseUrl}/flares-snare-vh.mp3`,
//     med: `${sampleBaseUrl}/flares-snare-vm.mp3`,
//     low: `${sampleBaseUrl}/flares-snare-vl.mp3`
//   }).connect(snarePanner),
//   new Tone.Players({
//     high: `${sampleBaseUrl}/808-hihat-vh.mp3`,
//     med: `${sampleBaseUrl}/808-hihat-vm.mp3`,
//     low: `${sampleBaseUrl}/808-hihat-vl.mp3`
//   }).connect(new Tone.Panner(-0.5).connect(reverb)),
//   new Tone.Players({
//     high: `${sampleBaseUrl}/808-hihat-open-vh.mp3`,
//     med: `${sampleBaseUrl}/808-hihat-open-vm.mp3`,
//     low: `${sampleBaseUrl}/808-hihat-open-vl.mp3`
//   }).connect(new Tone.Panner(-0.5).connect(reverb)),
//   new Tone.Players({
//     high: `${sampleBaseUrl}/slamdam-tom-low-vh.mp3`,
//     med: `${sampleBaseUrl}/slamdam-tom-low-vm.mp3`,
//     low: `${sampleBaseUrl}/slamdam-tom-low-vl.mp3`
//   }).connect(new Tone.Panner(-0.4).connect(reverb)),
//   new Tone.Players({
//     high: `${sampleBaseUrl}/slamdam-tom-mid-vh.mp3`,
//     med: `${sampleBaseUrl}/slamdam-tom-mid-vm.mp3`,
//     low: `${sampleBaseUrl}/slamdam-tom-mid-vl.mp3`
//   }).connect(reverb),
//   new Tone.Players({
//     high: `${sampleBaseUrl}/slamdam-tom-high-vh.mp3`,
//     med: `${sampleBaseUrl}/slamdam-tom-high-vm.mp3`,
//     low: `${sampleBaseUrl}/slamdam-tom-high-vl.mp3`
//   }).connect(new Tone.Panner(0.4).connect(reverb)),
//   new Tone.Players({
//     high: `${sampleBaseUrl}/909-clap-vh.mp3`,
//     med: `${sampleBaseUrl}/909-clap-vm.mp3`,
//     low: `${sampleBaseUrl}/909-clap-vl.mp3`
//   }).connect(new Tone.Panner(0.5).connect(reverb)),
//   new Tone.Players({
//     high: `${sampleBaseUrl}/909-rim-vh.wav`,
//     med: `${sampleBaseUrl}/909-rim-vm.wav`,
//     low: `${sampleBaseUrl}/909-rim-vl.wav`
//   }).connect(new Tone.Panner(0.5).connect(reverb))
// ];

export const useTest = (): MusicGenerator => {
  let predicted_sequence: (number[][] | undefined);

  const init = async () => {
    const drums_rnn = new MusicRNN("https://storage.googleapis.com/download.magenta.tensorflow.org/tfjs_checkpoints/music_rnn/drum_kit_rnn");
    await drums_rnn.initialize();
    // predefined sequence
    const cur_seq = drum_to_note_sequence(seed_pattern);
    // predict sequence based on predefined one
    const r = await drums_rnn.continueSequence(cur_seq, player_length, temperature_drum);
    predicted_sequence = seed_pattern.concat(note_to_drum_sequence(r, player_length));
  };
  
  const play = () => {
    // todo: https://github.dev/Gogul09/deep-drum
    //  playPattern
    //  scheduleTimeOn
    return 0;
  };

  return {
    generatorName: 'Random Generator',
    init,
    play,
  }
};
