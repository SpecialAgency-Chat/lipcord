import { EventValues } from "@/interfaces";
import { EventEmitter as OGEventEmitter } from "events";



export class EventEmitter extends OGEventEmitter {
  on<E extends EventValues>(event: E, listener: (id: string) => void) {
    return super.on(event, listener);
  }
}