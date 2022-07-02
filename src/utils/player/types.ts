export type MusicGenerator = {
  init: () => Promise<void>;
  play: () => number;// returns duration
  generatorName: string;
}

export type ManagerListener = {
  onState: (state: number) => void;
};
