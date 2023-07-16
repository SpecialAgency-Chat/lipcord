import { EventEmitter as OGEventEmitter } from "events";


export class EventEmitter extends OGEventEmitter {
  on(event: "close", listener: (id: string) => void) {
    super.on(event, listener);
    return this;
  }
}