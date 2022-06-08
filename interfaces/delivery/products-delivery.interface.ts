import {DeliveryInterface} from './delivery.interface';

export interface ProductsDeliveryInterface extends DeliveryInterface {
    productsRemaining: number;
    orderedProducts: number;
}