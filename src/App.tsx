import "./App.css";
import Editors from "./Editor";

function App() {
  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col ">
      Sub-Container
      <div className="min-h-fit">
        <Editors />
      </div>
    </div>
  );
}

export default App;
