import { ReplaySubject } from "rxjs";
interface IEventMessage {
  event: string;
  payload: unknown;
  callback: (response: unknown) => void;
}
class MessageService {
  private messageBus = new ReplaySubject<IEventMessage>(1);
  publishMessage(event: string, payload: unknown): Promise<unknown> {
    console.log("Published message...", event, payload);

    return new Promise((resolve) => {
      this.messageBus.next({ event, payload, callback: resolve });
    });
  }
  subscribeToMessages() {
    console.log("Subscribed to a message...,");
    console.log(this.messageBus);

    return this.messageBus.asObservable();
  }
}
export default new MessageService();
