import {Reflection as Reflect} from "@abraham/reflection";
import {KeyEventsInterface} from "@interfaces/key-events-module.interface";

/**
 * Keyup decorator
 *
 * @param {number | string} key
 * @returns {MethodDecorator}
 */
export const keyup = (key: number | string): MethodDecorator => {
    return (target, propertyKey: string): void => {
        if (!Reflect.hasMetadata('keyup', target.constructor)) {
            Reflect.defineMetadata('keyup', [], target.constructor);
        }

        key = typeof key === 'string' ? key.charCodeAt(0) : key;
        const keyup = Reflect.getMetadata('keyup', target.constructor) as KeyEventsInterface[];

        keyup.push({
            key, callback: propertyKey
        });

        Reflect.defineMetadata('keyup', keyup, target.constructor);

    };
};

/**
 * Keydown decorator
 *
 * @param {number | string} key
 * @returns {MethodDecorator}
 */
export const keydown = (key: number | string): MethodDecorator => {
    return (target, propertyKey: string): void => {
        if (!Reflect.hasMetadata('keydown', target.constructor)) {
            Reflect.defineMetadata('keydown', [], target.constructor);
        }

        key = typeof key === 'string' ? key.toUpperCase().charCodeAt(0) : key;
        const keydown = Reflect.getMetadata('keydown', target.constructor) as KeyEventsInterface[];

        keydown.push({
            key, callback: propertyKey
        });

        Reflect.defineMetadata('keydown', keydown, target.constructor);

    };
};