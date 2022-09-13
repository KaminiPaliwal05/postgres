const express = require('express')
const app = express()
const port = 5000
const jsonData = require("./device_generations.json")
let index = 0;
let jsonDataNew = jsonData;
var bodyParser = require('body-parser');
const cors = require('cors');

const db_connection = require("./config/db");
const routes = require("./routes/api")
app.use("/api",routes)

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true }))
app.use(cors("*"));

app.use(express.json({limit: '50mb'}));


async function valueData(){
    await db_connection.connect()
var query = `CREATE TABLE IF NOT EXISTS device_generations(
    timestamp TIMESTAMP GENERATED ALWAYS AS CURRENT_TIMESTAMP,
    sd_card short,
    gsm_id STRING, 
    type STRING ,
    site_time TIMESTAMP, 
    date STRING,
    time STRING,
    gp DOUBLE,
    cp DOUBLE,
    grid_p DOUBLE)`;

await db_connection.query(query).then(res => {
    console.log("res--->",res);
  });
  return;
}

async function deviceData(i) {
    console.log("JSON-->",jsonDataNew[i]);
    let item = jsonDataNew[i];
    if(item["device_data"] && item["device_data"]["energy"]){
        item["device_data"]["energy"].forEach(async(elem) => {
        let obj = {
            sd_card:item?.device_data?.sd_card,
            gsm_id:item?.device_data?.gsm_id,
            type:elem?.type ?? 'NEW',
            site_time:`${new Date(`${elem?.date} ${elem?.time}`).getTime()}`,
            date: `${elem?.date}` ?? "",
            time: `${elem?.time}` ?? "",
            gp:elem?.gp ? elem?.gp : 0,
            cp:elem?.cp ? elem?.cp : 0,
            grid_p:elem?.cp-elem?.gp ? elem?.cp-elem?.gp : 0
        }
          let queryData = `INSERT INTO 
          device_generations(sd_card ,gsm_id, type ,site_time,date,time, gp,cp,grid_p) 
          VALUES (${obj['sd_card']},${obj['gsm_id']},'${obj['type']}',${obj['site_time']},'${obj['date']}', '${obj['time']}',${obj['gp']}, ${obj['cp']}, ${obj['grid_p']})`;
            await db_connection.query(queryData).then(res => {
                console.log("res---->",res);
            })
        });
    }
 return;
}

app.listen(port, async() => {
  //  await db_connection.connect();
    // let totalCount = await db_connection.query('SELECT COUNT(*) FROM device_generations');
    // console.log("DB welcome", totalCount);
    console.log(`Example app listening on port ${port}`)
});


valueData();
// setInterval(function() {
//     deviceData(index)
//     index = index+1;
// }, 5000);