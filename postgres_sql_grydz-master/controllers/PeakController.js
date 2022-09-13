const db = require("../config/db")

const PeakController = {

    async dayPeak(req,res){
        try {
            const query = `SELECT site_time,gp FROM device_generations
            WHERE gp = (SELECT max(gp) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;
   
            const queryData = `SELECT site_time,cp FROM device_generations
            WHERE cp = (SELECT max(cp) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;
   
            const query1 = `SELECT site_time,grid_p FROM device_generations
            WHERE grid_p = (SELECT max(grid_p) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;

            const query2 = `SELECT site_time,grid_p FROM device_generations
            WHERE grid_p = (SELECT min(grid_p) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;
           
            const monthData = `SELECT site_time,gp FROM device_generations
            WHERE gp = (SELECT max(gp) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;
   
            const monthData1 = `SELECT site_time,cp FROM device_generations
            WHERE cp = (SELECT max(cp) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;
   
            const monthData2 = `SELECT site_time,grid_p FROM device_generations
            WHERE grid_p = (SELECT max(grid_p) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;

            const monthData3 = `SELECT site_time,grid_p FROM device_generations
            WHERE grid_p = (SELECT min(grid_p) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;

            const yearData = `SELECT site_time,gp FROM device_generations
            WHERE gp = (SELECT max(gp) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;
   
            const yearData1 = `SELECT site_time,cp FROM device_generations
            WHERE cp = (SELECT max(cp) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;
   
            const yearData2 = `SELECT site_time,grid_p FROM device_generations
            WHERE grid_p = (SELECT max(grid_p) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;

            const yearData3 = `SELECT site_time,grid_p FROM device_generations
            WHERE grid_p = (SELECT min(grid_p) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;

            const totalData = `SELECT site_time,gp FROM device_generations
            WHERE gp = (SELECT max(gp) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;
   
            const totalData1 = `SELECT site_time,cp FROM device_generations
            WHERE cp = (SELECT max(cp) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;
   
            const totalData2 = `SELECT site_time,grid_p FROM device_generations
            WHERE grid_p = (SELECT max(grid_p) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;

            const totalData3 = `SELECT site_time,grid_p FROM device_generations
            WHERE grid_p = (SELECT min(grid_p) FROM device_generations) AND gsm_id = ${req.params.gsm_id}`;

            const data = await db.query(query);
            const data1 = await db.query(queryData);
            const data2 = await db.query(query1);
            const data3 = await db.query(query2);
            const monthPeak = await db.query(monthData);
            const monthPeak1 = await db.query(monthData1);
            const monthPeak2 = await db.query(monthData2);
            const monthPeak3 = await db.query(monthData3);
            const yearPeak = await db.query(yearData);
            const yearPeak1 = await db.query(yearData1);
            const yearPeak2 = await db.query(yearData2);
            const yearPeak3 = await db.query(yearData3);
            const totalPeak = await db.query(totalData);
            const totalPeak1 = await db.query(totalData1);
            const totalPeak2 = await db.query(totalData2);
            const totalPeak3 = await db.query(totalData3);

            const ObjData = [{
              dayPeakData: {
                gpPeak: Object.assign({},...data?.rows) ? Object.assign({},...data?.rows) : {},
                cpPeak: Object.assign({},...data1?.rows) ? Object.assign({},...data1?.rows) : {},
                importPeak: Object.assign({},...data2?.rows) ? Object.assign({},...data2?.rows) : {},
                exportPeak: Object.assign({},...data3?.rows) ? Object.assign({},...data3?.rows) : {}
              },

              monthPeakData: {
                gpPeak: Object.assign({},...monthPeak?.rows) ? Object.assign({},...monthPeak?.rows) : {},
                cpPeak: Object.assign({},...monthPeak1?.rows) ? Object.assign({},...monthPeak1?.rows) : {},
                importPeak: Object.assign({},...monthPeak2?.rows) ? Object.assign({},...monthPeak2?.rows) : {},
                exportPeak: Object.assign({},...monthPeak3?.rows) ? Object.assign({},...monthPeak3?.rows) : {}
              },

              yearPeakData: {
                gpPeak: Object.assign({},...yearPeak?.rows) ? Object.assign({},...yearPeak?.rows) : {},
                cpPeak: Object.assign({},...yearPeak1?.rows) ? Object.assign({},...yearPeak1?.rows) : {},
                importPeak: Object.assign({},...yearPeak2?.rows) ? Object.assign({},...yearPeak2?.rows) : {},
                exportPeak: Object.assign({},...yearPeak3?.rows) ? Object.assign({},...yearPeak3?.rows) : {}
              },

              totalPeakData: {
                gpPeak: Object.assign({},...totalPeak?.rows) ? Object.assign({},...totalPeak?.rows) : {},
                cpPeak: Object.assign({},...totalPeak1?.rows) ? Object.assign({},...totalPeak1?.rows) : {},
                importPeak: Object.assign({},...totalPeak2?.rows) ? Object.assign({},...totalPeak2?.rows) : {},
                exportPeak: Object.assign({},...totalPeak3?.rows) ? Object.assign({},...totalPeak3?.rows) : {}
              }
            }]
            console.log("ObjData-->",ObjData)
            
          //  const Obj = {
          //      data:data?.rows.concat(data1?.rows).concat(data2?.rows).concat(data3?.rows).concat(monthPeak?.rows),
          //  }
          //  console.log("Obj--->",Obj["data"]);

           res.status(200).send({
               message:"peak Data Retrieved Successfully.",
               data:ObjData
           })
        } catch (err) {
            console.log("err--->",err);
            res.status(422).send(err)
        }
    },

    async MonthPeak(req,res){
        try {
         
            const data = await db.query(`SELECT 
            month, 
            year, 
            gpPeak, 
            cpPeak, 
            mxGrid, 
            mnGrid, 
            TimeP 
          FROM 
            (
              SELECT 
                MAX(gp) as gpPeak, 
                Max(site_time) AS TimeP, 
                MAX(cp) as cpPeak, 
                MAX(grid_p) AS mxGrid, 
                MIN(grid_p) AS mnGrid, 
                month, 
                year 
              FROM 
                (
                  SELECT 
                    gp, 
                    cp, 
                    grid_p, 
                    site_time, 
                    EXTRACT(
                      month 
                      FROM 
                        site_time
                    ) as month, 
                    EXTRACT(
                      year 
                      FROM 
                        site_time
                    ) as year 
                  FROM 
                    "grydz"."device_generations" 
                  WHERE 
                    gsm_id = ${req.params.gsm_id} 
                  ORDER BY 
                    _id DESC
                ) as new_data 
              GROUP BY 
                month, 
                year
            ) as newData 
          ORDER BY 
            month, 
            year, 
            TimeP ASC           
          `);

           res.status(200).send({
               message:"peak Data Retrieved Successfully.",
               data:data["rows"]
           })
        } catch (err) {
            console.log("err--->",err);
            res.status(422).send(err)
        }
    },

    async yearPeak(req,res){
        try {
    
           
            const data = await db.query(`SELECT 
            year, 
            gpPeak, 
            cpPeak, 
            mxGrid, 
            mnGrid, 
            TimeP 
          FROM 
            (
              SELECT 
                MAX(gp) as gpPeak, 
                Max(site_time) AS TimeP, 
                MAX(cp) as cpPeak, 
                MAX(grid_p) AS mxGrid, 
                MIN(grid_p) AS mnGrid, 
                year 
              FROM 
                (
                  SELECT 
                    gp, 
                    cp, 
                    grid_p, 
                    site_time, 
                    EXTRACT(
                      year 
                      FROM 
                        site_time
                    ) as year 
                  FROM 
                    "grydz"."device_generations" 
                  WHERE 
                    gsm_id = ${req.params.gsm_id}
                  ORDER BY 
                    _id DESC
                ) as new_data 
              GROUP BY 
                year
            ) as newData 
          ORDER BY 
            year, 
            TimeP ASC                    
          `);

           res.status(200).send({
               message:"peak Data Retrieved Successfully.",
               data:data["rows"]
           })
        } catch (err) {
            console.log("err--->",err);
            res.status(422).send(err)
        }
    },

    async totalPeak(req,res){
        try {
    
           
            const data = await db.query(`SELECT 
            gpPeak, 
            cpPeak, 
            mxGrid, 
            mnGrid, 
            TimeP 
          FROM 
            (
              SELECT 
                MAX(gp) as gpPeak, 
                Max(site_time) AS TimeP, 
                MAX(cp) as cpPeak, 
                MAX(grid_p) AS mxGrid, 
                MIN(grid_p) AS mnGrid 
              FROM 
                (
                  SELECT 
                    gp, 
                    cp, 
                    grid_p, 
                    site_time 
                  FROM 
                    "grydz"."device_generations" 
                  WHERE 
                    gsm_id = ${req.params.gsm_id} 
                  ORDER BY 
                    _id DESC
                ) as new_data
            ) as newData 
          ORDER BY 
            TimeP ASC                     
          `);

           res.status(200).send({
               message:"peak Data Retrieved Successfully.",
               data:data["rows"]
           })
        } catch (err) {
            console.log("err--->",err);
            res.status(422).send(err)
        }
    }
}

module.exports = PeakController;