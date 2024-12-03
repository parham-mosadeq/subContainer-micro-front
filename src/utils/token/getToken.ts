import { map } from "rxjs";
import messageBroker from "../message-broker";

export default function handleSub(event = "getToken") {
  const subscription = messageBroker
    .subscribeToMessages()
    .pipe(
      map((data) => ({
        ...data,
        receivedDate: Date.now(),
      }))
    )
    .subscribe((message) => {
      console.log("Received message: from host app", message, "arg: ", event);
    });
  return { unsubscribe: () => subscription.unsubscribe(), event };
}
