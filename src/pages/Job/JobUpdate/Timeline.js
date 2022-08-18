import React from "react";
import { observer } from "mobx-react";
import { Jewels, Root, Staches } from "stores/RootStore";
import { Col, Row, Txt } from "../../../Bridge/Bricks/bricksShaper";
import {
  MdAccessibility,
  MdAssignment,
  MdChangeHistory,
  MdFavoriteBorder,
  MdHelp,
  MdNote,
  MdRefresh,
  MdSchedule,
  MdWarning
} from "react-icons/md";
import { Tip } from "../../../Bridge/misc/Tooltip";
import { action, computed, observable, runInAction } from "mobx";
import Formula from "../../../Bridge/Bricks/Formula/Formula";
import Fieldula from "../../../Bridge/Bricks/Formula/Fieldula";
import MiniField from "../../../components/MiniField";
import { StaffAvatar } from "../../../components/Avatar";
import Griddle_DEPRECATED from "../../../Bridge/Griddle/Griddle_DEPRECATED";
import thyme from "../../../Bridge/thyme";
import IconToggle from "../../../Bridge/Bricks/IconToggle";
import { FaHeartbeat, FaPager } from "react-icons/fa";
import { GiTrade, GiWoodenSign } from "react-icons/gi";
import { Ico } from "../../../Bridge/Bricks/Ico";
import type { C_JobView } from "./JobBasics";
import { JOB_STATUS_ID_LABEL, JobCard } from "./JobBasics";
import type {
  C_HistoryRow,
  HistoryDatum_Note,
  HistoryDatum_Seek,
  HistorySeekType
} from "../../../datum/stache/JobHistoryDat";
import { HistoryRow, JobHistoryDat } from "../../../datum/stache/JobHistoryDat";
import { TerpDat } from "../../../datum/stache/TerpDat";
import { Clip } from "../../../Bridge/misc/Clip";
import type { BillTypeId } from "../../../datum/stache/BillTypeDat";
import Butt from "../../../Bridge/Bricks/Butt";
import { StaffDat } from "../../../datum/stache/StaffDat";

// TODO
// TODO: rewrite job history/timeline components
// TODO

@observer
export default class Timeline extends React.Component<C_JobView> {
  @observable filter = {
    change: true,
    note: false,
    seek: true
  };

  @action ToggleFilter = (key) => (this.filter[key] = !this.filter[key]);

  render() {
    const jobRef: JobRef = this.props.jobRef;

    return (
      <JobCard>
        <Row h={12} />

        <Row marB={12} childH>
          <Col grow>
            <FilterBar filter={this.filter} onToggle={this.ToggleFilter} />
          </Col>

          <Txt size={12} b marR={4}>
            v{jobRef.history.version}
          </Txt>

          <Butt
            on={() => Jewels().account.DebugInvalidateJob(jobRef.jobId)}
            mini
            subtle
            icon={MdRefresh}
            iconSize={10}
            h={12}
          />
        </Row>

        <Col h={400} scrollV>
          <HistoryRowGroup filter={this.filter} jobRef={jobRef} />
        </Col>
      </JobCard>
    );
  }
}

@observer
export class TimelineNotes extends React.Component<C_JobView> {
  render() {
    const jobRef: JobRef = this.props.jobRef;
    const historyDat: JobHistoryDat = jobRef.history;

    return (
      <JobCard>
        <Row h={12} />

        <AddNote jobRef={jobRef} />

        <Col maxHeight={this.props.maxHeight || 260} scrollV>
          <Griddle_DEPRECATED
            rows={historyDat.noteOrWarningRows}
            columns={TIMELINE_COLUMNS}
            compact
          />
        </Col>
      </JobCard>
    );
  }
}

@observer
class FilterBar extends React.Component {
  render() {
    const { filter, onToggle } = this.props;

    return (
      <Row childCenterH>
        <IconToggle
          on={() => onToggle("change")}
          toggled={filter.change}
          icon={MdChangeHistory}
          hueOn={"#314b39"}
          marR={12}
          tooltip={"Show changes"}
        />

        <IconToggle
          on={() => onToggle("note")}
          toggled={filter.note}
          icon={MdNote}
          hueOn={"#314b39"}
          marR={12}
          tooltip={"Show notes"}
        />

        <IconToggle
          on={() => onToggle("seek")}
          toggled={filter.seek}
          icon={MdAccessibility}
          hueOn={"#314b39"}
          marR={12}
          tooltip={"Show seeking history"}
        />
      </Row>
    );
  }
}

@observer
class HistoryRowGroup extends React.Component<C_JobView> {
  @computed get rows(): HistoryRow[] {
    const jobRef: JobRef = this.props.jobRef;
    const filter = this.props.filter;

    return jobRef.history.rows.filter((d) => filter[d.type]);
  }

  render() {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `auto auto auto auto`
          // overflow: 'auto',
        }}>
        {this.rows.map((row) => (
          <HistoryRowComps key={row.key} row={row} />
        ))}
      </div>
    );
  }
}

@observer
class HistoryRowComps extends React.Component<{ row: HistoryRow }> {
  render() {
    const row = this.props.row;

    return (
      <>
        <EntryIcon row={row} />
        <EntryDatum row={row} />
        <EntryBy row={row} />
        <EntryAt row={row} />
      </>
    );
  }
}

@observer
class EntryIcon extends React.Component<C_HistoryRow> {
  render() {
    const Icon = GetRowIcon(this.props.row);
    return (
      <Row fill childC padL={8}>
        <Icon size={16} color={"#919191"} />
      </Row>
    );
  }
}

@observer
class EntryDatum extends React.Component<C_HistoryRow> {
  render() {
    const row: HistoryRow = this.props.row;
    const DatumComponent = GetDatumComponent(row);

    return (
      <Col fill childCenterV padV={4} minWidth={0}>
        <DatumComponent row={row} />
      </Col>
    );
  }
}

@observer
class EntryBy extends React.Component<C_HistoryRow> {
  render() {
    const row: HistoryRow = this.props.row;
    const staff: StaffDat = row.staffClutch.dat;

    return (
      <Row fill childC padV={2}>
        {/*<StaffAvatar staff={row.staffDat}/>*/}
        <StaffAvatar staff={staff} />
      </Row>
    );
  }
}

@observer
class EntryAt extends React.Component<C_HistoryRow> {
  render() {
    const row: HistoryRow = this.props.row;
    const text = thyme.nice.dateTime.minimal(row.at);
    const tooltip = thyme.nice.dateTime.stamp(row.at);

    return (
      <Row fill childC padH={4}>
        <Tip text={tooltip}>
          <Txt size={12} hue={"#555555"}>
            {text}
          </Txt>
        </Tip>
      </Row>
    );
  }
}

@observer
class ChangeRow extends React.Component<C_HistoryRow> {
  render() {
    const root = Root();
    const datum = this.props.row.datum;
    const style = CHANGE_STYLES[datum.field] || CHANGE_STYLES.getDefault(datum);

    if (datum.source) {
    }

    return (
      <Row marL={8} marR={4} childCenterV wrap shrink>
        <Txt smallCaps size={14} marR={4} hue={"#555555"}>
          {style.label}:
        </Txt>
        <Txt grow shrink break maxFull>
          {typeof style.formatter === "function"
            ? style.formatter(datum.value, root)
            : `${datum.value}`}
        </Txt>

        {datum.source && (
          <Txt marL={4} size={12} hue={"#555555"}>
            ⬅{datum.source}
          </Txt>
        )}
      </Row>
    );
  }
}

@observer
class NoteRow extends React.Component {
  render() {
    const datum: HistoryDatum_Note = this.props.row.datum;
    return <Txt marL={8}>{datum.note}</Txt>;
  }
}

// TODO: clean this up

@observer
class SeekRow extends React.Component {
  @computed get terpDat(): TerpDat {
    const datum = this.props.row.datum;
    let terpId = 0;

    if (datum.terpId) {
      terpId = datum.terpId;
    } else if (datum.terpIds && datum.terpIds.length > 0) {
      terpId = datum.terpIds[0];
    }

    return Staches().cTerp.GetOrStub(terpId, true, "TimelineSeekRow").dat;
  }

  @computed get nameText() {
    const datum: HistoryDatum_Seek = this.props.row.datum;
    const seekType: HistorySeekType = datum.seekType;

    switch (seekType) {
      case "open":
        return datum.terpCount;

      case "requested":
        let requestedName = this.terpDat.label;
        if (datum.terpIds.length > 1)
          requestedName += `, +${datum.terpIds.length - 1}`;
        return requestedName;

      case "bid":
        return this.terpDat.label;

      case "decline":
        return this.terpDat.label;

      case "assign":
        return {
          terpName: this.terpDat.label,
          bidNote: `TODO seekerId: ${datum.seekerId}`
        };

      case "unassign":
        return this.terpDat.label;

      case "legacy":
        return datum.terpCount;

      case "forceAssign":
        return {
          terpName: this.terpDat.label
        };

      case "removed":
        return datum.count;

      case "rejected":
        return this.terpDat.label;
    }

    return "?";
  }

  render() {
    const datum: HistoryDatum_Seek = this.props.row.datum;

    const marL = 8;

    switch (datum.seekType) {
      case "open":
        return (
          <Row marL={marL}>
            <Txt>Open to {this.nameText} terps</Txt>
            {datum.description && (
              <Clip copy={datum.description}>
                <Ico
                  icon={MdNote}
                  hue={"#696969"}
                  tooltip={datum.description}
                  marL={4}
                />
              </Clip>
            )}
          </Row>
        );
      // return (
      // 	<Txt marL={marL}>Open to {this.nameText} terps</Txt>
      // );

      case "requested":
        return (
          <Row marL={marL}>
            <Txt marR={4}>Requested</Txt>
            <Txt hue={"#281e7b"} b>
              {this.nameText}
            </Txt>
            {datum.description && (
              <Clip copy={datum.description}>
                <Ico
                  icon={MdNote}
                  hue={"#696969"}
                  tooltip={datum.description}
                  marL={4}
                />
              </Clip>
            )}
          </Row>
        );

      case "bid":
        return (
          <Row marL={marL}>
            <Txt marR={6}>Bid by {this.nameText}</Txt>
            {datum.bidNote ? (
              <Tip text={datum.bidNote}>
                <MdNote color={"#696969"} />
              </Tip>
            ) : (
              <Txt marL={4}>no note</Txt>
            )}
          </Row>
        );

      case "decline":
        return (
          <Row marL={marL}>
            <Txt marR={6}>Declined by {this.nameText}</Txt>
          </Row>
        );

      case "assign":
        return (
          <Row marL={marL}>
            <Txt marR={4}>Assigned</Txt>
            <Txt marR={6} hue={"#2e6938"} b>
              {this.nameText.terpName}
            </Txt>
            {this.nameText.bidNote ? (
              <Tip text={this.nameText.bidNote}>
                <MdNote color={"#696969"} />
              </Tip>
            ) : (
              <Col />
            )}

            {datum.source && (
              <Txt marL={4} size={12} hue={"#555555"}>
                ⬅{datum.source}
              </Txt>
            )}
          </Row>
        );

      case "unassign":
        return (
          <Row marL={marL}>
            <Txt marR={4}>Unassigned</Txt>
            <Txt hue={"#732426"} b>
              {this.nameText}
            </Txt>

            {datum.source && (
              <Txt marL={4} size={12} hue={"#555555"}>
                ⬅{datum.source}
              </Txt>
            )}
          </Row>
        );

      case "legacy":
        return <Txt marL={marL}>Legacy paged to {this.nameText} terps</Txt>;

      case "forceAssign":
        return (
          <Row marL={marL}>
            <Txt marR={4}>Assigned (no seek)</Txt>
            <Txt marR={6} hue={"#2e6938"} b>
              {this.nameText.terpName}
            </Txt>

            {datum.source && (
              <Txt marL={4} size={12} hue={"#555555"}>
                ⬅{datum.source}
              </Txt>
            )}
          </Row>
        );

      case "removed":
        return <Txt marL={marL}>Removed {this.nameText} seekers</Txt>;

      case "rejected":
        return <Txt marL={marL}>Rejected {this.nameText}</Txt>;
    }
    return <Txt>unknown seek</Txt>;
  }
}

function GetRowIcon(row) {
  switch (row.type) {
    case "change":
      return CHANGE_STYLES.hasOwnProperty(row.datum.field)
        ? CHANGE_STYLES[row.datum.field].icon || MdChangeHistory
        : MdChangeHistory;
    case "note":
      return MdNote;
    case "seek":
      return SEEK_ICONS[row.datum.seekType] || MdAccessibility;
  }
}

const CHANGE_STYLES = {
  default: {
    icon: MdChangeHistory,
    label: "???"
  },

  getDefault: (datum) => ({
    icon: MdHelp,
    label: datum.field
  }),

  status: {
    icon: FaHeartbeat,
    label: "Status",
    formatter: (val) => JOB_STATUS_ID_LABEL[val]
  },
  start: {
    icon: MdSchedule,
    label: "Start",
    formatter: THYME_FORMATTER
  },
  end: {
    icon: MdSchedule,
    label: "End",
    formatter: THYME_FORMATTER
  },
  situation: {
    icon: MdAssignment,
    label: "Situation"
  },
  specialNotes: {
    label: "Special Notes"
  },
  hourMin: {
    label: "Hour Min"
  },
  vri: {
    label: "VRI",
    formatter: (val) => (val ? "yes" : "no")
  },
  vriLink: {
    label: "VRI Link"
  },
  vriPassword: {
    label: "VRI Pw"
  },
  vriOther: {
    label: "VRI Misc"
  },
  rate: {
    label: "Rate"
  },
  cap: {
    label: "Cap"
  },
  flatRate: {
    label: "Flat Rate"
  },
  overrideRate: {
    label: "Override Rate"
  },
  terpTravel: {
    label: "Terp Travel"
  },
  terpTravelRate: {
    label: "Terp Travel Rate"
  },
  companyTravel: {
    label: "Company Travel"
  },
  companyTravelRate: {
    label: "Company Travel Rate"
  },
  billTypeId: {
    label: "Bill Type",
    formatter: (val: BillTypeId) => {
      const entry = Staches().cBillType.GetEnumClutch(val).dat.entryById[val];
      return entry ? entry.label : `?${val}?`;
    }
  },
  locationId: {
    label: "Location ID"
  },
  companyId: {
    label: "Company ID"
  },
  contactId: {
    label: "Contact ID"
  },
  deafIds: {
    label: "Deaf IDs"
  },
  created: {
    label: "Created"
  },
  createdBy: {
    label: "Created By"
  },
  confirmationInfo: {
    label: "Confirmation Info"
  },
  companyConfirmed: {
    label: "Company confirmation"
  },
  terpConfirmed: {
    label: "Terp confirmation"
  },
  contactUponArrival: {
    label: "Contact Upon Arrival"
  },
  requestedBy: {
    label: "Requested By"
  },
  receivedFrom: {
    label: "Received From"
  },
  followUp: {
    label: "Follow Up"
  },
  isCancelled: {
    label: "Is Cancelled"
  },
  p2pDispatch: {
    icon: MdSchedule,
    label: "P2P Dispatch",
    formatter: THYME_FORMATTER
  },
  p2pHome: {
    icon: MdSchedule,
    label: "P2P Home",
    formatter: THYME_FORMATTER
  },
  warning: {
    icon: MdWarning,
    label: "Warning",
    formatter: (val) => (val ? val : `[removed]`)
  },
  wantedTerps: {
    label: "Wanted Terps"
  }
};

function THYME_FORMATTER(val) {
  return val ? thyme.nice.dateTime.short(thyme.fromIso(val)) : "null";
}

const SEEK_ICONS = {
  open: GiWoodenSign, // GiTrumpet,
  requested: MdFavoriteBorder,
  bid: GiTrade,
  assign: MdAccessibility,
  legacy: FaPager
};

function GetDatumComponent(row) {
  switch (row.type) {
    case "change":
      return ChangeRow;
    case "note":
      return NoteRow;
    case "seek":
      return SeekRow;
  }
  throw new Error(`unknown datum type: ${row.type}`);
}

@observer
class AddNote extends React.Component<C_JobView> {
  @observable form = new Formula({
    fields: {
      note: new Fieldula({
        placeholder: "Add Note",
        afterChange: (val) => {
          Jewels().jobs.SetIsWritingNote(!!val);
        }
      })
    }
  });

  @observable isWaiting = false;

  @action Add = async () => {
    const noteField = this.form.fields.note;

    this.isWaiting = true;

    await Jewels().vJobUpdate.AddNote(noteField.value);

    runInAction(() => {
      this.isWaiting = false;
      noteField.Clear();
    });
  };

  render() {
    // const isNewJob = this.props.job.jobId === 'new';
    const isNewJob = false; // TODO

    return (
      <Row h={80} padH={12}>
        <MiniField
          $={this.form.fields.note}
          onEnterKey={this.Add}
          showAsMultiline
          disabled={this.isWaiting || isNewJob}
          placeholder={isNewJob ? "Please Save Job First" : undefined}
          grow
        />
      </Row>
    );
  }
}

const TIMELINE_COLUMNS = [
  {
    accessor: "type",
    cell: EntryIcon
  },
  {
    accessor: "datum",
    cell: EntryDatum,
    w: "1fr"
  },
  {
    accessor: "by",
    cell: EntryBy
  },
  {
    accessor: "at",
    cell: EntryAt
  }
];

/*
	Seeker history
		Requests sent
		Open board events
		Responses
	Staff notes
		Notes to one another concerning this job
	Changelog
		Edits to date, time, deaf, terp, status, location, company, etc.


	TYPES
		seeker
		notes
		changelog


 */
