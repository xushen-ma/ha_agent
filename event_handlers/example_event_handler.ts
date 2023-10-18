import { StateChangedEvent, EventHandler } from '../event_handler';

export default class ExampleEventHandler extends EventHandler {
    /**
     * Overrides the handleEvent method from the parent EventHandler class.
     */
    handleStateChanged(time_fired: string, event: StateChangedEvent): void {
        console.log("Example handling for the event:", event);
    }
}