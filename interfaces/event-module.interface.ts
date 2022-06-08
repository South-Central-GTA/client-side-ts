export interface EventModuleInterface {

    /**
     * Receive event from client
     * @param {string} name
     * @param {(...args: any[]) => void} callback
     */
    onClient?(name: string, callback: (...args: any[]) => void): void;

    /**
     * Receive event from client
     *
     * @param {string} name
     * @param {(...args: any[]) => void} callback
     */
    onGui?(name: string, callback: (...args: any[]) => void): void;

    /**
     * Emit event to server
     * @param {string} name
     * @param args
     */
    emitServer?(name: string, ...args: any[]): void;

    /**
     * Register listener
     * @param {string} type
     * @param {string} name
     * @param {(...args: any[]) => void} callback
     */
    listener(type: string, name: string, callback: (...args: any[]) => void): void;

    /**
     * Receive event from server/client
     *
     * @param {string} name
     * @param {(...args: any[]) => void} callback
     */
    on(name: string, callback: (...args: any[]) => void): void;

    /**
     * Receive event from server
     * @param {string} name
     * @param {(...args: any[]) => void} callback
     */
    onServer?(name: string, callback: (...args: any[]) => void): void;

    /**
     * Emit event to server/client
     * @param {string} name
     * @param args
     */
    emit(name: string, ...args: any[]): void;
}