import { logger } from '@lib/utils/logging';
import { EventEmitter } from 'events';

// Events
export const COMPONENT_UPDATE = Symbol("componentUpdate")

class EventManager extends EventEmitter {
  constructor() {
    super();
  }

  emit(eventName: string | symbol, ...args: any[]): boolean {
    // Log the event name and arguments
    logger.debug(`Event emitted: ${eventName.toString()}`, args);

    // Call the original emit method
    return super.emit(eventName, ...args);
  }

}

export const eventManager = new EventManager();
