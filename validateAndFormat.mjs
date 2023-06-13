const DEFAULT_PIC = "default_pic";
const MEARUREMENTS = [
  "v0",
  "v1",
  "v2",
  "v3",
  "v4",
  "v5",
  "v6",
  "v7",
  "v8",
  "v9",
  "v10",
  "v11",
  "v12",
  "v13",
  "v14",
  "v15",
  "v16",
  "v17",
  "v18",
  "v19",
];
import { writeApi } from "./influxSetup.mjs";
import { Point } from "@influxdata/influxdb-client";
import { ErrorResponse } from "./errorHandler.mjs";
const tzOffset = 19800000;

function groupBy(arr, b) {
  let retArr = [];
  for (let i = 0; i < arr.length; i += b || 1) {
    retArr.push(arr.slice(i, i + b));
  }
  return retArr;
}

const grpByTen = function (arr) {
  return groupBy(arr, 10);
};

export function validateAndFormat(data) {
  //validation
  if (!data.pic) {
    data.pic = DEFAULT_PIC;
  } else {
    if (!/^[\w]{3,}$/.test(data.pic)) {
      throw new ErrorResponse(
        `pic id should contain at least 3 [0-8_a-Z] characters`,
        400
      );
    }
  }
  if (
    !data.Date ||
    !data.Time ||
    !data.v0 ||
    !data.v1 ||
    !data.v2 ||
    !data.v3 ||
    !data.v4 ||
    !data.v5 ||
    !data.v6 ||
    !data.v7 ||
    !data.v8 ||
    !data.v9 ||
    !data.v10 ||
    !data.v11 ||
    !data.v12 ||
    !data.v13 ||
    !data.v14 ||
    !data.v15 ||
    !data.v16 ||
    !data.v17 ||
    !data.v18 ||
    !data.v19  ) {
    throw new ErrorResponse(
      `invalid data format: all the needed fields doesn't exist`,
      400
    );
  }
  if (data.Date.length !== data.Time.length) {
    throw new ErrorResponse("date and time field are not one to one", 400);
  }
  const timeValueLen = data.Date.length;
  if (
    data.v0.length !== timeValueLen * 10 ||
    data.v1.length !== timeValueLen * 10 ||
    data.v2.length !== timeValueLen * 10 ||
    data.v3.length !== timeValueLen * 10 ||
    data.v4.length !== timeValueLen * 10 ||
    data.v5.length !== timeValueLen * 10 ||
    data.v6.length !== timeValueLen * 10 ||
    data.v7.length !== timeValueLen * 10 ||
    data.v8.length !== timeValueLen * 10 ||
    data.v9.length !== timeValueLen * 10 ||
    data.v10.length !== timeValueLen * 10 ||
    data.v11.length !== timeValueLen * 10 ||
    data.v12.length !== timeValueLen * 10 ||
    data.v13.length !== timeValueLen * 10 ||
    data.v14.length !== timeValueLen * 10 ||
    data.v15.length !== timeValueLen * 10 ||
    data.v16.length !== timeValueLen * 10 ||
    data.v17.length !== timeValueLen * 10 ||
    data.v18.length !== timeValueLen * 10 ||
    data.v19.length !== timeValueLen * 10
  ) {
    throw new ErrorResponse(
      "incorrect data format: there should be 10 field values for each timestamp",
      400
    );
  }

  //formating and writing to database
  const arrLen = data.Date.length;
  //loop through the date array
  for (let j = 0; j < arrLen; j++) {
    let dateObj = new Date(`${data.Date[j]}T${data.Time[j]}`);
    //grouping by 10
    const grouped = {
      v0: grpByTen(data.v0),
      v1: grpByTen(data.v1),
      v2: grpByTen(data.v2),
      v3: grpByTen(data.v3),
      v4: grpByTen(data.v4),
      v5: grpByTen(data.v5),
      v6: grpByTen(data.v6),
      v7: grpByTen(data.v7),
      v8: grpByTen(data.v8),
      v9: grpByTen(data.v9),
      v10: grpByTen(data.v10),
      v11: grpByTen(data.v11),
      v12: grpByTen(data.v12),
      v13: grpByTen(data.v13),
      v14: grpByTen(data.v14),
      v15: grpByTen(data.v15),
      v16: grpByTen(data.v16),
      v17: grpByTen(data.v17),
      v18: grpByTen(data.v18),
      v19: grpByTen(data.v19),
    };

    //creating objects for each millisecond
    for (let i = 0, epochD = dateObj.getTime() - tzOffset; i < 10; i++) {
      const nextTenMilliSec = new Date(epochD + i * 100);
      MEARUREMENTS.forEach((v) => {
        const point = new Point(data.pic)
          .tag(`metric`, v)
          .floatField("value", grouped[v][j][i])
          .timestamp(nextTenMilliSec);
        writeApi.writePoint(point);
      });
    }
  }
  return arrLen * 10;
}
