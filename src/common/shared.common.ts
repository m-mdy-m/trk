import { bus, TrkEvents } from "@core/events";
import { EventPayload, Events, Listener } from "@glandjs/events";
import { logger } from "@utils/logger";

export abstract class SharedCommand {
  protected logger = logger;
  protected bus = bus;

  protected on<T extends Events<TrkEvents>>(event: T, listener: Listener<EventPayload<TrkEvents, T>, void>) {
    this.bus.on(event, listener);
  }

  protected debugRegistered(name: string) {
    this.logger.debug(`${name} registered`);
  }
}
