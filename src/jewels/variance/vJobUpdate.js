import { action, autorun, computed, observable, runInAction } from "mobx";
import { Jewels, Router } from "stores/RootStore";
import type { JobChanges } from "../../pages/Job/JobUpdate/JobBasics";
import { JobRef } from "../../pages/Job/JobUpdate/JobRef";
import { BillTypeEntry } from "../../datum/stache/BillTypeDat";
import type { IdKey } from "../../Bridge/misc/UpType";
import type { DeafKey } from "../../datum/stache/DeafDat";
import type { WatcherTargetKey } from "../../datum/stache/WatcherDat";
import type { JobId, JobKey } from "../../datum/stache/JobDat";
import { BaseJewel } from "../BaseJewel";
import { JobUpdata } from "../../datum/JobUpdata";
import { vow } from "../../Bridge/misc/$j";
import { T_JobUp_Params } from "../oJobEdit";

export class vJobUpdate extends BaseJewel {
  ToLog = (msg) => `vJobUpdate |  ${msg}`;

  // _GetJobOrError = (jobId) => Jewels().oJobEdit.GetJobOrError(jobId);
  _UpdateJob = (params: T_JobUp_Params) => Jewels().oJobEdit.UpdateJob(params);
  _AddNote = (jobId: JobId, note: string) =>
    Jewels().oJobEdit.AddNote(jobId, note);
  _CreateJob = (params: T_JobUp_Params) => Jewels().oJobEdit.CreateJob(params);

  // TODO: would be nice if these weren't global, but currently needed by Watcher/etc.
  @observable jobId: IdKey;
  @observable jobKey: JobKey;
  @observable watcherInfo;
  @observable jobRef: JobRef;
  @observable showCalendar: boolean = false;
  @observable isOnPage: boolean = false;

  @action PageEnter = (params) => {
    console.log(this.ToLog(`PageEnter`), params);

    this.isOnPage = true;
    this.watcherInfo = {
      jobId: params.jobId,
      tab: params.tab
    };
    return this.LoadJob(String(params.jobId));
  };

  @action PageParamsChange = (params) => {
    console.log(this.ToLog(`PageParamsChange`), params);
    if (!this.jobRef) return this.PageEnter(params);
    if (this.jobRef.jobId !== params.jobId) return this.PageEnter(params);
    this.watcherInfo = {
      jobId: params.jobId,
      tab: params.tab
    };
  };

  @action PageExit = (params) => {
    console.log(this.ToLog(`PageExit`), params);
    this.jobRef = null;
    this.isOnPage = false;
    this.watcherInfo = {
      jobId: null,
      tab: null
    };
  };

  @action LoadJob = async (jobKey: JobKey) => {
    console.log(this.ToLog(`LoadJob: ${jobKey}`));
    if (jobKey === "new") jobKey = "";

    this.jobRef = new JobRef(jobKey);
  };

  @action SelectTab = (tabKey) => {
    const router = Router();

    return router.Navigate(router.routes.job, {
      jobId: router.params.jobId,
      tab: tabKey
    });
  };

  @action NavShiftJobId = (shift) => {
    const router = Router();

    const current = parseInt(router.params.jobId);
    if (!current) return;

    return router.Navigate(router.routes.job, {
      jobId: current + shift,
      tab: router.params.tab
    });
  };

  @observable isWritingNote: boolean = false;
  @action SetIsWritingNote = (val) => (this.isWritingNote = val);

  @action AddNote = async (note: string) => {
    await this._AddNote(this.jobRef.jobId, note);
    this.SetIsWritingNote(false);
  };

  @computed get navigationWarning() {
    if (!this.isOnPage) return "";
    if (this.canSave)
      return `Are you sure you want to leave? You have unsaved changes!`;
    if (this.isWritingNote)
      `Are you sure you want to leave? You have a note being written!`;
    return "";
  }

  // TODO: decouple these (when jobRef can be removed from vJobUpdate)

  @computed get canSave() {
    const jobRef: JobRef = this.jobRef;

    const jobUp = jobRef.jobUp;

    if (jobRef.errorsAll.length) return false;
    console.log("THE JOB REF OF SAVING: ", jobUp.hasChanged);
    return jobUp.hasChanged;
  }

  @computed get canRevert() {
    const jobRef: JobRef = this.jobRef;
    const jobUp = jobRef.jobUp;
    return jobUp.hasChanged;
  }

  @computed get saveTooltip() {
    const jobRef: JobRef = this.jobRef;
    const jobUp = jobRef.jobUp;
    console.log("CAN I SAVE????", this.canSave);
    if (this.canSave) {
      return ["Save (Ctrl+S)", "", ...jobUp.keysWithChanges];
    }

    if (jobRef.errorsAll.length) {
      return ["Errors:", "", ...jobRef.errorsAll];
    }

    return "No changes";
  }

  @action SaveJob = async (jobRef: JobRef) => {
    jobRef = this.jobRef; // TODO: fix (weirdness with save button hotkey)

    if (jobRef.isNew) {
      return this.CreateJob(jobRef);
    }

    jobRef.saveError = "";
    const jobUp: JobUpdata = jobRef.jobUp;
    const changes = jobUp.GetChanges();

    console.log(`vJobUpdate.SaveJob ${jobRef.jobId}, changes:`, changes);

    const clearAllSeekers =
      changes.billType !== undefined && jobRef.billTypeEntry.cancelled;

    const [_, saveError] = await vow(
      this._UpdateJob({
        jobId: jobRef.jobId,
        changes: changes
      })
    );

    if (saveError) {
      console.error(saveError);
      runInAction(() => {
        jobRef.saveError = String(saveError);
      });
      return;
    }

    if (clearAllSeekers) await Jewels().vJobSeek.RemoveAllSeekers(jobRef);
  };

  @action RevertJob = async (jobRef: JobRef) => {
    jobRef.jobUp.Revert();
  };

  @action CreateJob = async (jobRef: JobRef) => {
    jobRef.saveError = "";

    const jobUp: JobUpdata = jobRef.jobUp;
    const changes = jobUp.GetChanges();

    const [newJobId, saveError] = await vow(
      this._CreateJob({
        changes: changes
      })
    );

    if (saveError) {
      console.error(saveError);
      runInAction(() => {
        jobRef.saveError = String(saveError);
      });
      return;
    }

    jobRef.jobUp.Revert();

    return Router().Navigate("job", {
      jobId: newJobId,
      tab: "details"
    });
  };

  @action ToggleShowCalendar = () => (this.showCalendar = !this.showCalendar);

  /*  these suck \/\/\/    */

  @action ChangeBillType = (jobRef: JobRef, billType: BillTypeEntry) => {
    console.log(this.ToLog(`bll type:`), billType);
    const jobUp = jobRef.jobUp;

    jobUp.billType.Change(billType.label);
    jobUp.vri.Change(billType.vri);
    jobUp.isCancelled.Change(billType.cancelled);
    this.CalculateAndSetCap(jobRef);
  };

  @action CalculateAndSetCap = (jobRef: JobRef) => {
    const jobUp = jobRef.jobUp;

    if (!jobRef.hasCompany) return;

    // TODO: what if company isn't loaded yet?
    const cap = jobRef.isVri ? jobRef.company.capVri : jobRef.company.cap;

    if (!cap) return; // I guess

    jobUp.cap.Change(String(cap));
  };

  @action AddDeafKey = (jobRef: JobRef, deafKey: DeafKey) => {
    if (jobRef.deafs.some((deafClutch) => deafClutch.key === deafKey)) {
      return; // already have
    }

    jobRef.jobUp.deafIds.Add(deafKey);
  };

  @action RemoveDeafKey = (jobRef: JobRef, deafKey: DeafKey) => {
    jobRef.jobUp.deafIds.Remove(deafKey);
  };

  /* WATCHER updates */

  @observable watcherTarget: WatcherTargetKey;
  @observable watcherStatus: string;

  runWatcher = autorun(() => {
    const jobRef = this.jobRef;

    if (!jobRef) {
      this.UpdateWatcher(null, null);
      return;
    }

    const jobId = this.watcherInfo.jobId;
    const targetKey = `job_${jobId}`;
    let status = this.watcherInfo.tab;

    const isEditing = jobRef.jobUp.hasChanged;
    if (isEditing) status += "_editing";

    // const isSeeking = this.jobRef.seekUp.hasChanged;
    // if (isSeeking) status += '_seeking';

    this.UpdateWatcher(targetKey, status);
  });

  @action UpdateWatcher = (targetKey: WatcherTargetKey, status: string) => {
    console.log(`vJobUpdate.UpdateWatcher (${targetKey}, ${status})`);
    const oWatcher = Jewels().oWatcher;

    const sameTarget = targetKey === this.watcherTarget;
    const sameStatus = status === this.watcherStatus;

    if (sameTarget && sameStatus) return; // no change

    if (sameTarget) {
      // same target, only status changed
      this.watcherStatus = status;
      oWatcher.SetWatcherStatus(targetKey, status);
      return;
    }

    // target has changed

    if (this.watcherTarget) {
      oWatcher.RemoveWatcher(this.watcherTarget);
    }

    if (targetKey) {
      oWatcher.SetWatcherStatus(targetKey, status);
    }

    this.watcherTarget = targetKey;
    this.watcherStatus = status;
  };
}
