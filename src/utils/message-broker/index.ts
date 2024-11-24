import { ReplaySubject } from "rxjs";

export interface IEventMessage {
  event: string;
  callback: (result: unknown) => void;
}

class MessageBroker {
  private messageBus = new ReplaySubject<IEventMessage>(1);

  sendMessage(event: string, callback: (result: unknown) => void) {
    console.log(`Sending message: ${event}`);

    this.messageBus.next({ event, callback });
  }

  subscribeToMessages() {
    return this.messageBus.asObservable();
  }
}

export default new MessageBroker();
