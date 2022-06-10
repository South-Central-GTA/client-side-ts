import {singleton} from "tsyringe";
import * as alt from "alt-client";
import {LoggerModule} from "./logger.module";

@singleton()
export class EventModule {
    /**
     * Available listener types for client
     *
     * @type {string[]}
     */
    readonly availableListenerTypes = ['on', 'onServer', 'onGui'];

    public constructor(private readonly logger: LoggerModule) {
    }

    /**
     * Register listener
     *
     * @param {string} type
     * @param {string} name
     * @param {Function} callback
     */
    public listener(type: string, name: string, callback: (...args: any[]) => void) {
        if (this.availableListenerTypes.includes(type)) {
            this[type](name, callback);
        }
    }

    /**
     * Receive event from client
     *
     * @param {string} name
     * @param {(...args: any[]) => void} callback
     */
    public on(name: string, callback: (...args: any[]) => void) {
        alt.on(name, callback);
    }

    /**
     * Receive event from gui
     *
     * @param name
     * @param {(...args: any[]) => void} callback
     */
    public onGui(name: string, callback: (...args: any[]) => void) {
        alt.emit('webview:on', name, callback);
    }

    /**
     * Receive event from server
     *
     * @param {string} name
     * @param {(...args: any[]) => void} callback
     */
    public onServer(name: string, callback: (...args: any[]) => void) {
        alt.onServer(name, callback);
    }

    /**
     * Emit event to server
     *
     * @param {string} name
     * @param args
     */
    public emit(name: string, ...args: any[]) {
        //this.logger.info("EventModule: Emit event '" + name + "' with args: " + args);
        alt.emit(name, ...args);
    }

    /**
     * Emit event to server
     *
     * @param {string} name
     * @param args
     */
    public emitServer(name: string, ...args: any[]) {
        // this.logger.info("EventModule: Emit server event '" + name + "' with args: " + args);
        alt.emitServer(name, ...args);
    }

    /**
     * Emit event to gui
     *
     * @param {string} name
     * @param args
     */
    public emitGui(name: string, ...args: any[]) {
        //this.logger.info("EventModule: Emit gui event '" + name + "' with args: " + JSON.stringify(args));
        alt.emit('webview:emit', name, ...args);
    }
}