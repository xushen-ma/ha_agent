import path from 'path';
import WebSocket from 'ws';
import config from './config';
import { Event, EventHandler } from './event_handler';

class HomeAssistantAgent {
    private ws: WebSocket;
    private eventHandler: EventHandler;
    private readonly haURL: string;
    private readonly accessToken: string;

    constructor(eventHandlerClass: typeof EventHandler) {
        this.haURL = `ws://${config.host}/api/websocket`;
        this.accessToken = config.token;
        this.ws = new WebSocket(this.haURL);
        this.eventHandler = new eventHandlerClass();

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.ws.on('open', this.handleOpen.bind(this));
        this.ws.on('message', this.handleMessage.bind(this));
        this.ws.on('close', this.handleClose.bind(this));
        this.ws.on('error', this.handleError.bind(this));
    }

    private handleOpen(): void {
        console.log('Connected to Home Assistant');
    }

    private handleMessage(message: string): void {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'event':
                this.handleEvent(data.event);
                break;
            case 'auth_required':
                console.log('Start authentication');
                this.authenticate();
                break;
            case 'auth_ok':
                    console.log('Authenticated successfully');
                    this.subscribeToEvents();
                    break;
            case 'result':
                console.log(data.success ? "Succeeded" : "Failed");
                if (data.result != null) {
                    console.log('Result: ' + data.result);
                }
                break;
            case 'auth_invalid':
                console.error('Authentication failed:', data.message);
                this.ws.close();
                break;
            default:
                console.log('Received unexpected data:', data);
                break;
        }
    }

    public handleEvent(event: Event): void {
        const {event_type} = event;
        switch (event_type) {
            case 'state_changed':
                this.eventHandler.handleStateChanged(event.time_fired, event.data);
                break;
            case 'call_service':
                this.eventHandler.handleCallService(event.time_fired, event.data);
                break;
            case 'automation_triggered':
                this.eventHandler.handleAutomationTriggered(event.time_fired, event.data);
                break;
            case 'ios.became_active':
                this.eventHandler.handleIosBecameActive(event.time_fired, event.data);
                break;
            case 'ios.entered_background':
                this.eventHandler.handleIosEnteredBackground(event.time_fired, event.data);
                break;
            default:
                this.eventHandler.handleUnknownEvent(event);
                break;
        }
    }

    private handleClose(): void {
        console.log('Connection closed');
    }

    private handleError(error: any): void {
        console.error('Error:', error);
    }

    private authenticate(): void {
        this.ws.send(JSON.stringify({
            type: 'auth',
            access_token: this.accessToken
        }));
    }

    private subscribeToEvents(): void {
        this.ws.send(JSON.stringify({
            id: 1,
            type: 'subscribe_events'
        }));
    }
}

const eventHandlerFile = process.argv[2];
const eventHandlerFileAbsolutePath = path.resolve(eventHandlerFile);
console.log(`Loading EventHandler from ${eventHandlerFileAbsolutePath}`);

import(eventHandlerFileAbsolutePath).then(module => {
    const customerHandler = module.default;
    new HomeAssistantAgent(customerHandler);
});