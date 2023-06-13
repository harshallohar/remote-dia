import { DeleteAPI } from "@influxdata/influxdb-client-apis";
import { config } from "dotenv";
import { influxDB } from "./influxSetup.mjs";
// require(influxdata/influxdb-client-apis');
config();

export async function deleteData(id){
    // console.log(id);
    const del = new DeleteAPI(influxDB);
    try {
      await del.postDelete({
        org: process.env.INFLUX_ORG,
        bucket: process.env.INFLUX_BUCKET,
        body:{
          predicate: `_measurement=${id}`,
          start: `${new Date("01-01-2021").toJSON().split(".")[0]}Z`,
          stop: `${new Date().toJSON().split(".")[0]}Z`,
        }
      })
      return true;
    } catch (error) {
      console.log(error)
    }
    return false;
  } 