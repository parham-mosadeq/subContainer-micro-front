import { useEffect, useState } from "react";
import { Button, Modal } from "@medad-mce/components";
import { PluginUiProps } from "@medad-mce/core";
import { openBorderPanel$ } from "../events/border.events";
import { Border } from "../models/border.model";
import { Directions } from "../types/directions.type";
import { PanelState } from "../types/panel-states.enum";
import { BorderDetails } from "./border-details.ui";
import { BorderDirections } from "./border-directions.ui";

export default function BorderPanel(props: PluginUiProps) {
  const [borderDetails, setBorderDetails] = useState<Border>(new Border());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [panelState, setPanelState] = useState<PanelState>(
    PanelState.SELECT_DIRECTIONS
  );

  useEffect(() => {
    const sub = openBorderPanel$.subscribe({
      next: (borderData) => {
        if (isOpen) return;
        setBorderDetails(borderData);
        setIsOpen(true);
      },
    });

    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = () => {
    setIsOpen(false);
    setPanelState(PanelState.SELECT_DIRECTIONS);
  }

  const onChange = (directions: Directions[]) => {
    const clone = borderDetails;
    clone.directions = directions;
    setBorderDetails(clone);
  }

  const onSubmit = () => {
    if (panelState === PanelState.SELECT_DIRECTIONS) {
      setPanelState(PanelState.DEFINE_PROPERTIES);
      return;
    }

    props.editor?.execCommand("insert_border", false, borderDetails);
    onClose();
  }

  const onRemove = () => {
    const border = new Border();
    setBorderDetails(border);
    props.editor?.execCommand('insert_border', false, border);
    onClose();
  }

  return (
    <Modal open={isOpen} title="border" onClose={onClose}>
      <div className="flex gap-4 flex-col">
        {panelState === PanelState.SELECT_DIRECTIONS ? (
          <BorderDirections defaultDirections={borderDetails.directions || []} onChange={onChange} />
        ) : (
          <></>
        )}

        {panelState === PanelState.DEFINE_PROPERTIES ? (
          <BorderDetails defaultValue={borderDetails} borderRef={borderDetails} />
        ) : (
          <></>
        )}

        <div className="flex flex-row-reverse gap-x-5">
          <Button variant="primary" onClick={onSubmit}>
            بعدی
          </Button>
          <Button variant="secondary" onClick={onClose}>
            بستن
          </Button>
          <Button variant='secondary' onClick={onRemove}>
            حذف
          </Button>
        </div>
      </div>
    </Modal>
  );
}
