import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { Buttle, Command } from "../types";

export const Results = ({
  buttles,
  commands
}: {
  buttles: Buttle[];
  commands: Command[];
}) => {
  const getRates = (comid: number) => {
    const thisButtles = buttles.filter((b) =>
      _.includes([b.white, b.black], comid)
    );

    const winnings = thisButtles
      .map((b) => +b.res[b.white === comid ? "white" : "black"])
      .reduce((ac, win) => win + ac, 0);

    const drawings = thisButtles
      .map((b) => +b.res.draw)
      .reduce((ac, draw) => draw + ac, 0);

    return winnings + drawings;
  };

  const getRatesOfRivals = (comid: number, byKoia: boolean = false) => {
    let sum = 0;

    for (const b of buttles) {
      if (_.includes([b.white, b.black], comid)) {
        const rates = getRates(b[b.white === comid ? "black" : "white"]);

        if (
          !byKoia ||
          rates >=
            ((commands.length - 1) *
              (+b.res.white + +b.res.black + +b.res.draw / 2)) /
              2
        ) {
          sum += rates;
        }
      }
    }

    return sum;
  };

  const ratings = commands
    .map((_, id) => id)
    .sort((aid, bid) => {
      const localButtle = buttles.find(
        (b) =>
          _.includes([b.white, b.black], aid) &&
          _.includes([b.white, b.black], bid)
      );

      const isWinInLocalButtle = (first: number, second: number): boolean => {
        if (!localButtle) {
          return false;
        }

        const firstColor = localButtle.white === first ? "white" : "black";
        const secondColor = localButtle.white === second ? "white" : "black";

        return localButtle.res[firstColor] > localButtle.res[secondColor];
      };

      return getRates(aid) > getRates(bid)
        ? -1
        : getRates(aid) < getRates(bid)
        ? 1
        : isWinInLocalButtle(aid, bid)
        ? -1
        : isWinInLocalButtle(bid, aid)
        ? 1
        : getRatesOfRivals(aid) > getRatesOfRivals(bid)
        ? -1
        : getRatesOfRivals(aid) < getRatesOfRivals(bid)
        ? 1
        : 0;
    });

  return (
    <TableContainer>
      <Typography variant="h6">Результаты</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Команда</TableCell>

            {commands.map((_, id) => (
              <TableCell align="center" key={id}>
                {id + 1}
              </TableCell>
            ))}
            <Tooltip placement="right" title="Выйгрыши">
              <TableCell align="right">В</TableCell>
            </Tooltip>
            <Tooltip placement="right" title="Ничьи">
              <TableCell align="right">Н</TableCell>
            </Tooltip>
            <Tooltip placement="right" title="Поражения">
              <TableCell align="right">П</TableCell>
            </Tooltip>
            <TableCell align="right">Очки</TableCell>
            <Tooltip
              placement="right"
              title="Доп. показатель Зонненборн-Бергер"
            >
              <TableCell align="right">ЗБ</TableCell>
            </Tooltip>
            <Tooltip placement="right" title="Доп. показатель по системе Койя">
              <TableCell align="right">К</TableCell>
            </Tooltip>

            <TableCell align="right">Место</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commands.map((command, comid) => {
            const thisButtles = buttles.filter((b) =>
              _.includes([b.white, b.black], comid)
            );

            const winnings = thisButtles
              .map((b) => +b.res[b.white === comid ? "white" : "black"])
              .reduce((ac, win) => win + ac, 0);

            const drawings = thisButtles
              .map((b) => +b.res.draw)
              .reduce((ac, draw) => draw + ac, 0);

            const losses = thisButtles
              .map((b) => +b.res[b.white === comid ? "black" : "white"])
              .reduce((ac, los) => los + ac, 0);

            return (
              <TableRow key={command.id}>
                <TableCell>{command.name}</TableCell>

                {commands.map((rival, rivid) => {
                  if (rival.id === command.id) {
                    return (
                      <TableCell align="center" key={rival.id}>
                        -
                      </TableCell>
                    );
                  }

                  const buttle = thisButtles.find(
                    (b) =>
                      _.includes([b.white, b.black], rivid) &&
                      _.includes([b.white, b.black], comid)
                  );

                  if (!buttle) {
                    return <TableCell key={rival.id}></TableCell>;
                  }

                  const commandColorInThisButtle =
                    buttle.white === comid ? "white" : "black";

                  return (
                    <TableCell align="center">
                      <Tooltip
                        placement="left"
                        title={"Тур " + (buttle.tour + 1)}
                      >
                        <span>
                          {+buttle.res[commandColorInThisButtle] +
                            +buttle.res.draw / 2}
                        </span>
                      </Tooltip>
                    </TableCell>
                  );
                })}
                <TableCell align="right">{winnings}</TableCell>
                <TableCell align="right">{drawings}</TableCell>
                <TableCell align="right">{losses}</TableCell>
                <TableCell align="right">{winnings + drawings / 2}</TableCell>
                <TableCell align="right">{getRatesOfRivals(comid)}</TableCell>
                <TableCell align="right">
                  {getRatesOfRivals(comid, true)}
                </TableCell>
                <TableCell align="right">
                  {ratings.indexOf(comid) + 1}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
