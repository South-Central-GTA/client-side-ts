import {Reflection as Reflect} from '@abraham/reflection';
import {container} from 'tsyringe';
import {EventInterface} from "@interfaces/event.interface";
import {KeyEventsInterface, KeyEventsModuleInterface} from "@interfaces/key-events-module.interface";
import {EventModule} from "../modules/event.module";
import {EventModuleInterface} from "@interfaces/event-module.interface";

/**
 * Provide the ability to use method decorators
 *
 * @returns {ClassDecorator}
 * @constructor
 */
export const foundation = (): ClassDecorator => {
    return function (target: any) {
        let currentInstance = container.resolve(target);
        addEvents(target, currentInstance);
        addKeyEvents(target, currentInstance);
    };
};

/**
 * Register event listener as decorator
 *
 * @param target
 * @param currentInstance
 */
function addEvents(target: any, currentInstance: any): void {
    if (Reflect.hasMetadata('events', target)) {
        let eventModule = container.resolve<EventModuleInterface>('EventModule');
        let events = Reflect.getMetadata('events', target) as EventInterface[] || [];

        events.forEach((event: EventInterface) => {
            eventModule.listener(event.type, event.name, currentInstance[event.method].bind(currentInstance));
        });
    }
}

/**
 * Add key events
 *
 * @param target
 * @param currentInstance
 */
function addKeyEvents(target: any, currentInstance: any): void {
    if (Reflect.hasMetadata('keyup', target) || Reflect.hasMetadata('keydown', target)) {
        let keyEventModule = container.resolve<KeyEventsModuleInterface>('KeyEventModule');

        let keyupEvents = Reflect.getMetadata('keyup', target) as KeyEventsInterface[] || [];
        let keydownEvents = Reflect.getMetadata('keydown', target) as KeyEventsInterface[] || [];

        keyupEvents.forEach((keyup: KeyEventsInterface) => {
            keyEventModule.keyup(keyup.key, currentInstance[keyup.callback].bind(currentInstance));
        });

        keydownEvents.forEach((keydown: KeyEventsInterface) => {
            keyEventModule.keydown(keydown.key, currentInstance[keydown.callback].bind(currentInstance));
        });
    }
}