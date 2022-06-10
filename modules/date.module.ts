import {singleton} from "tsyringe";

@singleton()
export class DateModule {
    public getNumericDate(dateJson: string): string {
        if (dateJson === "") {
            return "";
        }

        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'numeric', day: 'numeric'
        });
    }

    public getDate(dateJson: string): string {
        if (dateJson === "") {
            return "";
        }

        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'long', day: 'numeric'
        });
    }
}