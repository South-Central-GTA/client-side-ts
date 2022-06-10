import {Reflection as Reflect} from "@abraham/reflection";
import {container} from "tsyringe";
import {EventInterface} from "@interfaces/event.interface";


/**
 * Helper for adding events to meta data
 *
 * @param target
 * @param {string} type
 * @param {string} name
 * @param {string} propertyKey
 */
function validateEventExistsAndPush(target, type: string, name: string, propertyKey: string) {
    let eventName = name || propertyKey;
    const convertToEventName = container.resolve('convertToEventName') as CallableFunction;
    eventName = convertToEventName(eventName);

    if (!Reflect.hasMetadata('events', target.constructor)) {
        Reflect.defineMetadata('events', [], target.constructor);
    }

    const events = Reflect.getMetadata('events', target.constructor) as EventInterface[];

    events.push({
        type, name: eventName, method: propertyKey
    });

    Reflect.defineMetadata('events', events, target.constructor);
}

/**
 * Add on event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 */
export const on = (name?: string): MethodDecorator => {
    return (target, propertyKey: string): void => {
        validateEventExistsAndPush(target, 'on', name, propertyKey);
    };
};

/**
 * Add onServer event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 */
export const onServer = (name?: string): MethodDecorator => {
    return (target, propertyKey: string): void => {
        validateEventExistsAndPush(target, 'onServer', name, propertyKey);
    };
};

/**
 * Add onClient event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 */
export const onClient = (name?: string): MethodDecorator => {
    return (target, propertyKey: string): void => {
        validateEventExistsAndPush(target, 'onClient', name, propertyKey);
    };
};

/**
 * Add onGui event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 */
export const onGui = (name?: string): MethodDecorator => {
    return (target, propertyKey: string): void => {
        validateEventExistsAndPush(target, 'onGui', name, propertyKey);
    };
};