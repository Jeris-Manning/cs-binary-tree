import React, { useState } from "react";
import { Col, Img, Row, Txt } from "../../Bridge/Bricks/bricksShaper";
import { observer } from "mobx-react";
import { Jewels, Router, Staches } from "stores/RootStore";
import { SimCard, SimCardEdit } from "../../Bridge/misc/Card";
import { action, computed } from "mobx";
import Loading from "../../Bridge/misc/Loading";
import { HUE } from "../../Bridge/HUE";
import { TerpCredentials } from "./TerpCredentials";
import Butt from "../../Bridge/Bricks/Butt";
import { MdChat, MdDateRange, MdHistory, MdPageview } from "react-icons/md";
import IconToggle from "../../Bridge/Bricks/IconToggle";
import ScheduleOverview from "./ScheduleOverview";
import ToggleBox from "../../Bridge/Bricks/ToggleBox";
import ButtLink from "../../components/ButtLink";
import { GiMimicChest } from "react-icons/gi";
import $j from "../../Bridge/misc/$j";
import { PageTitleStandard } from "../../Bridge/misc/NavPage";
import { TerpAppStatus } from "./TerpAppStatus";
import IconLinker from "../../Bridge/Bricks/IconLinker";
import { UpField } from "../../Bridge/misc/UpField";
import ToggleButton from "../../components/ToggleButton";
import { JobTable } from "../../components/JobTable";
import { GetTagIcon } from "../Job/Seeking/SeekTerpTags";
import { Tip } from "../../Bridge/misc/Tooltip";
import { TerpEditor } from "./TerpEditor";
import { HiddenUntil } from "../../Bridge/misc/HiddenUntil";
import { SaveControls } from "../../components/SaveControls";
import { ClipTxt } from "../../Bridge/misc/Clip";
import { IoNewspaperOutline } from "react-icons/io5";
import { FindById } from "../Job/FinderPage";
import AddTerp from "../PageHooks/AddTerp";

@observer
class TerpDetails extends React.Component {
  render() {
    const vTerp = Jewels().vTerp;
    const oJobs = Jewels().jobs;
    const terpId = this.props.terpId;
    const updata = vTerp.updata;

    if (vTerp.terpLoader.isLoading || !vTerp.terpId || !updata)
      return <Loading />;

    return (
      <>
        {vTerp.error && (
          <Row mar={20}>
            <Txt hue={HUE.error} size={24}>
              Error: {vTerp.error}
            </Txt>
          </Row>
        )}

        <TerpHeader />

        <Row marT={8}>
          <Col w={250}>
            <PhotoCard terpId={terpId} />
            <Row childC>
              <ButtLink
                a={`https://portal.aslis.com/#/admin/${updata.email.value}`}
                // label={'Mimic'}
                icon={GiMimicChest}
                tooltip={"Mimic on Portal"}
                secondary
                marR={24}
              />

              <IconLinker
                to={"chat"}
                params={{ terpId: terpId }}
                icon={MdHistory}
                size={20}
                iconHue={"#7c7c7c"}
                tooltip={"View Chat History"}
                marR={24}
              />
              <Butt
                on={() => Jewels().vChat.OpenChat(terpId)}
                icon={MdChat}
                secondary
                w={50}
                // marH={40}
              />
            </Row>

            <TagCard />

            <RegionCard />

            <TerpAppStatus />
          </Col>

          <Col fit>
            <Row marT={12} marB={12} childC wrap>
              <a href={`tel:${updata.phone.value}`} target={"_blank"}>
                <Txt size={24}>{$j.format.phone(updata.phone.value)}</Txt>
              </a>

              <Col grow maxWidth={32} />

              <a href={`mailto:${updata.email.value}`} target="_blank">
                <Txt size={24}>{updata.email.value}</Txt>
              </a>
            </Row>

            <TerpEditor />
          </Col>

          <Col w={"25%"}>
            <SimCard>
              <UpField
                label={"Note"}
                state={updata.note}
                multiline
                minHeight={300}
                marT={8}
              />

              <UpField
                label={"Preferred Teammates"}
                state={updata.teammates}
                multiline
                minHeight={120}
                marT={16}
              />
            </SimCard>

            <HiddenUntil label={"Show SSN"}>
              <SimCard>
                <UpField label={"SSN"} state={updata.ssn} />
              </SimCard>
            </HiddenUntil>
          </Col>
        </Row>

        <JobTable
          getAllJobs={(params) =>
            oJobs.GetJobsBy({
              by: "terp",
              terpId: terpId,
              ...params
            })
          }
        />

        <SimCard header={"Schedule"} foldable={"hidden"}>
          <ScheduleOverview
            schedule={vTerp.schedule}
            notes={vTerp.scheduleNotes}
          />
        </SimCard>

        <TerpCredentials />
      </>
    );
  }
}

@observer
class TerpHeader extends React.Component {
  render() {
    const vTerp = Jewels().vTerp;
    const updata = vTerp.updata;

    const fullName = `${updata.firstName.value} ${updata.lastName.value}`;

    return (
      <>
        <PageTitleStandard name={fullName} id={updata.terpId.value} />

        <Row childV>
          <ClipTxt id copy={updata.terpId.value} />

          <Col w={24} />

          <ClipTxt title copy={fullName} />

          <Col grow />
          <Col grow />

          <ToggleButton
            primary
            label={"Active"}
            isChecked={updata.active.value}
            on={updata.active.Toggle}
            subtle
          />

          <Col grow />

          <ToggleButton
            primary
            label={"Temp"}
            isChecked={updata.temp.value}
            on={updata.temp.Toggle}
            subtle
          />

          <Col grow />

          <ToggleButton
            primary
            label={"Fake"}
            isChecked={updata.isFake.value}
            on={updata.isFake.Toggle}
            tooltip={"Mark this as a test account (not a real terp)"}
            subtle
          />

          <Col grow />

          <SaveControls store={vTerp} />
        </Row>
      </>
    );
  }
}

@observer
class PhotoCard extends React.Component {
  @action VerifyCred = async () => {
    const vTerp = Jewels().vTerp;
    const oCreds = Jewels().credentials;

    await oCreds.VerifyCred({
      terpId: vTerp.terpId,
      terpCredId: vTerp.photo.terpCredId
    });

    return vTerp.Load(vTerp.terpId);
  };

  @action RemoveCred = async () => {
    const vTerp = Jewels().vTerp;
    const oCreds = Jewels().credentials;

    await oCreds.RemoveCred({
      terpId: vTerp.terpId,
      terpCredId: vTerp.photo.terpCredId
    });

    return vTerp.Load(vTerp.terpId);
  };

  render() {
    const oCreds = Jewels().credentials;

    const cred = oCreds.photoCred;
    const terpCred = oCreds.photoTerpCred;
    const photoUrl = terpCred ? terpCred.fileLocation : "";
    const verified = terpCred && terpCred.verified;

    const hasPhoto = photoUrl && !oCreds.isLoading;

    return (
      <Col>
        {hasPhoto && (
          <>
            <Img
              w={250}
              h={250}
              src={photoUrl}
              shadowPage
              marB={12}
              onClick={() => oCreds.Review(cred, terpCred)}
            />

            <Row childCenterH>
              {!verified && (
                <Butt
                  on={() => oCreds.Review(cred, terpCred)}
                  label={"Review"}
                  icon={MdPageview}
                  iconSize={"2rem"}
                  primary
                  marL={12}
                />
              )}
            </Row>
          </>
        )}

        {!hasPhoto && (
          <Col w={250} h={250} hue={"#909090"} childC fill>
            <Txt hue={"#464646"}>No photo</Txt>
          </Col>
        )}
      </Col>
    );
  }
}

@observer
export class TagCard extends React.Component {
  @computed get allTags() {
    const dat = Staches().cTerpTag.GetEnumClutch().dat;
    return dat.entries;
  }

  render() {
    const vTerp = Jewels().vTerp;
    const currentTags = vTerp.updata.tags;

    if (!currentTags) return <Loading />;

    const contentEdit = this.allTags.map((tag) => (
      <IconToggle
        key={tag.key}
        on={(toggleTo) => currentTags.AddOrRemove(toggleTo, tag.tagId)}
        toggled={currentTags.value.includes(tag.tagId)}
        icon={GetTagIcon(tag.tagId)}
        tooltip={tag.description}
        marR={12}
        marB={12}
      />
    ));

    let contentView = this.allTags
      .filter((tag) => currentTags.value.includes(tag.tagId))
      .map((tag) => (
        <IconToggle
          key={tag.key}
          toggled={true}
          icon={GetTagIcon(tag.tagId)}
          marR={12}
          marB={12}
          tooltip={tag.description}
        />
      ));

    return (
      <SimCardEdit
        addRowWrap
        blankText={"no tags"}
        contentEdit={contentEdit}
        contentView={contentView}
        editTooltip={"Change Tags"}
      />
    );
  }
}

@observer
export class RegionCard extends React.Component {
  @computed get allRegions() {
    const dat = Staches().cRegion.GetEnumClutch().dat;
    return dat.entries;
  }

  render() {
    const vTerp = Jewels().vTerp;
    const currentRegions = vTerp.updata.regions;

    if (!currentRegions) return <Loading />;

    const contentEdit = this.allRegions.map((region) => (
      <Tip text={region.description}>
        <ToggleBox
          key={region.regionId}
          id={region.regionId}
          on={(toggleTo) =>
            currentRegions.AddOrRemove(toggleTo, region.regionId)
          }
          toggled={currentRegions.value.includes(region.regionId)}
          label={region.region}
          marR={12}
        />
      </Tip>
    ));

    const contentView = this.allRegions
      .filter((region) => currentRegions.value.includes(region.regionId))
      .map((r) => r.region)
      .join(", ");

    return (
      <SimCardEdit
        addRowWrap
        blankText={"no regions"}
        contentEdit={contentEdit}
        contentView={contentView}
        editTooltip={"Change Regions"}
      />
    );
  }
}

@observer
class Overview extends React.Component {
  render() {
    const oAccount = Jewels().account;
    const oTerp = Jewels().oTerp;

    return (
      <>
        <Col w={300} childH>
          <ButtLink
            route={Router().routes.terpScheds}
            label={"Terp Schedules"}
            icon={MdDateRange}
            primary
          />

          <Row h={16} />

          <ButtLink
            route={Router().routes.appNews}
            label={"App News"}
            icon={IoNewspaperOutline}
            secondary
          />

          <Row h={16} />

          <FindById
            header={"Interpreter ID"}
            on={Jewels().oTerp.NavToTerp}
            focus
          />

          <SimCard header={"Cache Invalidate Terp"}>
            <UpField
              state={oAccount.upDatKey}
              placeholder={"Interpreter ID"}
              w={300}
              marB={16}
            />

            <Butt
              on={async () => {
                await oAccount.DebugInvalidateTerp(oAccount.upDatKey.value);
                oAccount.upDatKey.Revert();
              }}
              label={"Invalidate"}
              tooltip={`When an interpreter profile has been created on RTG, put the terp ID here and press this button.`}
              danger
              mini
            />
          </SimCard>

          <AddTerp oTerp={oTerp} />
        </Col>
      </>
    );
  }
}

/**
 * TERP page
 *
 *  /terp/:terpId
 *
 */
@observer
export class TerpPage extends React.Component {
  render() {
    const params = Router().params;

    if (params.terpId === "overview") return <Overview />;

    return (
      <>
        <TerpDetails {...params} />
      </>
    );
  }
}
