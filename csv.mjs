// import { parse } from 'csv'
import fs from 'node:fs/promises'
const MEARUREMENTS = ['rpm', 'tmot', 'idc', 'idref', 'vdc', 'tesc']
import { parse } from 'csv'

const records = []
// Initialize the parser

const parser = parse({
  delimiter: ','
})

// Use the readable stream api to consume records
parser.on('readable', async function () {
  let record
  while ((record = parser.read()) !== null) {
    records.push(record)
  }
  let str = ''
  records.forEach((val, ind) => {
    if (ind === 0)
      return
    let obj = JSON.parse(val[2])[0]
    MEARUREMENTS.forEach((v) => {
      str += (`default_pic,metric=${v} value=${obj[v]} ${(new Date(obj.date)).getTime()}\n`)
    })
  })
  await fs.writeFile('./lineFormat', str)
  console.log(records.slice(0, 10))
})

// Catch any error

parser.on('error', function (err) {
  console.error(err.message)
})


parser.write(await fs.readFile('./new.csv', { encoding: 'utf-8' }))
// Close the readable stream
parser.end()
