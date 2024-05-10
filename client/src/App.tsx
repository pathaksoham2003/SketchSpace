//import "./App.css";
//import useAuth from "./hooks/useAuth";
import Creator from "./pages/Canvas.tsx/index.tsx";
import Home from "./pages/Home/index";

function App() {
  // const isLogin = useAuth();
        
  return <>{isLogin ? <Home /> : <span>Unauthorized</span>}</>;
}

export default App;
