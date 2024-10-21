export enum IMSTableHeadInputType {
    TEXT = "text",
    NUMBER = "number"
}

export interface IMSTblKeyInputType {
    key: string;
    inputType: IMSTableHeadInputType;
    optValues?: string[]
}

export interface IMSTblHead {
    key: string; // ID OF EVERY CELL
    label: string; // HEADER TEXT
    inputType?: IMSTableHeadInputType;
    hideOnMobileDevice?: boolean;
    hideOnTabletDevice?: boolean;
    hideOnDesktopDevice?: boolean;
}

export interface IMSTblCell {
    key: string; // RELATIONSHIP WITH HEADER
    value: string; // VALUE TO BE DISPLAYED
}