import { observer } from "mobx-react";
import React from "react";
import { Jewels, Router } from "../stores/RootStore";
import { Col, Row, Txt } from "../Bridge/Bricks/bricksShaper";
import {
  DATA_EDIT_OVERVIEW,
  DATA_EDIT_TABLES,
  DataEditDetectSchema
} from "../jewels/oDataEdit";
import { SimCard } from "../Bridge/misc/Card";
import { LinkFragile } from "../Bridge/Nav/Linker";
import type { T_DataEditTableEntry } from "../jewels/oDataEdit";
import { action, computed, observable, runInAction, toJS } from "mobx";
import Butt from "../Bridge/Bricks/Butt";
import { MdDelete, MdFiberNew, MdRefresh, MdSave } from "react-icons/md";
import { UpType } from "../Bridge/misc/UpType";
import styled from "styled-components";
import $j, { vow } from "../Bridge/misc/$j";
import { HUE } from "../Bridge/HUE";
import ButtLink from "../components/ButtLink";

// dataEdit/:tableKey/:pk

@observer
export class DataEditPage extends React.Component {
  render() {
    const params = Router().params;

    const tableKey: string = params.tableKey;
    const pk: string = params.pk;
    console.log("THE TABLE'S KEY: ", tableKey);
    if (tableKey === DATA_EDIT_OVERVIEW) {
      return <AllTables />;
    }

    const tableEntry = DATA_EDIT_TABLES.find((e) => e.table === tableKey);

    return (
      <>
        <TableView tableEntry={tableEntry} pk={pk} />
      </>
    );
  }
}

@observer
class AllTables extends React.Component {
  render() {
    return (
      <SimCard>
        <Txt hue={"#ff0000"} size={22} mar={16}>
          Please only use this page if you know what you're doing. Thanks! :)
        </Txt>

        {DATA_EDIT_TABLES.map((tableEntry) => (
          <EntryRow
            key={tableEntry.table}
            name={tableEntry.table}
            navParams={{
              tableKey: tableEntry.table,
              pk: DATA_EDIT_OVERVIEW
            }}
          />
        ))}
      </SimCard>
    );
  }
}

@observer
class EntryRow extends React.Component {
  render() {
    const id = this.props.id;
    const name = this.props.name;
    const navParams = this.props.navParams;

    return (
      <Row marB={4}>
        <Txt w={60} b>
          {id}
        </Txt>

        <LinkFragile toKey={"dataEdit"} params={navParams}>
          <Txt marL={16}>{name}</Txt>
        </LinkFragile>
      </Row>
    );
  }
}

@observer
class TableView extends React.Component {
  componentDidMount() {
    return this.Load();
  }

  @observable rows: [] = [];

  @action Load = async () => {
    const tableEntry: T_DataEditTableEntry = this.props.tableEntry;
    const pk: string = this.props.pk;

    if (!tableEntry) return; // unknown table
    if (pk && pk !== DATA_EDIT_OVERVIEW) return; // row view will load this

    const rows = await Jewels().oDataEdit.GetAllRows({
      table: tableEntry.table,
      orderBy: tableEntry.pkColumn
      // limit: ?,
      // offset: ?,
    });

    runInAction(() => {
      this.rows = rows || [];
    });
  };

  render() {
    const tableEntry: T_DataEditTableEntry = this.props.tableEntry;
    const pk: string = this.props.pk;

    if (!tableEntry) return <Txt>unknown table</Txt>;

    if (pk && pk !== DATA_EDIT_OVERVIEW) {
      return <RowView pkValue={pk} tableEntry={tableEntry} />;
    }

    return (
      <SimCard header={tableEntry.table}>
        <Row>
          <Butt
            on={() => this.Load()}
            icon={MdRefresh}
            tooltip={"Refresh"}
            primary
            subtle
            w={160}
            marB={16}
          />

          <Col grow />

          <ButtLink
            toKey={"dataEdit"}
            params={{ tableKey: tableEntry.table, pk: "new" }}
            icon={MdFiberNew}
            label={"Add Row"}
            secondary
          />
        </Row>

        {this.rows.map((rawRow, dex) => (
          <EntryRow
            key={rawRow[tableEntry.pkColumn]}
            id={rawRow[tableEntry.pkColumn]}
            name={rawRow[tableEntry.labelColumn]}
            navParams={{
              tableKey: tableEntry.table,
              pk: rawRow[tableEntry.pkColumn]
            }}
          />
        ))}
      </SimCard>
    );
  }
}

@observer
class RowView extends React.Component {
  componentDidMount() {
    return this.Load();
  }

  @observable columnKeys: string[] = [];
  @observable row = {};
  @observable schema = {};
  @observable error = "";

  @action Load = async () => {
    const pkValue: string = this.props.pkValue;
    const tableEntry: T_DataEditTableEntry = this.props.tableEntry;
    let error = "";

    console.log(`DataEditPage.RowView.Load: ${tableEntry.table}.${pkValue}`);

    // TODO: new entry, pass in columnKeys and make empty row object

    const schema = await Jewels().oDataEdit.GetSchema({
      table: tableEntry.table
    });

    let row = {};

    if (pkValue === "new") {
      row.__IS_NEW__ = true;
    } else {
      row = await Jewels().oDataEdit.GetRow({
        table: tableEntry.table,
        pk: {
          column: tableEntry.pkColumn,
          value: pkValue
        }
      });

      if (!row) error = `Can't find ${pkValue}`;
    }

    runInAction(() => {
      this.columnKeys = Object.keys(schema);
      this.row = row;
      this.schema = schema;
      this.error = error;
    });
  };

  @action Save = async () => {
    const pkValue: string = this.props.pkValue;
    const tableEntry: T_DataEditTableEntry = this.props.tableEntry;
    if (
      this.row.creds_required &&
      typeof this.row.creds_required === "string"
    ) {
      let ray = JSON.parse(this.row.creds_required);
      let shrinkRay = [];
      ray.forEach((entry) => {
        entry = entry.filter((i) => i > 0);
        shrinkRay.push(entry);
      });
      ray = shrinkRay;
      let max = 0;
      for (let i = 0; i < ray.length; i++) {
        if (ray[i].length > max) max = ray[i].length;
      }
      for (let i = 0; i < ray.length; i++) {
        while (ray[i].length < max) ray[i].push(0);
      }

      let creds = JSON.stringify(ray);
      let regx = /\[/g;
      let regy = /\]/g;

      creds = creds.replace(regx, "{");
      creds = creds.replace(regy, "}");
      this.row.creds_required = creds;
    }

    const saveObj = toJS(this.row);
    console.log(`DataEditPage.RowView.Save`, saveObj);

    const [_, updateError] = await vow(
      Jewels().oDataEdit.UpdateRow({
        table: tableEntry.table,
        pk: {
          column: tableEntry.pkColumn,
          value: pkValue
        },
        row: saveObj
      })
    );

    runInAction(() => {
      this.error = updateError || "";
    });
  };

  @action Create = async () => {
    const pkValue: string = this.props.pkValue;
    const tableEntry: T_DataEditTableEntry = this.props.tableEntry;

    if (
      this.row.creds_required &&
      typeof this.row.creds_required === "string"
    ) {
      let creds = this.row.creds_required;
      let regx = /\[/g;
      let regy = /\]/g;

      creds = creds.replace(regx, "{");
      creds = creds.replace(regy, "}");
      this.row.creds_required = creds;
    } else {
      this.row.creds_required = "{{0}}";
    }

    const saveObj = toJS(this.row);
    delete saveObj.__IS_NEW__;

    console.log(`DataEditPage.RowView.Create`, saveObj);

    // if (tableEntry.packer) {
    //   tableEntry.packer(saveObj);
    // }

    const [newPk, createError] = await vow(
      Jewels().oDataEdit.InsertRow({
        table: tableEntry.table,
        pk: {
          column: tableEntry.pkColumn,
          value: pkValue
        },
        row: saveObj
      })
    );

    if (createError) {
      runInAction(() => {
        this.error = createError || "";
      });

      return;
    }

    return this.NavBackToTable();

    // await Router().Navigate('dataEdit', {
    // 	tableKey: tableEntry.table,
    // 	pk: newPk,
    // });
  };

  @action Delete = async () => {
    const areYouSure = window.confirm(`Are you sure you want to delete this row?
This cannot be undone!
If possible, set it to inactive instead. :)`);
    if (!areYouSure) return;

    const pkValue: string = this.props.pkValue;
    const tableEntry: T_DataEditTableEntry = this.props.tableEntry;

    await Jewels().oDataEdit.DeleteRow({
      table: tableEntry.table,
      pk: {
        column: tableEntry.pkColumn,
        value: pkValue
      }
    });

    return this.NavBackToTable();
  };

  @action NavBackToTable = () => {
    const tableEntry: T_DataEditTableEntry = this.props.tableEntry;
    return Router().Navigate("dataEdit", {
      tableKey: tableEntry.table,
      pk: DATA_EDIT_OVERVIEW
    });
  };

  @computed get isNew(): boolean {
    return !!this.row.__IS_NEW__;
  }

  render() {
    const pkValue: string = this.props.pkValue;
    const tableEntry: T_DataEditTableEntry = this.props.tableEntry;

    if (!this.row)
      return (
        <SimCard>
          {this.error && (
            <Txt hue={HUE.error} mar={16} size={24}>
              {this.error}
            </Txt>
          )}
        </SimCard>
      );

    const labelValue = this.row[tableEntry.labelColumn] || "?";
    const header = `${tableEntry.table} #${pkValue} - ${labelValue}`;
    const columnHelp = tableEntry.columnHelp || {};

    return (
      <SimCard>
        {this.error && (
          <Txt hue={HUE.error} mar={16} size={24}>
            {this.error}
          </Txt>
        )}

        <Txt size={18} b marB={16}>
          {header}
        </Txt>

        <Row marB={16}>
          <Butt
            on={this.isNew ? this.Create : this.Save}
            icon={this.isNew ? MdFiberNew : MdSave}
            label={this.isNew ? "Create" : "Save"}
            secondary
            square
            alertAfter={"Saved!"}
          />
        </Row>

        {this.columnKeys.map((columnKey) => (
          <FieldEditor
            key={columnKey}
            columnKey={columnKey}
            rowObj={this.row}
            isPk={columnKey === tableEntry.pkColumn}
            pkValue={pkValue}
            columnSchema={this.schema[columnKey]}
            columnHelp={columnHelp[columnKey]}
          />
        ))}

        {!this.isNew && (
          <Row>
            <Butt
              on={this.Delete}
              icon={MdDelete}
              label={"Delete"}
              danger
              square
              marT={48}
            />
          </Row>
        )}
      </SimCard>
    );
  }
}

@observer
class FieldEditor extends React.Component {
  @action Set = (value) => {
    const columnKey = this.props.columnKey;
    const rowObj = this.props.rowObj;
    rowObj[columnKey] = value;
  };

  render() {
    const columnKey = this.props.columnKey;
    const rowObj = this.props.rowObj;
    const isPk = this.props.isPk;
    const columnSchema = this.props.columnSchema || {};
    const columnType = (columnSchema.type || "").toLowerCase();
    const columnHelp = this.props.columnHelp;

    let InputComponent = TextArea;
    let inputArgs = {};
    let value = rowObj[columnKey];
    let onChange = (evt) => this.Set(evt.target.value);
    let rowArgs = {};

    switch (columnType) {
      case "text":
        break;
      case "integer":
        InputComponent = Input;
        inputArgs.type = "number";
        break;
      case "array":
        InputComponent = Input;

        if (typeof value !== "string") {
          value = JSON.stringify(value);
        }

        // Clean up user display to show square brackets and remove the padding zeroes
        // Postgres requires all nested arrays be of the same length so all arrays are
        // padded with zeroes until they are the same length of longest array

        let regv = /,0/g;
        let regw = /\[0\]/g;
        let regx = /{/g;
        let regy = /}/g;

        if (value) {
          value = value
            .replace(regx, "[")
            .replace(regy, "]")
            .replace(regv, "")
            .replace(regw, "[]");
        }
        break;
      case "boolean":
        InputComponent = Input;
        inputArgs.type = "checkbox";
        inputArgs.checked = value && value !== "false";
        inputArgs.value = undefined;
        onChange = () => this.Set(!value);
        rowArgs.grow = false;
        rowArgs.w = 40;
        break;

      default:
    }

    if (value === null) {
      value = "";
    }

    return (
      <>
        {columnHelp && <ColumnHelp columnHelp={columnHelp} />}

        <Row childV marB={8}>
          <Txt w={160} marR={8}>
            {columnKey}
          </Txt>

          <Row grow {...rowArgs}>
            <InputComponent
              id={columnKey}
              value={value}
              onChange={onChange}
              disabled={isPk}
              {...inputArgs}
            />
          </Row>
        </Row>
      </>
    );
  }
}

@observer
class ColumnHelp extends React.Component {
  render() {
    const columnHelp = this.props.columnHelp;

    if (Array.isArray(columnHelp)) {
      return (
        <Col marT={8} padL={168} marB={2}>
          {columnHelp.map((help) => (
            <Txt key={help} size={14} b>
              {help}
            </Txt>
          ))}
        </Col>
      );
    }

    return (
      <Txt marT={8} padL={168} marB={2} size={14} b>
        {columnHelp}
      </Txt>
    );
  }
}

const Input = styled.input`
  width: 100%;
  height: ${(p) => p.height};
  font-size: 16px;
  padding: 6px;
  background-color: ${(p) => (p.disabled ? "#fff" : "#f7f8fb")};
  border-style: solid;
  border-width: 1px;
  border-color: #f7f8fb;
  outline-color: #269db5;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: ${(p) => p.height};
  font-size: 16px;
  padding: 6px;
  background-color: ${(p) => (p.disabled ? "#fff" : "#f7f8fb")};
  border-style: solid;
  border-width: 1px;
  border-color: #f7f8fb;
  outline-color: #269db5;
  box-sizing: border-box;
`;
