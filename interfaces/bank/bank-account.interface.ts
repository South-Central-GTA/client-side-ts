import { BankAccountCharacterAccessInterface } from "./bank-account-character-access.interface - Copy";
import { BankAccountGroupAccessInterface } from "./bank-account-group-access.interface";

export interface BankAccountInterface {
    id: number;
    status: number;
    type: number;
    amount: string;
    bankDetails: string;
    characterAccesses: BankAccountCharacterAccessInterface[];
    groupAccesses: BankAccountGroupAccessInterface[]
}