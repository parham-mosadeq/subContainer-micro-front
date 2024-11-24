import "./App.css";
import Editors from "./Editor";
// import messageBroker from "./utils/message-broker";
// import { useEffect } from "react";

function App() {
  // useEffect(() => {
  //   messageBroker.subscribeToMessages().subscribe((msg) => {
  //     if (msg.event === "get_token") {
  //       console.log(msg, "hooorayyy");
  //       msg.callback(true);
  //     }
  //   });
  // }, []);
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
