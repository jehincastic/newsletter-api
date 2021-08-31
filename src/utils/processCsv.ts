import * as csv from "fast-csv";

import { publishToQueue } from "../rabbitMq/publisher";
import { EMAIL_QUEUE, MAX_ROWS } from "../constants";
import { CsvType } from "../types";

const getCsvData = (
  filePath: string,
): Promise<CsvType[]> => new Promise((res, rej) => {
  const info: CsvType[] = [];
  csv.parseFile(filePath, { headers: true, maxRows: MAX_ROWS })
    .on("error", (err) => {
      rej(err);
    })
    .on("data", (row: CsvType) => {
      if (row.Email && row.Content && row.Name) {
        info.push(row);
      }
    })
    .on("end", () => {
      res(info);
    });
});

const processCsv = async (filePath: string) => {
  const csvData = await getCsvData(filePath);
  csvData.forEach((d) => {
    publishToQueue(EMAIL_QUEUE, JSON.stringify(d));
  });
};

export default processCsv;
