import { observer } from "mobx-react";
import React from "react";
import { Jewels } from "../../stores/RootStore";
import { SimCard } from "../../Bridge/misc/Card";
import { UpFieldFit, UpRow } from "../../Bridge/misc/UpField";
import { SearchBox } from "../../components/Goomap";
import thyme from "../../Bridge/thyme";

@observer
export class TerpEditor extends React.Component {
  render() {
    const updata = Jewels().vTerp.updata;
    console.log(updata, "THIS IS THE UPDATA");

    return (
      <>
        <SimCard>
          <UpRow>
            <UpFieldFit
              label={"First Name"}
              state={updata.firstName}
              maxWidth={"36%"}
            />
            <UpFieldFit label={"Middle"} state={updata.middleName} />
            <UpFieldFit
              label={"Last Name"}
              state={updata.lastName}
              maxWidth={"36%"}
            />
          </UpRow>

          <UpRow>
            <UpFieldFit label={"Email"} state={updata.email} maxWidth={"40%"} />
            <UpFieldFit
              label={"Pager Email"}
              state={updata.pagerEmail}
              description={"Used for legacy paging"}
            />
          </UpRow>

          <UpRow>
            <UpFieldFit label={"Phone"} state={updata.phone} />
            <UpFieldFit label={"Birthday"} state={updata.birthday} />
          </UpRow>

          {/*<UpFieldFit*/}
          {/*	label={'Preferred Teammates'}*/}
          {/*	state={updata.teammates}*/}
          {/*	multiline*/}
          {/*	marT={8}*/}
          {/*/>*/}

          <UpRow>
            <UpFieldFit label={"RID"} state={updata.rid} />
            <UpFieldFit label={"Medica"} state={updata.medica} />
            <UpFieldFit label={"Fairview"} state={updata.fairview} />
          </UpRow>

          <UpRow>
            <UpFieldFit label={"Day"} state={updata.rateDay} />
            <UpFieldFit label={"EW"} state={updata.rateEw} />
            <UpFieldFit label={"DB"} state={updata.rateDb} />
            <UpFieldFit label={"Legal"} state={updata.rateLegal} />
            <UpFieldFit label={"ER"} state={updata.rateEr} />
            <UpFieldFit label={"MHC"} state={updata.rateMhc} />
            <UpFieldFit label={"VRI"} state={updata.rateVri} />
          </UpRow>

          <UpRow marT={24}>
            <UpFieldFit
              label={"Created On"}
              value={thyme.nice.dateTime.short(updata.createdOn.value)}
              readonly
            />

            <UpFieldFit
              label={"Updated On"}
              value={thyme.nice.dateTime.short(updata.updatedOn.value)}
              readonly
            />

            <UpFieldFit label={"Last User"} state={updata.lastUser} readonly />
          </UpRow>
        </SimCard>

        <SimCard>
          <SearchBox
            id={"locationEditorSearch"}
            onSelected={updata.SelectAddress}
          />

          <UpRow>
            <UpFieldFit label={"Address"} state={updata.address} />
            <UpFieldFit label={"Apt/Suite/etc"} state={updata.address2} />
          </UpRow>

          <UpRow>
            <UpFieldFit label={"City"} state={updata.city} />
            <UpFieldFit label={"State"} state={updata.state} />
            <UpFieldFit label={"Zip"} state={updata.zip} />
          </UpRow>

          <UpRow>
            <UpFieldFit label={"Latitude"} state={updata.lat} />
            <UpFieldFit label={"Longitude"} state={updata.lng} />
          </UpRow>
        </SimCard>
      </>
    );
  }
}
