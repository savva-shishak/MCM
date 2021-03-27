export type Command = {
  id: number;
  name: string;
};

export type Buttle = {
  id: number;
  tour: number;
  white: number;
  black: number;
  res: {
    white: string;
    black: string;
    draw: string;
  };
  includeInResults: boolean;
};

export type DataForGenerateButtle = {
  commands: Command[];
  completedButtles?: Buttle[];
  prevButtles?: Buttle[][];
};
