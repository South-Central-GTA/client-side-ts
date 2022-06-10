export interface OrderedVehicleInterface {
    id: number;
    model: string;
    displayName: string;
    displayClass: string;

    orderedBy: string;
    deliverdAtJson: string;

    deliveryRequestedAtJson: string;
    deliveryRequestedBy: string;
}
