import { useEffect, useRef, useState } from "react";
import { Modal } from "@medad-mce/components";
import { PluginUiProps } from "@medad-mce/core";
import { shapesModalOpenStream$ } from "../events/shapes-ui.events";
import ShapeProperty from "./shape-property.component";
import { ShapePropertyType, ShapeType, ShapeVisualType } from "../types/shape.type";
import ShapeVisual from "./shape-visual.component";

export default function ShapesModal(props: PluginUiProps) {
    const shapeProperty = useRef<ShapePropertyType>();
    const shapeVisual = useRef<ShapeVisualType>();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<'shapeProperty' | 'shapeVisual'>('shapeProperty');

    const onClose = () => {
        setIsOpen(false);
        setCurrentStep('shapeProperty');
    }

    const onShapeVisualSubmitted = (fetchedShapeVisual: ShapeVisualType) => {
        shapeVisual.current = fetchedShapeVisual;

        if (!shapeProperty.current) {
            throw new Error('Shape property is has not defined');
        }

        const payload: ShapeType = {
            ...shapeProperty.current,
            ...fetchedShapeVisual,
        };

        props.editor?.execCommand('on_insert_shape', false, payload);

        onClose();
    }

    const onPropertySubmitted = (fetchedShapeProperty: ShapePropertyType) => {
        shapeProperty.current = fetchedShapeProperty;
        setCurrentStep('shapeVisual');
    }

    useEffect(() => {
        const sub = shapesModalOpenStream$.subscribe({
            next: () => {
                if (isOpen) return;
                setIsOpen(true);
            }
        });

        return () => sub.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Modal open={isOpen} onClose={onClose} title="Shapes" >
        {currentStep === 'shapeProperty' ?
            <ShapeProperty onSubmit={onPropertySubmitted} onClose={onClose} />
            : <></>}

        {currentStep === 'shapeVisual' ?
            <ShapeVisual onSubmit={onShapeVisualSubmitted} onClose={onClose} />
            : <></>}
    </Modal>
}
