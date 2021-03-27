import "./styles.css";
import { Buttle } from "./types";

let idcount = 1;

export function generateButtles(tableLength: number): Buttle[] {
  const buttles: Buttle[] = [];

  for (let i = 1; i <= tableLength; i++) {
    for (let j = 1; j <= tableLength; j++) {
      if (i === j) continue;

      const numsSum = i + j;

      const biggestNum = Math.max(i, j);
      const smallest = Math.min(i, j);

      let black: number;
      let white: number;
      let tour: number;

      if (biggestNum === tableLength) {
        black = smallest < tableLength / 2 ? biggestNum : smallest;
        white = smallest < tableLength / 2 ? smallest : biggestNum;

        tour =
          smallest * 2 <= biggestNum
            ? smallest * 2 - 1
            : smallest * 2 - biggestNum;
      } else {
        black = numsSum % 2 === 0 ? smallest : biggestNum;
        white = numsSum % 2 === 0 ? biggestNum : smallest;

        tour = numsSum > tableLength ? numsSum - tableLength : numsSum - 1;
      }

      buttles.push({
        id: idcount++,
        tour: tour - 1,
        black: black - 1,
        white: white - 1,
        res: {
          white: "",
          black: "",
          draw: ""
        },
        includeInResults: false
      });
    }
  }

  const set = new Set(buttles.map((item) => item.white + "&%&" + item.tour));

  return Array.from(set).map(
    (item) =>
      buttles.find((b) => {
        const [white, tour] = item.split("&%&");

        return b.white === +white && b.tour === +tour;
      }) as Buttle
  );
}
