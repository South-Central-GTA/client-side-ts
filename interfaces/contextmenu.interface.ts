import { ActionInterface } from "./action.interface";

export interface IContextMenu {
  title: string;
  x: number;
  y: number;
  actions: ActionInterface[];
}
