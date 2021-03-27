import "./styles.css";
import {
  Button,
  Container,
  List,
  ListItem,
  TextField,
  Box,
  IconButton,
  Tooltip,
  ListItemText,
  ListItemIcon,
  Typography
} from "@material-ui/core";
import { generateButtles } from "./generator-buttles";

import { Buttle, Command } from "./types";
import { useEffect, useState } from "react";
import { Add, Delete } from "@material-ui/icons";
import { Tour } from "./components/Tour";
import { Results } from "./components/Results";

let idcount = +(sessionStorage.getItem("idcount") || 1);

export default function App() {
  const [name, setName] = useState("");
  const [openResults, setOpenResults] = useState(false);
  const [commands, setCommands] = useState<Command[]>(
    JSON.parse(sessionStorage.getItem("commands") || "[]")
  );
  const [buttles, setButtles] = useState<Buttle[]>(
    JSON.parse(sessionStorage.getItem("buttles") || "[]")
  );

  useEffect(() => {
    sessionStorage.setItem("commands", JSON.stringify(commands));
    sessionStorage.setItem("buttles", JSON.stringify(buttles));
  }, [commands, buttles]);

  const addCommand = () => {
    setCommands([...commands, { id: idcount++, name }]);
    setButtles([]);
    sessionStorage.setItem("idcount", idcount + "");
    setName("");
  };

  const removeCommand = (id: number) => () => {
    setCommands(commands.filter((com) => com.id !== id));
    setButtles([]);
  };

  const craftTours = () => {
    setButtles(
      generateButtles(
        commands.length % 2 === 0 ? commands.length : commands.length + 1
      )
    );
  };

  return (
    <Container style={{ marginBottom: "100px" }} maxWidth="lg">
      <Box display="flex" maxHeight={500}>
        <Box width="100%" paddingRight="15px">
          <Typography variant="h5">
            Добро пожаловать в "My Chess Match"
          </Typography>
          <Typography variant="body1">
            Данный сайт поможет вам составить таблицу матчей и расчитать
            конечные результаты всего турнира по шахматам для 4-х и более команд
          </Typography>
          <Box width="100%" height="20px" />
          <Typography variant="body1">Использование:</Typography>
          <Typography variant="body1">
            Сначала вам нужно составить список команд, записав название каждой
            команды в текстовое поле справа и нажав на "+"
          </Typography>
          <Box width="100%" height="20px" />
          <Typography variant="body1">
            Если вы записали 4 или более команд вы можете составить таблицу
            партий, нажав на кнопку под списком. При нажатии, снизу появится
            спикок туров и при раскрытии каждого тура показывается таблица
            партий
          </Typography>
          <Typography variant="body1">
            В этой таблице вы можете указать результат каждой партии
          </Typography>
          <Box width="100%" height="20px" />
          <Typography variant="body1">
            Для того чтобы результат партии засчитался в итоговой таблице
            результатов нужно поставить флажек "Партия сыграна" к
            соответствующей партии в таблице партий
          </Typography>
          <Box width="100%" height="20px" />
          <Typography variant="body1">
            По окончанию турнира, вы можете нажать на кнопку "Открыть
            результаты" под списком туров и сайт покажет результаты всего
            турнира по указанным ренее вами результатам партий
          </Typography>
          <Box width="100%" height="20px" />
          <Typography variant="body1">Приятного пользования!!!</Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Box display="flex" alignItems="center" width={300}>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              label="Введите название команды"
            />
            <Tooltip title="Добавить команду">
              <IconButton
                onClick={addCommand}
                disabled={name.trim().length < 3}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </Box>
          <Box width={300} height="100%" overflow="auto" marginBottom="15px">
            <List>
              {commands.map(({ id, name }) => (
                <ListItem key={id}>
                  <ListItemText primary={name} />
                  <ListItemIcon onClick={removeCommand(id)}>
                    <IconButton edge="end">
                      <Delete />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              ))}
            </List>
          </Box>

          <Button
            disabled={commands.length < 4 || !!buttles.length}
            onClick={craftTours}
            color="primary"
            variant="contained"
          >
            Составить таблицу матчей для {commands.length} команд
          </Button>
        </Box>
      </Box>
      {buttles.length > 0 && (
        <List>
          {commands.length > 1 &&
            new Array(commands.length - 1)
              .fill(null)
              .map((_, id) => (
                <Tour
                  key={id}
                  tour={buttles.filter((b) => b.tour === id && commands[b.black] && commands[b.white])}
                  num={id + 1}
                  commands={commands}
                  onChange={(changedButtle) =>
                    setButtles(
                      buttles.map((b) =>
                        b.id === changedButtle.id ? changedButtle : b
                      )
                    )
                  }
                />
              ))}
        </List>
      )}
      {buttles.length > 0 && (
        <Box display="flex" justifyContent="flex-end">
          <Button
            onClick={() => setOpenResults(!openResults)}
            color="primary"
            variant="contained"
          >
            {openResults ? "Закрыть результаты" : "Открыть результаты"}
          </Button>
        </Box>
      )}
      {buttles.length > 0 && openResults && (
        <Results
          commands={commands}
          buttles={buttles.filter((b) => b.includeInResults)}
        />
      )}
    </Container>
  );
}
