import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";

const App = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
