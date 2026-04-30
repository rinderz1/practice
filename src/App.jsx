import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./app/router/AppRouter";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;