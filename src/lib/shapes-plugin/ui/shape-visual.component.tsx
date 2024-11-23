import { FormEvent, useState } from "react";
import { ShapesVisualProps } from "../types/shapes-ui-props.type";
import { Button } from '@medad-mce/components';

export default function ShapeVisual(props: ShapesVisualProps) {
    const [backgroundColor, setBackgroundColor] = useState<string>('#000000');
    const [borderColor, setBorderColor] = useState<string>('#000000');

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!props.onSubmit) return;
        props.onSubmit({
            backgroundColor,
            border: {
                color: borderColor,
                width: +event.currentTarget.borderWidth.value || 1
            }
        });
    }

    const onClose = () => {
        if (!props.onClose) return;
        props.onClose();
    }

    return <form onSubmit={onSubmit}>
        <figure>
            <figure style={{ padding: "10px" }}>
                <label style={{
                    padding: '3px 20px',
                    backgroundColor: backgroundColor
                }} htmlFor="shape-visual-bgcolor">

                </label>
                <input
                    type="color"
                    defaultValue={backgroundColor}
                    style={{
                        opacity: '0'
                    }}
                    id="shape-visual-bgcolor"
                    name="backgroundColor"
                    onBlur={e => {
                        setBackgroundColor(e.currentTarget.value as string);
                    }}
                />
            </figure>

        </figure>
        <figure>
            <figure>
                <label htmlFor="shape-visual-border-width">
                    Border width:
                </label>
                <input
                    name="borderWidth"
                    id="shape-visual-border-width"
                    type="number"
                />
            </figure>
            <figure style={{ padding: "10px" }}>
                <label
                    style={{
                        padding: '3px 20px',
                        backgroundColor: borderColor
                    }}
                    htmlFor="shape-visual-border-color"
                ></label>
                <input
                    type="color"
                    defaultValue={borderColor}
                    style={{
                        opacity: '0'
                    }}
                    id="shape-visual-border-color"
                    name="borderColor"
                    onBlur={e => {
                        setBorderColor(e.currentTarget.value as string);
                    }}
                />
            </figure>
        </figure>
        <figure >
            <Button variant="primary" type="submit">
                Submit
            </Button>
            <Button onClick={onClose} variant="secondary" type="reset">
                Close
            </Button>
        </figure>
    </form>
}