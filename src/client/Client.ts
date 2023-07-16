import { ClientOptions } from "@/interfaces";
import { Env, Hono } from "hono";
import { EventEmitter } from "./EventEmitter";

export class Client extends EventEmitter {
  public app: Hono<Env, object, "/">;
  public options: ClientOptions = {};
  constructor(options?: ClientOptions) {
    super();
    this.app = new Hono();
    if (options) this.options = options;
  }
}