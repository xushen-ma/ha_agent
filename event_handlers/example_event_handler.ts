import { StateChangedEvent, EventHandler } from '../event_handler';
import { EventSubscriptions } from '../event_subscriptions';
import { HomeAssistantInstance } from '../home_asistant_instance';

export default class ExampleEventHandler extends EventHandler {
    /**
     * Overrides the initialize method from the parent EventHandler class.
     */
    async initialize(instance: HomeAssistantInstance): Promise<EventSubscriptions | void> {
        console.log("Example initialization.");
        return EventSubscriptions.allOn();
    }

    /**
     * Overrides the handleEvent method from the parent EventHandler class.
     */
    async handleStateChanged(instance: HomeAssistantInstance, time_fired: string, event: StateChangedEvent) {
        console.log("Example handling for the event:", event);
    }
}