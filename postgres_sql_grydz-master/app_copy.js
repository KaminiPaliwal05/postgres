const express = require('express')
const app = express()
const port = 3000
const jsonData = require("./device_generations.json")
let index = 0;
let jsonDataNew = jsonData;
//const db = require("./config/db")
const { Client } = require('pg');

const client = new Client({connectionString: 'postgresql://crate:123456789@localhost:5432/doc'});

async function valueData(){
    await client.connect()
// var query = `CREATE TABLE IF NOT EXISTS device_generations(
//     timestamp TIMESTAMP GENERATED ALWAYS AS CURRENT_TIMESTAMP,
//     sd_card short,
//     gsm_id STRING, 
//     type STRING ,
//     site_time TIMESTAMP, 
//     gp DOUBLE,
//     cp DOUBLE)`;
// //let query = `SELECT COUNT(*) FROM device_generations`;

// await client.query(query).then(res => {
//     console.log("res--->",res);
//   });
//   return;
}

async function deviceData(i) {
    // console.log("JSON-->",jsonDataNew[i]);
    // let item = jsonDataNew[i];
    // if(item["device_data"] && item["device_data"]["energy"]){
    //     item["device_data"]["energy"].forEach(async(elem) => {
    //       let queryData = `INSERT INTO device_generations(sd_card ,gsm_id, type ,site_time, gp,cp) VALUES (${item['device_data']['sd_card']},${item['device_data']['gsm_id']},'${elem['type'] ? elem['type'] : 'NEW'}',${new Date(`${elem['date']} ${elem['time']}`).getTime()},${elem['gp']},${elem['cp']})`;
    //         await client.query(queryData).then(res => {
    //             console.log("res---->",res);
    //         })
    //     });
    // }

    let queryData = "SELECT COUNT(*) FROM users_new";
    console.log("queryData", queryData)
            await client.query(queryData).then(res => {
                console.log("res---->",res);
            })
 return;
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

valueData();
setInterval(function() {
    deviceData(index)
    index = index+1;
}, 5000);