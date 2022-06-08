import {ActionInterface} from './action.interface';

export interface ContextMenuInterface {
    title: string;
    x: number;
    y: number;
    actions: ActionInterface[];
}