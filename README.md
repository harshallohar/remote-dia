# Remote diagnosis project

## What does this script do?

- Provides api endpoint to collect remote diagnostics data sent using post request to /add route in a specific format.

### Format of the data sent

```JSON
{
  "Date" : ["2022-01-23", "..."],
  "Time" : ["11:11:02", "..."],
  "vdc" : [33.23, "..."],
  "idc" : [54, "..."],
  "tmot" : [14, "..."],
  "rpm" : [23, "..."],
  "idref" : [3, "..."],
  "tesc" : [21.23, "..."],
}
```

- All the fields in the above example json should be present.
- Length of Date array === Length of Time array
- The length of rest of the arrays should be 10X the length of Date || Time array

## Where the data is stored?

- The data is stored in a time series database called influxDB

## Database details

- A bucket is created in influxDB to store diagnostics data.
- The data is written with millisecond precision.
- As per the above JSON format, the metrics are added every 10ms.

### Schema

`measurement(picID),tags(metric="metric_name(ex: rpm)") values(value=10.23) timestamp(23412343434)`

Data in `lineformat`

```
213412342134234,metric=tmot tmot=44.97 1668406550000
213412342134234,metric=rpm rpm=0.096 1668406550100
213412342134234,metric=idc idc=0.649 1668406550200
213412342134234,metric=idref idref=0 1668406550300
213412342134234,metric=tesc tesc=27.849 1668406550400
213412342134234,metric=idref idref=0 1668406550500
```

### Databse package

- The .deb package is downloaded from InfluxDB website and is installed manually
- Influx service is started using systemd

## Logging

- Grafana loki is used for logging, and logs are sent using Winston custom Transport


## Environment Variables

| name            | value                            |
| --------------- | -------------------------------- |
| NODE_ENV        | "production" \|\| "development"  |
| INFLUX_URL      | "url of influx db database"      |
| INFLUD_ORG      | "organization token of influxdb" |
| PORT            | "application port"               |
| LOKI_USERNAME   | "username of grafana loki"       |
| GRAFANA_API_KEY | "api key of grafana loki"        |
| INFLUX_BUCKET   | "name of influxDB bucket"        |
| INFLUX_TOKEN    | "influx db api token"            |

