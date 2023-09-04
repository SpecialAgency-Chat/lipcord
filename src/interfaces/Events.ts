import { APIPingInteraction, InteractionType } from "discord-api-types/v10";

type EventNames = keyof typeof InteractionType;
export type EventValues = (typeof Events)[keyof typeof Events];

export const Events = {
  Ping: "ping",
  ApplicationCommand: "applicationCommand",
  MessageComponent: "messageComponent",
  ApplicationCommandAutocomplete: "applicationCommandAutoComplete",
  ModalSubmit: "modalSubmit"
} as const satisfies Record<EventNames, string>;

type EventMaps = Record<EventValues, (...args: never[]) => void | Promise<void>>
type Awaited = void | Promise<void>;

export interface EventHandlers extends EventMaps {
  ping: (raw: APIPingInteraction) => Awaited;
  applicationCommand: (interaction: ApplicationCommandInteraction) => Awaited;
}