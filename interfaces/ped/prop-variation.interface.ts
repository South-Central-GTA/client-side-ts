export interface PropVariationInterface {
    NameHash: string;
    AnchorPoint: string;
    ComponentType: string;
    ComponentId: number;
    DrawableId: number;
    TextureId: number;
    TranslatedLabel: { [key: string]: string; };
    Price: number;
    RestrictionTags: string[];
}
