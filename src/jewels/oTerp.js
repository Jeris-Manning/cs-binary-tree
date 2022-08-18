import { action, observable, runInAction } from "mobx";
import $j, { vow } from "../Bridge/misc/$j";
import { WiseGem } from "../Bridge/jewelerClient/WiseGem";
import thyme from "../Bridge/thyme";
import { Router } from "../stores/RootStore";
import { TerpTagDat } from "../datum/stache/TerpTagDat";
import { BaseJewel } from "./BaseJewel";

export class oTerp extends BaseJewel {
  gems = {
    getFull: new WiseGem("terpId"),
    postNewTerp: new WiseGem(),
    postChanges: new WiseGem("terpId"),
    getAllTags: new WiseGem(),
    getAllRegions: new WiseGem()
  };

  NavToTerp = (terpId) => Router().Navigate("terp", { terpId: terpId });

  GetTerp = async (terpId) => {
    const [terp, error] = await vow(this.gems.getFull.Get({ terpId: terpId }));

    if (error) throw new Error(error);
    if (!terp) throw new Error(`Terp ${terpId} doesn't exist`);

    return thyme.fast.obj.unpack(terp);
  };

  NewTerp = async () => {
    const newTerpId = await this.gems.postNewTerp.Post();
    return newTerpId;
  };

  SaveTerp = async (terpId, changes) => {
    const [_, error] = await vow(
      this.gems.postChanges.Post({
        terpId: terpId,
        changes: changes
      })
    );

    if (error) throw new Error(error);
  };

  @observable allTags: TerpTagDat[] = [];
  @action SetTags = (allTags) => (this.allTags = allTags);

  GetAllTags_DEPRECATED = async (forceReload = false): TerpTagDat[] => {
    if (!this.allTags.length || forceReload) {
      const rows = await this.gems.getAllTags.Get({
        forceReload: forceReload
      });

      this.SetTags(
        rows.map(TerpTagDat.CreateWith).sort($j.sort.default("order"))
      );
    }

    return this.allTags;
  };
}
