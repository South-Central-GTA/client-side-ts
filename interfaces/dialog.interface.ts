import {DialogType} from "@enums/dialog.type";

export interface DialogInterface {
    type: DialogType
    title: string;
    description: string;
    hasBankAccountSelection: boolean;
    hasInputField: boolean;
    freezeGameControls: boolean;
    dataJson?: string;
    primaryButton?: string;
    secondaryButton?: string;
    primaryButtonServerEvent?: string;
    secondaryButtonServerEvent?: string;
    closeButtonServerEvent?: string;
    primaryButtonClientEvent?: string;
    secondaryButtonClientEvent?: string;
    closeButtonClientEvent?: string;
}