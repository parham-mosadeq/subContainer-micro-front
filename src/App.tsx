import "./App.css";
import Editors from "./Editor";

function App() {
  return (
    <div className="w-[20px] h-[20px]">
      Sub-Container
      <div>
        <Editors />
      </div>
    </div>
  );
}

export default App;
