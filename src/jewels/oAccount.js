import { action, observable, runInAction, toJS } from "mobx";
import SmartGem_DEPRECATED from "../Bridge/jewelerClient/SmartGem_DEPRECATED";
import thyme from "../Bridge/thyme";
import GetGem_DEPRECATED from "../Bridge/jewelerClient/GetGem_DEPRECATED";
import { VERSION } from "../VERSION";
import { WiseGem } from "../Bridge/jewelerClient/WiseGem";
import { BaseJewel } from "./BaseJewel";
import { UpType } from "../Bridge/misc/UpType";
import { Staches } from "../stores/RootStore";
import $j, { vow } from "../Bridge/misc/$j";
import type { TerpId } from "../datum/stache/TerpDat";
import { TERP_LISTS } from "../datum/stache/TerpListDat";

export default class oAccount extends BaseJewel {
  gems = {
    getAccountDetails: new SmartGem_DEPRECATED({
      processors: [
        (account) => {
          account.loginAt = thyme.fromFastJson(account.loginAt) || thyme.epoch;
          account.resetAt = thyme.fromFastJson(account.resetAt) || thyme.epoch;
        }
      ]
    }),
    updateAccountDetails: new SmartGem_DEPRECATED(),
    resetPassword: new SmartGem_DEPRECATED(),
    createAccount: new SmartGem_DEPRECATED(),
    getStaffAccount: new WiseGem(),
    invalidateStache: new WiseGem("stacheKey"),
    getStacheTokens: new WiseGem()
  };

  // @observable account = {};
  //
  // @action LoadAccount = async (email) => {
  // 	const result =
  // 		await this.gems.getAccountDetails.Request({email: email});
  //
  // 	runInAction(() => {
  // 		this.account = result;
  // 	});
  // };

  @action GetAccountDetails = async (email) => {
    return this.gems.getAccountDetails.Get({ email: email });
  };

  @action UpdateAccountDetails = async (account) => {
    return this.gems.updateAccountDetails.Post({ account: toJS(account) });
  };

  @action ResetPassword = async (email) => {
    return this.gems.resetPassword.Post({ email: email });
  };

  @action CreateAccount = async (email) => {
    return this.gems.createAccount.Post({ email: email });
  };

  @action GetStaffAccount = async () => {
    return this.gems.getStaffAccount.Get({
      version: VERSION
    });
  };

  /* Stache Debugging */

  @observable upDatKey = UpType.String({ key: "upDatKey" });
  @observable serverStacheTokens = {};

  SendInvalidateStache = async (stacheKey, datKey = undefined) => {
    datKey = datKey || this.upDatKey.value;

    if (datKey) {
      const keys = datKey.match(/\d+/g);
      return this.InvalidateListOfKeys(stacheKey, keys);
    }

    return this.gems.invalidateStache.Post({
      stacheKey: stacheKey,
      datKey: datKey || this.upDatKey.value
    });
  };

  InvalidateListOfKeys = async (stacheKey, datKeys, delayMs = 10) => {
    // console.log(`sending InvalidateListOfKeys: ${datKeys.join(', ')}`);
    if (!datKeys) return;

    for (const datKey of datKeys) {
      await this.gems.invalidateStache.Post({
        stacheKey: stacheKey,
        datKey: datKey
      });
      await $j.delay(delayMs);
    }

    console.log(`done sending InvalidateListOfKeys`);
  };

  DebugInvalidateJob = async (jobId: JobId) => {
    await vow([
      this.SendInvalidateStache(Staches().cJob.name, jobId),
      this.SendInvalidateStache(Staches().cJobSeek.name, jobId),
      this.SendInvalidateStache(Staches().cJobHistory.name, jobId)
    ]);
  };

  DebugInvalidateTerp = async (terpId: TerpId) => {
    await this.SendInvalidateStache(Staches().cTerp.name, terpId);
    await this.SendInvalidateStache(Staches().cSearch.name, "terp");
    await this.SendInvalidateStache(Staches().cTerpList.name, TERP_LISTS.real);
  };

  LoadServerStacheTokens = async () => {
    const tokens = await this.gems.getStacheTokens.Get();
    runInAction(() => (this.serverStacheTokens = tokens));
  };
}
