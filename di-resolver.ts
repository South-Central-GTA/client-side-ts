import {container} from "tsyringe";
import {convertToEventName} from "./helpers";
import {EventModule} from "./modules/event.module";
import {LoggerModule} from "./modules/logger.module";
import {KeyEventModule} from "./modules/key-event.module";

container.register('EventModule', {useValue: container.resolve(EventModule)});
container.register('LoggerModule', {useValue: container.resolve(LoggerModule)});
container.register('KeyEventModule', {useValue: container.resolve(KeyEventModule)});
container.register('convertToEventName', {useValue: convertToEventName});