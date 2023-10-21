import { EventSubscriptions } from "./event_subscriptions";
import type { HomeAssistantInstance } from "./home_asistant_instance";

type State = {
    entity_id: string;
    state: string;
    attributes: any;
    last_changed: string;
    last_updated: string;
    context: any;
};

type IosActivityEvent = {
    sourceDeviceID: string;
    sourceDeviceName: string;
    sourceDevicePermanentID: string;
}

export type StateChangedEvent = {
    entity_id: string;
    old_state: State;
    new_state: State;
};

export type CallServiceEvent = {
    domain: string;
    service: string;
    service_data: any;
};

export type AutomationTriggeredEvent = {
    name: string;
    entity_id: string;
    source: string;
}

export type IosBecameActiveEvent = IosActivityEvent;
export type IosEnteredBackgroundEvent = IosActivityEvent;

export class EventHandler {
    // When returns nothing, the handler will not run
    async initialize(instance: HomeAssistantInstance): Promise<EventSubscriptions | void> { }
    handleStateChanged(instance: HomeAssistantInstance, time_fired: string, event: StateChangedEvent) { }
    handleCallService(instance: HomeAssistantInstance, time_fired: string, event: CallServiceEvent) { }
    handleAutomationTriggered(instance: HomeAssistantInstance, time_fired: string, event: AutomationTriggeredEvent) { }
    handleIosBecameActive(instance: HomeAssistantInstance, time_fired: string, event: IosBecameActiveEvent) { }
    handleIosEnteredBackground(instance: HomeAssistantInstance, time_fired: string, event: IosEnteredBackgroundEvent) { }
    handleUnknownEvent(instance: HomeAssistantInstance, event: any) { }
}
export { EventSubscriptions };

