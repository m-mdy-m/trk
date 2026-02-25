import { EventBroker } from "@glandjs/events";
import type { TrkEvents } from "./events";

/**
 * TRK Event Bus
 */
export const bus = new EventBroker<TrkEvents>({
  name: "trk-bus",
  maxListeners: 10,
  defaultTimeout: 5000,
});

export * from "./events";
