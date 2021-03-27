import {
  ListItem,
  Box,
  Typography,
  ListItemText,
  Collapse,
  List,
  Divider,
  makeStyles,
  TextField,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Buttle, Command } from "../types";
import React, { useState } from "react";

const useStyles = makeStyles({
  point: {
    width: 20,
    height: 20,
    borderRadius: "50%"
  },

  white: {
    border: "1px solid black"
  },

  black: {
    background: "black"
  }
});

export function Tour({
  tour,
  commands,
  num,
  onChange
}: {
  tour: Buttle[];
  commands: Command[];
  num: number;
  onChange: (b: Buttle) => void;
}) {
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const includes = tour.filter((b) => b.includeInResults).length;

  return (
    <React.Fragment>
      <ListItem button onClick={() => setOpen(!open)}>
        <ListItemText
          primary={"Тур " + num}
          secondary={`Сыграно ${includes}/${tour.length}`}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {tour.map(
            (b) => (
                <React.Fragment key={b.id}>
                  <ListItem>
                    <Box
                      display="grid"
                      gridTemplateColumns="1fr 20px max-content 20px 1fr 1fr 1fr 1fr max-content"
                      gridGap={15}
                      justifyItems="center"
                      alignItems="center"
                      width="100%"
                    >
                      <Typography variant="body1">
                        {commands[b.white].name}
                      </Typography>
                      <span className={classes.point + " " + classes.white} />
                      <Typography variant="body2">{" vs "}</Typography>
                      <span className={classes.point + " " + classes.black} />
                      <Typography variant="body1">
                        {commands[b.black].name}
                      </Typography>
                      <TextField
                        value={b.res.white}
                        onChange={(e) =>
                          onChange({
                            ...b,
                            res: {
                              ...b.res,
                              white: e.target.value.replace(",", ".")
                            }
                          })
                        }
                        label="Побед белых"
                        type="number"
                      />
                      <TextField
                        value={b.res.black}
                        onChange={(e) =>
                          onChange({
                            ...b,
                            res: {
                              ...b.res,
                              black: e.target.value.replace(",", ".")
                            }
                          })
                        }
                        label="Побед чёрных"
                        type="number"
                      />
                      <TextField
                        value={b.res.draw}
                        onChange={(e) =>
                          onChange({
                            ...b,
                            res: {
                              ...b.res,
                              draw: e.target.value.replace(",", ".")
                            }
                          })
                        }
                        label="Ничьи"
                        type="number"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={b.includeInResults}
                            onClick={(e) =>
                              onChange({
                                ...b,
                                includeInResults: (e.target as any).checked
                              })
                            }
                          />
                        }
                        label="Партия сыграна"
                      />
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              )
          )}
        </List>
      </Collapse>
    </React.Fragment>
  );
}
