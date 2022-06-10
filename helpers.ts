import * as alt from "alt-client";
import * as native from "natives";

/**
 * Convert given value to event name.
 * e.g: myAwesomeEvent => my:awesome:event
 * Only for custom events, alt:v client events would be excluded
 *
 *
 * @param {string} value
 * @returns {string}
 */
export function convertToEventName(value: string) {
    const clientEvents = ['anyResourceError', 'anyResourceStart', 'anyResourceStop', 'connectionComplete', 'consoleCommand', 'disconnect', 'gameEntityCreate', 'gameEntityDestroy', 'keydown', 'keyup', 'removeEntity', 'resourceStart', 'resourceStop', 'syncedMetaChange', 'streamSyncedMetaChange', 'enteredVehicle', 'changedVehicleSeat', 'leftVehicle', 'taskChange'];

    return clientEvents.includes(value) ? value : value.replace(/([a-zA-Z])(?=[A-Z])/g, '$1:')
            .toLowerCase();
}

export const loadModel = async (modelHash, timeoutMs = 10000) => {
    return new Promise((resolve, reject) => {
        if (!native.isModelValid(modelHash)) {
            reject(new Error(`Model does not exist: ${modelHash}`));
            return;
        }

        if (native.hasModelLoaded(modelHash)) {
            resolve(true);
            return;
        }

        native.requestModel(modelHash);

        const deadline = new Date().getTime() + timeoutMs;

        const inter = alt.setInterval(() => {
            if (native.hasModelLoaded(modelHash)) {
                alt.clearInterval(inter);
                resolve(true);
            } else if (deadline < new Date().getTime()) {
                alt.clearInterval(inter);
                const error = `Error: Async loading failed for model: ${modelHash}`;
                alt.log(error);
                reject(resolve(false));
            }
        }, 10);
    });
};

export function getGroundZ(x, y, z, tries = 0) {
    native.setFocusPosAndVel(x, y, z, 0, 0, 0);
    let [_, height] = native.getGroundZFor3dCoord(x, y, z + 1, 0, undefined, undefined);

    if (!height && tries < 20) return getGroundZ(x, y, z + 5, ++tries);

    native.clearFocus();
    if (!height) return 0;

    return height;
}

/**
 * Delay for a number of milliseconds
 */
export function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay) {
        ;
    }
}

export const UUIDV4 = (): string => {
    let uuid = ''
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    for (let ii = 0; 32 > ii; ii += 1) {
        8 === ii || 20 === ii ? (uuid += '-', uuid += (0 | 16 * Math.random()).toString(
                16)) : 12 === ii ? (uuid += '-', uuid += '4') : 16 === ii ? (uuid += '-', uuid += (8 | 4 * Math.random()).toString(
                16)) : uuid += (0 | 16 * Math.random()).toString(16)
    }
    return uuid
}

export const UID = (): number => {
    return Math.floor(Math.random() * 9999999);
}