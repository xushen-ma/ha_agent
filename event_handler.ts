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
    async initialize(instance: HomeAssistantInstance) { }
    async handleStateChanged(instance: HomeAssistantInstance, time_fired: string, event: StateChangedEvent) { }
    async handleCallService(instance: HomeAssistantInstance, time_fired: string, event: CallServiceEvent) { }
    async handleAutomationTriggered(instance: HomeAssistantInstance, time_fired: string, event: AutomationTriggeredEvent) { }
    async handleIosBecameActive(instance: HomeAssistantInstance, time_fired: string, event: IosBecameActiveEvent) { }
    async handleIosEnteredBackground(instance: HomeAssistantInstance, time_fired: string, event: IosEnteredBackgroundEvent) { }
    async handleUnknownEvent(instance: HomeAssistantInstance, event: any) { }
}
