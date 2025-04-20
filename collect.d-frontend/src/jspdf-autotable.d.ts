declare module 'jspdf-autotable' {
    interface AutoTableOptions {
        startY?: number;
        margin?: { top?: number; left?: number; right?: number; bottom?: number };
        head?: string[][];
        body?: any[][];
        foot?: string[][];
        styles?: {
            cellPadding?: number;
            fontSize?: number;
            font?: string;
            cellWidth?: 'auto' | 'wrap' | number;
            overflow?: 'linebreak' | 'ellipsize' | 'visible' | 'hidden';
            valign?: 'top' | 'middle' | 'bottom';
            halign?: 'left' | 'center' | 'right' | 'justify';
            fillColor?: number | number[] | string;
            textColor?: number | number[] | string;
            fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
            lineWidth?: number;
            lineColor?: number | number[] | string;
        };
        headStyles?: any;
        bodyStyles?: any;
        footStyles?: any;
        alternateRowStyles?: any;
        columnStyles?: { [key: string]: any };
        didParseCell?: (data: any) => void;
        willDrawCell?: (data: any) => void;
        didDrawCell?: (data: any) => void;
        didDrawPage?: (data: any) => void;
    }

    function autoTable(doc: any, options: AutoTableOptions): void;
    export default autoTable;
} 