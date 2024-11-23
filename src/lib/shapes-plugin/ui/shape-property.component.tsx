import { FormEvent, useState } from 'react';
import { ShapesPropertyProps } from '../types/shapes-ui-props.type';
import { Shapes } from '../types/shapes.enum';
import { Button } from '@medad-mce/components';

const SEALED_SHAPES = [
    Shapes.Circle,
    Shapes.Square,
];

export default function ShapeProperty(props: ShapesPropertyProps) {
    const [selectedShape, setSelectedShape] = useState<Shapes>(Shapes.Rectangle);

    const onClose = () => {
        if (!props.onClose) return;
        props.onClose();
    }

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!props.onSubmit) return;

        props.onSubmit({
            shape: +event.currentTarget.shape.value as Shapes,
            scale: Math.max(+event.currentTarget.scale.value, 1),
            width: Math.max(+event.currentTarget.width.value, 1),
            height: Math.max(+event.currentTarget.height.value, 1),
        });
    }

    return (
        <form onSubmit={onSubmit} target='#'>
            <select name="shape" defaultValue={selectedShape} onChange={(e) => {
                setSelectedShape(+e.currentTarget.value as Shapes);
            }}>
                <option value={Shapes.Rectangle}>Rectangle</option>
                <option value={Shapes.Circle}>Circle</option>
                <option value={Shapes.Square}>Square</option>
            </select>

            <figure>
                <label htmlFor="shapes-width">Width: </label>
                <input defaultValue={1} type="number" name="width" id="shapes-width" placeholder="width" disabled={SEALED_SHAPES.includes(selectedShape)} />
            </figure>
            <figure>
                <label htmlFor="shapes-height">Height: </label>
                <input defaultValue={1} type="number" name="height" id="shapes-height" placeholder="height" disabled={SEALED_SHAPES.includes(selectedShape)} />
            </figure>
            <figure>
                <label htmlFor="shapes-scale">Scale: </label>
                <input defaultValue={1} type="number" name="scale" id="shapes-scale" placeholder="scale" />
            </figure>
            <figure >
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <Button onClick={onClose} variant="secondary" type="reset">
                    close
                </Button>
            </figure>
        </form>
    );
}