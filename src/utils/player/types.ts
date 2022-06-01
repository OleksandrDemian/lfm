export type MusicGenerator = {
  init: () => Promise<void>;
  play: () => void;
}

export type InitListener = () => void;