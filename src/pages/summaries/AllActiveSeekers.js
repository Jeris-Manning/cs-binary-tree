import { observer } from "mobx-react";
import { Jewels } from "stores/RootStore";
import React from "react";
import { action, observable, runInAction } from "mobx";
import { SimCard } from "../../Bridge/misc/Card";
import Butt from "../../Bridge/Bricks/Butt";
import Griddle_DEPRECATED from "../../Bridge/Griddle/Griddle_DEPRECATED";
import { MdDelete, MdRefresh } from "react-icons/md";
import Cell_JobLink_DEP from "../../Bridge/Griddle/Cells/Cell_JobLink_DEP";
import Cell_TimeStampDate from "../../Bridge/Griddle/Cells/Cell_TimeStamp";
import $j from "../../Bridge/misc/$j";
import Cell_Time from "../../Bridge/Griddle/Cells/Cell_Time";
import Cell_Button from "../../Bridge/Griddle/Cells/Cell_Button";
import thyme from "../../Bridge/thyme";

@observer
export class AllActiveSeekers extends React.Component {
  @observable rows = [];

  @action Load = async () => {
    const oSeek = Jewels().seek;

    const result = await oSeek.gems.getAllJobsWithActiveSeekers.Request();

    const thymes = ["start"];
    Object.values(result).forEach((job) => {
      thyme.mutate.fromEpoch(job, thymes);
    });

    runInAction(() => {
      this.rows = Object.values(result)
        .slice()
        .map((row) => {
          row.OnRemoveAll = (job) => this.RemoveAllForJob(job.jobId);
          return row;
        })
        .sort($j.sort.default("sentAt"))
        .reverse();
    });
  };

  @action RemoveAllForJob = async (jobId) => {
    throw new Error(`Remind Trenton to fix this (sorry)`);
    // console.log(`removing all seekers for job ${jobId}`);
    // const oSeek = Jewels().seek;
    // await oSeek.gems.removeSeekersForJob.Post({jobId: jobId}); // messy af
    // return this.Load();
  };

  render() {
    const oSeek = Jewels().seek;

    return (
      <>
        <SimCard padH={12}>
          <Butt on={this.Load} icon={MdRefresh} primary marB={12} />

          <Griddle_DEPRECATED columns={columns} rows={this.rows} />
        </SimCard>
      </>
    );
  }
}

const columns = [
  {
    header: "Job ID",
    accessor: "jobId",
    cell: Cell_JobLink_DEP,
    tab: "seek"
  },
  {
    header: "Start",
    accessor: "start",
    cell: Cell_Time
  },
  {
    header: "Open",
    accessor: "openCount"
  },
  {
    header: "Requests",
    accessor: "requestCount"
  },
  {
    header: "Bids",
    accessor: "bidCount"
  },
  {
    header: "Last Seeker Sent At",
    accessor: "sentAt",
    cell: Cell_TimeStampDate
  },
  {
    header: "Status",
    accessor: "status"
  },
  {
    header: "Remove All",
    accessor: "OnRemoveAll",
    cell: Cell_Button,
    cellProps: (row) => ({
      w: 100,
      icon: MdDelete,
      onPress: () => row.OnRemoveAll(row),
      tooltip: "Remove all active seekers for this job",
      buttProps: {
        danger: true,
        subtle: true
      }
    })
  }
];
