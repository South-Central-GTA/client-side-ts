import {singleton} from "tsyringe";

@singleton()
export class KeyEventModule {

    /**
     * Contains all keyup events
     * @type {Map<any, any>}
     */
    private keyupEvents = new Map();

    /**
     * Contains all keydown events
     * @type {Map<any, any>}
     */
    private keydownEvents = new Map();

    /**
     * Contains available listener types
     * @type {string[]}
     */
    private availableListeners = ['keyup', 'keydown'];

    /**
     * Add listener helper for decorators
     *
     * @param {string} type
     * @param {number} key
     * @param {Function} callback
     */
    public listener(type: string, key: number, callback: CallableFunction): void {
        if (this.availableListeners.includes(type)) {
            this[type](key, callback);
        }
    }

    /**
     * Register keyup events
     *
     * @param {number} key
     * @param {Function} callback
     */
    public keyup(key: number, callback: CallableFunction): void {
        if (this.keyupEvents.has(key)) {
            // throw some errors
            return;
        }
        this.keyupEvents.set(key, callback);
    }

    /**
     * Register keydown events
     *
     * @param {number} key
     * @param {Function} callback
     */
    public keydown(key: number, callback: CallableFunction): void {
        if (this.keydownEvents.has(key)) {
            // throw some errors
            return;
        }
        this.keydownEvents.set(key, callback);
    }

    /**
     * Run available key commands
     *
     * @param {string} type
     * @param {number} key
     */
    public run(type: string, key: number): void {
        if (this.availableListeners.includes(type)) {
            const eventMap = this[`${type}Events`];
            if (eventMap.has(key)) {
                eventMap.get(key).apply(this);
            }
        }

    }

}