import React from "react";
import { observer } from "mobx-react";
import { Col } from "../Bridge/Bricks/bricksShaper";
import Butt from "../Bridge/Bricks/Butt";
import { MdRestore, MdSave } from "react-icons/md";
import { Hokey } from "../misc/Hotkeys";
import { computed } from "mobx";

type Types = {
  store: any,
  canSaveName?: string,
  saveName?: string,
  canRevertName?: string,
  revertName?: string,
  saveTooltipName?: string,
  isSavingName?: string,

  revertContainerProps?: any,
  revertButtProps?: any,
  spacerProps?: any,
  saveButtProps?: any
};

@observer
export class SaveControls extends React.Component<Types> {
  @computed get canSave(): boolean {
    const canSaveName = this.props.canSaveName || "canSave";
    const store = this.props.store;

    console.log("SAVE CONTROL PROPS", this.props);

    return store[canSaveName];
  }

  render() {
    const {
      store,
      canSaveName = "canSave",
      saveName = "Save",
      canRevertName = undefined,
      revertName = "Revert",
      saveTooltipName = "saveTooltip",
      isSavingName = "isSaving",
      revertContainerProps,
      revertButtProps,
      spacerProps,
      saveButtProps,

      saveObj
    } = this.props;

    // const canSave = store[canSaveName];
    const canSave = this.canSave;
    const Save = () => store[saveName](saveObj);
    const canRevert = canRevertName ? store[canRevertName] : canSave;
    const Revert = () => store[revertName](saveObj);
    const saveTooltip = store[saveTooltipName];
    const isSaving = store[isSavingName];

    const hotkeyHandler = () => {
      if (store[canSaveName]) Save();
      return true;
    };

    return (
      <>
        <Hokey save={hotkeyHandler} />

        <Col childCenterV {...revertContainerProps}>
          <Butt
            on={Revert}
            icon={MdRestore}
            iconSize={16}
            danger
            mini
            square
            w={26}
            h={26}
            disabled={!canRevert}
            tooltip={canRevert ? "Revert changes" : ""}
            {...revertButtProps}
          />
        </Col>

        <Col w={24} {...spacerProps} />

        <Butt
          on={Save}
          icon={MdSave}
          label={"Save"}
          secondary
          mini
          square
          h={60}
          w={140}
          disabled={!canSave}
          tooltip={saveTooltip}
          alertAfter={"Saved!"}
          loading={isSaving}
          {...saveButtProps}
        />
      </>
    );
  }
}
