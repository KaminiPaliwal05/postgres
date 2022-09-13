const db = require("../config/db")
const jsonData = require("../device_generations.json");
let index = 0;
let jsonDataNew = jsonData;

const GraphController = {

    // async insert(req, res,i) {
    //     try {
    //         var query = `CREATE TABLE IF NOT EXISTS device_generations(
    //         timestamp TIMESTAMP GENERATED ALWAYS AS CURRENT_TIMESTAMP,
    //         sd_card short,
    //         gsm_id STRING, 
    //         type STRING ,
    //         site_time TIMESTAMP, 
    //         gp DOUBLE,
    //         cp DOUBLE)`;

    //         await db.query(query).then(res => {
    //             console.log("res--->", res);
    //         });

    //         if (`SELECT gsm_id FROM device_generations`) {
    //             console.log("JSON-->", jsonDataNew);
    //             let item = jsonDataNew;
    //             if (item["device_data"] && item["device_data"]["energy"]) {
    //                 item["device_data"]["energy"].forEach(async (elem) => {
    //                     var queryData = `INSERT INTO device_generations(sd_card ,gsm_id, type ,site_time, gp,cp) VALUES (${item['device_data']['sd_card']},${item['device_data']['gsm_id']},'${elem['type'] ? elem['type'] : 'NEW'}',${new Date(`${elem['date']} ${elem['time']}`).getTime()},${elem['gp']},${elem['cp']})`;
    //                     var data = await client.query(queryData).then(res => {
    //                         console.log("res---->", res);
    //                     })
    //                     console.log("data-->", data);
    //                 });
    //             }
    //             res.status(200).send({
    //                 message: "Inserted Successfully.",
    //                 data: data
    //             })
    //         }
    //     } catch (err) {
    //         console.log("err--->", err);
    //     }

    // }

    async dayGraph(req, res) {
        try {
            console.log("db-->", db);
            const data = await db.query(`SELECT
            (hour || ':' || minute) as x,
               gp,
               cp,
               grid_p 
            FROM
               (
                  select
                     trunc(SUM(gp), 2) as gp,
                     trunc(SUM(cp), 2) as cp,
                     trunc(SUM(grid_p), 2) AS grid_p,
                     hour,
                     minute 
                  from
                     (
                        select
                           gp,
                           cp,
                           grid_p,
                           EXTRACT(HOUR 
                        FROM
                           site_time) as hour,
                           EXTRACT(MINUTE 
                        FROM
                           site_time) as minute,
                           EXTRACT(SECOND 
                        FROM
                           site_time) as second 
                        FROM
                           "grydz"."device_generations" 
                        WHERE
                           gp > 0 
                           AND gsm_id = ${req.params.gsm_id} limit 17280
                     )
                     as new_device 
                  GROUP BY
                     hour,
                     minute 
               )
               as newData 
            ORDER BY
               hour,
               minute ASC`)

            console.log("data-->", data);
            console.log("data-->", data['rows']);


            res.status(200).send({
                message: "graph Data Retrieved Successfully.",
                data: data['rows']
            })
        } catch (err) {
            console.log("err--->", err);
            res.status(422).send(err)
        }
    },

    async monthGraph(req, res) {
        try {
            console.log("db-->", db);
            const data = await db.query(`SELECT
            day as x,
            gp,
            cp,
            grid_p 
         FROM
            (
               select
                  trunc(SUM(gp), 2) as gp,
                  trunc(SUM(cp), 2) as cp,
                  trunc(SUM(grid_p), 2) AS grid_p,
                  day 
               from
                  (
                     select
                        gp,
                        cp,
                        grid_p,
                        EXTRACT(day 
                     FROM
                        site_time) as day,
                        EXTRACT(month 
                     FROM
                        site_time) as month,
                        EXTRACT(year 
                     FROM
                        site_time) as year 
                     FROM
                        device_generations 
                     WHERE
                        gp > 0 
                        AND gsm_id = ${req.params.gsm_id}
                  )
                  as new_device 
               GROUP BY
                  day 
            )
            as newData 
         ORDER BY
            day ASC`)

            console.log("data-->", data);
            console.log("data-->", data['rows']);


            res.status(200).send({
                message: "graph Data Retrieved Successfully.",
                data: data['rows']
            })
        } catch (err) {
            console.log("err--->", err);
            res.status(422).send(err)
        }
    },

    async yearGraph(req, res) {
        try {
            console.log("db-->", db);
            const data = await db.query(`SELECT
            month as x,
            gp,
            cp,
            grid_p 
         FROM
            (
               select
                  trunc(SUM(gp), 2) as gp,
                  trunc(SUM(cp), 2) as cp,
                  trunc(SUM(grid_p), 2) AS grid_p,
                  month 
               from
                  (
                     select
                        gp,
                        cp,
                        grid_p,
                        EXTRACT(month 
                     FROM
                        site_time) as month,
                        EXTRACT(year 
                     FROM
                        site_time) as year 
                     FROM
                        device_generations 
                     WHERE
                        gp > 0 
                        AND gsm_id = ${req.params.gsm_id}
                  )
                  as new_device 
               GROUP BY
                  month 
            )
            as newData 
         ORDER BY
            month ASC`)

            console.log("data-->", data);
            console.log("data-->", data['rows']);


            res.status(200).send({
                message: "graph Data Retrieved Successfully.",
                data: data['rows']
            })
        } catch (err) {
            console.log("err--->", err);
            res.status(422).send(err)
        }
    },

    async totalGraph(req, res) {
        try {
            console.log("db-->", db);
            const data = await db.query(`SELECT
            year,
            gp,
            cp,
            grid_p 
         FROM
            (
               SELECT
                  trunc(SUM(gp), 2)as gp,
                  trunc(SUM(cp), 2) as cp,
                  trunc(SUM(grid_p), 2) AS grid_p,
                  year 
               FROM
                  (
                     SELECT
                        gp,
                        cp,
                        grid_p,
                        EXTRACT(year 
                     FROM
                        site_time) as year 
                     FROM
                        "grydz"."device_generations" 
                     WHERE
                        gsm_id = ${req.params.gsm_id}
                  )
                  as new_data 
                GROUP BY
                  year 
            )
            as newData 
         ORDER BY
            year ASC`)

            console.log("data-->", data);
            console.log("data-->", data['rows']);


            res.status(200).send({
                message: "graph Data Retrieved Successfully.",
                data: data['rows']
            })
        } catch (err) {
            console.log("err--->", err);
            res.status(422).send(err)
        }
    },
}

module.exports =  GraphController;