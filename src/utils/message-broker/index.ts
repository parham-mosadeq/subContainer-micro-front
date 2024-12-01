import { ReplaySubject } from "rxjs";
interface IEventMessage {
  event: string;
  payload: unknown;
  callback: (response: unknown) => void;
}
class MessageService {
  private messageBus = new ReplaySubject<IEventMessage>(1);
  publishMessage(event: string, payload: unknown): Promise<unknown> {
    return new Promise((resolve) => {
      this.messageBus.next({ event, payload, callback: resolve });
    });
  }
  subscribeToMessages() {
    return this.messageBus.asObservable();
  }
}
export default new MessageService();
