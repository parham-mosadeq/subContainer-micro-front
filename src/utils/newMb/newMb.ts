import { ReplaySubject } from "rxjs";

export type Message = {
  type: string;
  payload?: Record<string, unknown>;
  callback?: (arg?: unknown) => void;
};

class MessageBroker {
  private subject = new ReplaySubject<Message>();

  subscribe(callback: (message: Message) => void): Promise<() => void> {
    console.log("Subscribing to message broker...");
    return new Promise((resolve) => {
      const subscription = this.subject.subscribe((msg) => {
        console.log("Message received in broker:", msg);
        callback(msg);
      });
      resolve(() => subscription.unsubscribe());
    });
  }

  publish(message: Message): void {
    console.log("Publishing message:", message);
    this.subject.next(message);
  }

  // publish(message: Message): Promise<unknown> {
  //   console.log("Publishing...", message);
  //   return new Promise((resolve) => {
  //     this.subject.next({ type: "", payload: {}, callback: resolve });
  //   });
  // }

  // subscribe(callback: (message: Message) => void): Promise<() => void> {
  //   return new Promise((resolve) => {
  //     const subscription = this.subject.subscribe(callback);
  //     resolve(() => subscription.unsubscribe());
  //   });
  // }
}

const messageBroker = new MessageBroker();
export default messageBroker;
