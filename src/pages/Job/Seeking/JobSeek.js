import { observer } from "mobx-react";
import React from "react";
import { SimCard } from "../../../Bridge/misc/Card";
import { Col, Row, Txt } from "../../../Bridge/Bricks/bricksShaper";
import { HUE } from "../../../Bridge/HUE";
import { SeekTerpSelectionList } from "./SeekTerps";
import { SeekBids } from "./SeekBids";
import Timeline, { TimelineNotes } from "../JobUpdate/Timeline";
import {
  JobFollowUpButton,
  JobVriButton,
  JobWarningEdit
} from "../JobUpdate/JobDetails";
import { SeekActive } from "./SeekActive";
import { SeekFilters } from "./SeekFilters";
import { SeekOpenJobBoard, SeekRequestInterpreter } from "./SeekControls";
import { JobConfirmation } from "../JobUpdate/JobConfirmation";
import { JobRates, JobTravel } from "../JobUpdate/JobRates";
import { JobLinkedSummary } from "../JobLinked/JobLinkedSummary";
import { JobLocation } from "../JobUpdate/JobLocation";
import { SeekDesires } from "./SeekDesires";
import { JobVriLocation } from "../JobUpdate/JobVriLocation";
import { JobAssignedTerp } from "../JobUpdate/JobAssignedTerp";
import { JobCard } from "../JobUpdate/JobBasics";
import { SeekDeafSection } from "./SeekDeafCard";
import { JobUpdata } from "../../../datum/JobUpdata";
import { SeekSelected } from "./SeekSelected";
import { ChatCard } from "../ChatCard";

@observer
export class JobSeek extends React.Component<C_JobView> {
  render() {
    const jobRef: JobRef = this.props.jobRef;

    return (
      <>
        <Col grow maxThird>
          <Left jobRef={jobRef} />
        </Col>

        <Col grow maxThird>
          <Middle jobRef={jobRef} />
        </Col>

        <Col grow maxThird>
          <Right jobRef={jobRef} />
        </Col>
      </>
    );
  }
}

// <Defer wait={10}>

@observer
class Left extends React.Component<C_JobView> {
  render() {
    const jobRef: JobRef = this.props.jobRef;

    return (
      <>
        <SeekFilters jobRef={jobRef} />

        <SeekTerpSelectionList jobRef={jobRef} listHeight={700} />

        <JobVriLocation
          // tabi={20}
          jobRef={jobRef}
        />

        <JobLocation
          // tabi={10}
          jobRef={jobRef}
        />
      </>
    );
  }
}

@observer
class Middle extends React.Component<C_JobView> {
  render() {
    const jobRef: JobRef = this.props.jobRef;

    return (
      <>
        {jobRef.hasTerp && (
          <JobConfirmation
            // tabi={20}
            jobRef={jobRef}
          />
        )}

        <JobAssignedTerp jobRef={jobRef} />

        <SeekDesires jobRef={jobRef} />

        <JobTravel
          // tabi={30}
          jobRef={jobRef}
        />

        <SeekDeafSection jobRef={jobRef} />

        <SeekBids jobRef={jobRef} />

        <JobCard>
          <SeekSelected jobRef={jobRef} listMaxHeight={700} />
        </JobCard>

        <SeekActive jobRef={jobRef} listMaxHeight={700} />

        <JobRates
          // tabi={40}
          jobRef={jobRef}
        />
      </>
    );
  }
}

@observer
class Right extends React.Component<C_JobView> {
  render() {
    const jobRef: JobRef = this.props.jobRef;

    return (
      <>
        <Row marL={12}>
          <JobVriButton jobRef={jobRef} />
          <Col grow />
          <JobFollowUpButton jobRef={jobRef} />
        </Row>

        <JobWarningEdit jobRef={jobRef} />

        <TimelineNotes jobRef={jobRef} maxHeight={130} />

        <SeekJobSituation jobRef={jobRef} />
        <SeekWarning jobRef={jobRef} />
        <SeekOpenJobBoard jobRef={jobRef} />
        <SeekRequestInterpreter jobRef={jobRef} />

        <ChatCard jobRef={jobRef} />
        <JobLinkedSummary jobRef={jobRef} />
        <Timeline jobRef={jobRef} />
      </>
    );
  }
}

@observer
class SeekJobSituation extends React.Component<C_JobView> {
  render() {
    const jobRef: JobRef = this.props.jobRef;
    const jobUp: JobUpdata = jobRef.jobUp;

    const situation = jobUp.situation.value;

    return (
      <SimCard header="Job Situation">
        <Row>
          {/* <Butt
						on={() => seekUp.openDescription.Change(situation)}
						icon={FaSortAmountDown}
						subtle
						mini
						primary
						tooltip={'Copy to open description'}
					/> */}

          <Col marL={4} grow shrink maxWidth={0}>
            <Txt break>{situation}</Txt>
          </Col>
        </Row>
      </SimCard>
    );
  }
}

@observer
class SeekWarning extends React.Component {
  render() {
    const jobRef: JobRef = this.props.jobRef;
    const warning = jobRef.seekWarning;

    if (!warning) return <></>;

    return (
      <Col hue={HUE.labelLightRed} padV={8} padH={8}>
        <Txt b size={18}>
          {warning}
        </Txt>
      </Col>
    );
  }
}
