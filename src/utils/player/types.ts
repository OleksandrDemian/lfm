export type MusicGenerator = {
  init: () => Promise<void>;
  play: () => void;
  generatorName: string;
}

export type InitListener = () => void;