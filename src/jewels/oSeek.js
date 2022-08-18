import GetGem_DEPRECATED from "../Bridge/jewelerClient/GetGem_DEPRECATED";
import { BaseJewel } from "./BaseJewel";

export default class oSeek extends BaseJewel {
  gems = {
    getAllJobsWithActiveSeekers: new GetGem_DEPRECATED()
  };
}