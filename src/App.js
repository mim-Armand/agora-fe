
import './App.css';
import CallBox from "./components/CallBox";
import {AppBar, Container, IconButton, Paper, Toolbar} from "@mui/material";
import Typography from "@mui/material/Typography";
import {ChatTwoTone} from "@mui/icons-material";


function App() {

  return (
    <Container maxWidth="lg">

      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <ChatTwoTone />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Agora Video Chat.
          </Typography>

        </Toolbar>
      </AppBar>

      <Paper id='main-container'>
        <CallBox />
      </Paper>


    </Container>
  );
}

export default App;
