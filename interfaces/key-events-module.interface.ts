export interface KeyEventsInterface {
    key: number;
    callback: string;
}

export interface KeyEventsModuleInterface {
    /**
     * Add listener helper for decorators
     * @param {string} type
     * @param {number} key
     * @param {Function} callback
     */
    listener(type: string, key: number, callback: CallableFunction): void;

    /**
     * Register keyup events
     * @param {number} key
     * @param {Function} callback
     */
    keyup(key: number, callback: CallableFunction): void;

    /**
     * Register keydown events
     * @param {number} key
     * @param {Function} callback
     */
    keydown(key: number, callback: CallableFunction): void;

    /**
     * Run available key commands
     * @param {number} key
     * @param {string} type
     */
    run(key: number, type: string): void;
}