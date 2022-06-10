export interface DeliveryInterface {
    id: number;
    deliveryType: number;
    orderGroupId: number;
    orderGroupName: string;
    supplierGroupId: number;
    supplierGroupName: string;
    createdAtJson: string;
    supplierFullName: string;
    supplierPhoneNumber: string;
    status: number;
}