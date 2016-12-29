declare namespace PTT {

    export interface Schema extends Container {
        data:any;
    }
    export interface Container extends Node {
        boxes: Node[];
        containers: Container[];
    }
    export interface Node {
        name?: string;
        elementName: string;
        style: NodePosition;

        props?: { [index: string]: any };
        bindings?: { [index: string]: any };
    }

    export interface NodePosition {
        top?: number;
        left?: number;
        width?: number;
        height?: number;
        zIndex?: number;
        transform?: any;
    }
}