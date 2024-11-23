import { PluginFactory } from "@medad-mce/core";
import { emitShapesModalOpenStream } from "./events/shapes-ui.events";
import { ShapeType } from "./types/shape.type";
import { Shapes } from "./types/shapes.enum";
import { BUTTONS, COMMANDS } from './shapes.constants';
export class ShapesPlugin extends PluginFactory {
    constructor() {
        super('shapes', {
            name: 'shapes'
        })
    }

    onLoadUi = () => import('./ui/shapes.ui');

    onInit(): void {
        this.editor?.ui.registry.addButton(BUTTONS.insert_shape, {
            onAction: () => this.onOpenShapesModal(),
            text: 'shapes',
        });

        this.editor?.addCommand(COMMANDS.on_insert_shape, (_, value: ShapeType) => this.onShapeInsert(value))
    }

    private onOpenShapesModal(): void {
        emitShapesModalOpenStream();
    }

    private createPlaceHolder(): HTMLElement {
        if (!this.editorDocument) throw new Error('No editor document found');
        return this.editorDocument.createElement('div');
    }

    private assignShapeStyle(shape: ShapeType, element: HTMLElement): void {
        shape.width *= shape.scale;
        shape.height *= shape.scale;

        if (shape.shape === Shapes.Square || shape.shape === Shapes.Circle) {
            shape.height = shape.width; // Convert width and height in same 
        }

        element.style.width = (shape.width || 1) + 'px';
        element.style.height = (shape.height || 1) + 'px';
        element.style.backgroundColor = shape.backgroundColor || 'transparent';
        element.style.borderWidth = `1px`;
        element.style.borderColor = '#000';

        if (shape.border) {
            element.style.borderWidth = `${shape.border.width}px`;
            element.style.borderColor = shape.border.color;
        }

        if (shape.shape === Shapes.Circle) {
            element.style.borderRadius = '50%';
        }
    }

    private isFloatingPluginRegistered(): boolean {
        return this.editor?.queryCommandSupported('add_floating_element') || false;
    }

    private makeElementFloating(element: HTMLElement) {
        if (!this.isFloatingPluginRegistered()) {
            throw new Error('Floating element has not been registered !');
        }
        this.editorBody?.appendChild(element);
        const instanceID = Date.now().toString(16);
        element.id = `shape-${instanceID}`;
        this.editor?.execCommand('add_floating_element', false, element.id);
    }

    private onShapeInsert(shape: ShapeType): void {
        const elementPlaceHolder = this.createPlaceHolder();
        this.assignShapeStyle(shape, elementPlaceHolder);
        if (this.isFloatingPluginRegistered()) {
            this.makeElementFloating(elementPlaceHolder);
        }
    }
}
