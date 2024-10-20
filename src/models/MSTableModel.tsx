export interface IMSTblHead {
    key: string; // ID OF EVERY CELL
    label: string; // HEADER TEXT
    hideOnMobileDevice?: boolean;
    hideOnTabletDevice?: boolean;
    hideOnDesktopDevice?: boolean;
}

export interface IMSTblCell {
    key: string; // RELATIONSHIP WITH HEADER
    value: string; // VALUE TO BE DISPLAYED
}