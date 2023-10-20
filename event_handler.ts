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

export type Event = {
    event_type: string;
    data: any;
    origin: string;
    time_fired: string;
    context: any;
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
    async initialize(instance: HomeAssistantInstance): Promise<void> {}
    handleStateChanged(time_fired: string, event: StateChangedEvent): void {}
    handleCallService(time_fired: string, event: CallServiceEvent): void {}
    handleAutomationTriggered(time_fired: string, event: AutomationTriggeredEvent): void {}
    handleIosBecameActive(time_fired: string, event: IosBecameActiveEvent): void {}
    handleIosEnteredBackground(time_fired: string, event: IosEnteredBackgroundEvent): void {}
    handleUnknownEvent(event: any): void {}
}
