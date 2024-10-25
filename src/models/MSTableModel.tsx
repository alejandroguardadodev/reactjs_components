interface IKeyValue {
    key: string
    value: string
}

export enum IMSTableHeadInputType {
    TEXT = "text",
    NUMBER = "number",
    DATE= "date"
}

export interface IMSTblKeyInputType {
    key: string
    inputType: IMSTableHeadInputType
    onSubmit?: (data:IKeyValue, id?:string) => void
}

export interface IMSTblHead {
    key: string; // ID OF EVERY CELL
    label: string; // HEADER TEXT
    inputType?: IMSTableHeadInputType;
    size?: number;
    hideOnMobileDevice?: boolean;
    hideOnTabletDevice?: boolean;
    hideOnDesktopDevice?: boolean;
    onSubmit?: (data:IKeyValue, id?:string) => void
}

export interface IMSTblCell {
    key: string; // RELATIONSHIP WITH HEADER
    value: string; // VALUE TO BE DISPLAYED
}

