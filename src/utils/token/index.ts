// import { useEffect, useState } from "react";
// import messageBroker from "../message-broker";

// export default function useToken() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   console.log(isLoggedIn, "remote");

//   useEffect(() => {
//     messageBroker.sendMessage("get_token", {}, (token) => {
//       console.log("Received token:", token);
//       if (token) {
//         console.log("success");
//         setIsLoggedIn(true);
//       } else {
//         console.log("failed");
//         setIsLoggedIn(false);
//       }
//     });
//   }, []);

//   return {
//     isLoggedIn,
//     setIsLoggedIn,
//   };
// }
