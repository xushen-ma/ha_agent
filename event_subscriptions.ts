export class Subscription {
    value: boolean | string[];

    constructor(value: boolean | string[] = false) {
        this.value = value;
    }

    isSubscribed(key?: string): boolean {
        if (this.value === true) return true;
        if (Array.isArray(this.value) && key) return this.value.includes(key);
        return false;
    }

    getStatus(): string {
        if (this.value === true) {
            return "Subscribed to all";
        }
        if (Array.isArray(this.value) && this.value.length > 0) {
            return `Subscribed to: ${this.value.join(", ")}`;
        }
        return "Not subscribed";
    }
}

export class EventSubscriptions {
    state_change: Subscription;
    call_service: Subscription;
    automation_triggered: Subscription;
    ios_became_active: Subscription;
    ios_enter_background: Subscription;
    unknown_events: Subscription;

    constructor() {
        this.state_change = new Subscription();
        this.call_service = new Subscription();
        this.automation_triggered = new Subscription();
        this.ios_became_active = new Subscription();
        this.ios_enter_background = new Subscription();
        this.unknown_events = new Subscription();
    }

    static allOff(): EventSubscriptions {
        return new EventSubscriptions(); // By default, all are off
    }

    static allOn(): EventSubscriptions {
        const subscriptions = new EventSubscriptions();
        Object.values(subscriptions).forEach(subscription => subscription.value = true);
        return subscriptions;
    }

    setSubscriptionStateChange(value: boolean | string[]): this {
        this.state_change.value = value;
        return this;
    }

    setSubscriptionCallService(value: boolean | string[]): this {
        this.call_service.value = value;
        return this;
    }

    setSubscriptionAutomationTriggered(value: boolean | string[]): this {
        this.automation_triggered.value = value;
        return this;
    }

    setSubscriptionIosBecameActive(value: boolean | string[]): this {
        this.ios_became_active.value = value;
        return this;
    }

    setSubscriptionIosEnterBackground(value: boolean | string[]): this {
        this.ios_enter_background.value = value;
        return this;
    }

    setSubscriptionUnknownEvents(value: boolean | string[]): this {
        this.unknown_events.value = value;
        return this;
    }

    getSummary(): string {
        return Object.entries(this)
            .filter(([, value]) => value instanceof Subscription)
            .map(([key, value]) => `[${key}] ${(value as Subscription).getStatus()}`)
            .join("\n");
    }
}
