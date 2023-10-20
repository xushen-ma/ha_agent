import { StateChangedEvent, EventHandler } from '../event_handler';
import { HomeAssistantInstance } from '../home_asistant_instance';

export default class ExampleEventHandler extends EventHandler {
    /**
     * Overrides the initialize method from the parent EventHandler class.
     */
    async initialize(instance: HomeAssistantInstance) {
        console.log("Example initialization.");
    }

    /**
     * Overrides the handleEvent method from the parent EventHandler class.
     */
    handleStateChanged(time_fired: string, event: StateChangedEvent) {
        console.log("Example handling for the event:", event);
    }
}