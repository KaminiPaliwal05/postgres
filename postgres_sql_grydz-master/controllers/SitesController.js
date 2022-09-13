const db = require("../config/db");
const validator = require('../helpers/validate');


const capitalizaString = async (data) => {
    let string = data.split(' ');
    console.log("string-->", string);
    let updatedString = "";
    string.map((item, index) => {
        console.log("Hello Kamini--->");
        let firstLetter = item ? item[0].toUpperCase() : '';
        console.log("firstLetter-->", firstLetter);
        let lastString = item.split(" ")[0].substring(1);
        console.log("lastString--->", lastString);
        if (index === 0) {
            updatedString = firstLetter + lastString;
        }
        else {
            updatedString = updatedString + " " + firstLetter + lastString;
        }
        console.log("updatedString-->", updatedString);
    });
    return updatedString;
}


const SitesController = {

    async sitesData(req, res) {
       
        const todayData = `SELECT solar_sum,
        consuption_sum,
        grid_sum,
        export_sum,
        import_sum
        FROM  (SELECT Trunc(Sum(gp), 2)     AS solar_sum,
               Trunc(Sum(cp), 2)     AS consuption_sum,
               Trunc(Sum(grid_p), 2) AS grid_sum,
               Trunc(Sum(grid_p), 2) AS export_sum,
               Trunc(Sum(grid_p), 2) AS import_sum,
               day,
               month,
               year
            FROM   (SELECT gp,
                       cp,
                       grid_p,
                       Extract(day FROM site_time)   AS DAY,
                       Extract(month FROM site_time) AS MONTH,
                       Extract(year FROM site_time)  AS YEAR
                FROM   "grydz"."device_generations"
                WHERE  gp > 0
                       AND gsm_id = ${req.params.gsm_id}
                LIMIT  17280) AS new_device
            GROUP  BY day,
                  month,
                  year) AS newData `;

        const monthData = `SELECT solar_sum,
        consuption_sum,
        grid_sum,
        export_sum,
        import_sum
        FROM  (SELECT Trunc(Sum(gp), 2) AS solar_sum,
               Trunc(Sum(cp), 2) AS consuption_sum,
               Trunc(Sum(grid_p), 2) AS grid_sum,
               Trunc(Sum(grid_p), 2) AS export_sum,
               Trunc(Sum(grid_p), 2) AS import_sum,
               month,
               year
            FROM   (SELECT gp,
                       cp,
                       grid_p,
                       Extract(month FROM site_time) AS MONTH,
                       Extract(year FROM site_time)  AS YEAR
                FROM   "grydz"."device_generations"
                WHERE  gp > 0
                       AND gsm_id = ${req.params.gsm_id}
                LIMIT  17280) AS new_device
            GROUP  BY month,
                  year) AS newData;`
        
        const yearData = `SELECT solar_sum,
        consuption_sum,
        grid_sum,
        export_sum,
        import_sum
    FROM  (SELECT Trunc(Sum(gp), 2) AS solar_sum,
               Trunc(Sum(cp), 2) AS consuption_sum,
               Trunc(Sum(grid_p), 2) AS grid_sum,
               Trunc(Sum(grid_p), 2) AS export_sum,
               Trunc(Sum(grid_p), 2) AS import_sum,
               year
        FROM   (SELECT gp,
                       cp,
                       grid_p,
                       Extract(month FROM site_time) AS MONTH,
                       Extract(year FROM site_time)  AS YEAR
                FROM   "grydz"."device_generations"
                WHERE  gp > 0
                       AND gsm_id = ${req.params.gsm_id}
                LIMIT  17280) AS new_device
        GROUP  BY year) AS newData;`;

        const totalData = `SELECT solar_sum,
        consuption_sum,
        grid_sum,
        export_sum,
        import_sum
        FROM  (SELECT Trunc(Sum(gp), 2) AS solar_sum,
               Trunc(Sum(cp), 2) AS consuption_sum,
               Trunc(Sum(grid_p), 2) AS grid_sum,
               Trunc(Sum(grid_p), 2) AS export_sum,
               Trunc(Sum(grid_p), 2) AS import_sum
        FROM   (SELECT gp,
                       cp,
                       grid_p,
                       Extract(month FROM site_time) AS MONTH,
                       Extract(year FROM site_time)  AS YEAR
                FROM   "grydz"."device_generations"
                WHERE  gp > 0
                       AND gsm_id = ${req.params.gsm_id}
                LIMIT  17280) AS new_device
        ) AS newData;`

        const daySiteData = await db.query(todayData);
        const monthSiteData = await db.query(monthData);
        const yearSiteData = await db.query(yearData);
        const totalSiteData = await db.query(totalData);

        const ObjData = {
            todayData:Object.assign({},...daySiteData?.rows) ?  Object.assign({},...daySiteData?.rows) : {},
            monthData:Object.assign({},...monthSiteData?.rows)? Object.assign({},...monthSiteData?.rows) : {},
            yearData: Object.assign({},...yearSiteData?.rows)? Object.assign({},...yearSiteData?.rows) : {},
            totalData: Object.assign({},...totalSiteData?.rows)? Object.assign({},...totalSiteData?.rows) : {},
        }
 
        console.log("ObjData--->",ObjData);

        res.status(200).send({
            message: "Sites Data Retrieved Successfully.",
            data: ObjData
        })
    },

    async sitesTable(req, res) {
     //  console.log("req",req);
        // const todayData = `SELECT solar_sum,
        // consuption_sum,
        // grid_sum,
        // export_sum,
        // import_sum
        // FROM  (SELECT Trunc(Sum(gp), 2)     AS solar_sum,
        //        Trunc(Sum(cp), 2)     AS consuption_sum,
        //        Trunc(Sum(grid_p), 2) AS grid_sum,
        //        Trunc(Sum(grid_p), 2) AS export_sum,
        //        Trunc(Sum(grid_p), 2) AS import_sum,
        //        day,
        //        month,
        //        year
        //     FROM   (SELECT gp,
        //                cp,
        //                grid_p,
        //                Extract(day FROM site_time)   AS DAY,
        //                Extract(month FROM site_time) AS MONTH,
        //                Extract(year FROM site_time)  AS YEAR
        //         FROM   "grydz"."device_generations"
        //         WHERE  gp > 0
        //                AND gsm_id = ${req.params.gsm_id}
        //         LIMIT  17280) AS new_device
        //     GROUP  BY day,
        //           month,
        //           year) AS newData `;
        
        // var date = new Date();
        // var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
        // var day = ("0" + date.getDate()).slice(-2);
        // var todayDate = [date.getFullYear(), mnth, day].join("-");
        // if(req.params.todayDate != 'undefined'){
        //     todayDate = req.params.gsm_id;
        // }
        const todayData = `SELECT  Trunc(Sum(gp), 2) AS solar_sum, 
                Trunc(Sum(cp), 2) AS consuption_sum,
                Trunc(Sum(grid_p), 2) AS grid_sum 
            FROM "grydz"."device_generations" 
            WHERE gsm_id=${req.params.gsm_id}`;

        // var startDate = [date.getFullYear(), mnth, 1].join("-");
        // var endDate = [date.getFullYear(), parseInt(mnth)+1, 0].join("-");
        
        // if(req.params.startDate != 'undefined'){
        //     startDate = req.params.startDate;
        // }
        // if(req.params.endDate != 'undefined'){
        //     endDate = req.params.endDate;
        // }
        const monthData = `SELECT  Trunc(Sum(gp), 2) AS solar_sum, 
                            Trunc(Sum(cp), 2) AS consuption_sum,
                            Trunc(Sum(grid_p), 2) AS grid_sum 
                        FROM "grydz"."device_generations" 
                        WHERE gsm_id=${req.params.gsm_id}`;// AND date BETWEEN ${startDate} and ${endDate}
        
        const yearData = `SELECT solar_sum,
        consuption_sum,
        grid_sum,
        export_sum,
        import_sum
    FROM  (SELECT Trunc(Sum(gp), 2) AS solar_sum,
               Trunc(Sum(cp), 2) AS consuption_sum,
               Trunc(Sum(grid_p), 2) AS grid_sum,
               Trunc(Sum(grid_p), 2) AS export_sum,
               Trunc(Sum(grid_p), 2) AS import_sum,
               year
        FROM   (SELECT gp,
                       cp,
                       grid_p,
                       Extract(month FROM site_time) AS MONTH,
                       Extract(year FROM site_time)  AS YEAR
                FROM   "grydz"."device_generations"
                WHERE  gp > 0
                       AND gsm_id = ${req.params.gsm_id}
                LIMIT  17280) AS new_device
        GROUP  BY year) AS newData;`;

        const totalData = `SELECT solar_sum,
        consuption_sum,
        grid_sum,
        export_sum,
        import_sum
        FROM  (SELECT Trunc(Sum(gp), 2) AS solar_sum,
               Trunc(Sum(cp), 2) AS consuption_sum,
               Trunc(Sum(grid_p), 2) AS grid_sum,
               Trunc(Sum(grid_p), 2) AS export_sum,
               Trunc(Sum(grid_p), 2) AS import_sum
        FROM   (SELECT gp,
                       cp,
                       grid_p,
                       Extract(month FROM site_time) AS MONTH,
                       Extract(year FROM site_time)  AS YEAR
                FROM   "grydz"."device_generations"
                WHERE  gp > 0
                       AND gsm_id = ${req.params.gsm_id}
                LIMIT  17280) AS new_device
        ) AS newData;`

        var daySiteData = await db.query(todayData);
        daySiteData?.rows.push({import_sum: 0,export_sum: 0});
        
        if(daySiteData?.rows[0].grid_sum > 0){
            daySiteData?.rows.push({import_sum: daySiteData?.rows[0].grid_sum,export_sum: 0}); 
        }else{
            daySiteData?.rows.push({import_sum: 0,export_sum: daySiteData?.rows[0].grid_sum})
        }
        
        var monthSiteData = await db.query(monthData);
        monthSiteData?.rows.push({import_sum: 0,export_sum: 0});

        if(monthSiteData?.rows[0].grid_sum > 0){
            monthSiteData?.rows.push({import_sum: monthSiteData?.rows[0].grid_sum,export_sum: 0}); 
        }else{
            monthSiteData?.rows.push({import_sum: 0,export_sum: monthSiteData?.rows[0].grid_sum})
        }

        const yearSiteData = await db.query(yearData);
        const totalSiteData = await db.query(totalData);

        const ObjData = [{
            calculated_today_data:Object.assign({},...daySiteData?.rows) ?  Object.assign({},...daySiteData?.rows) : {},
            calculated_month_data:Object.assign({},...monthSiteData?.rows)? Object.assign({},...monthSiteData?.rows) : {},
            calculated_year_data: Object.assign({},...yearSiteData?.rows)? Object.assign({},...yearSiteData?.rows) : {},
            calculated_total_data: Object.assign({},...totalSiteData?.rows)? Object.assign({},...totalSiteData?.rows) : {},
        }]
 
        //console.log("ObjData--->",ObjData);

        res.status(200).send({
            message: "Sites Data Retrieved Successfully.",
            data: ObjData
        })
    },

    async create(req, res) {
        console.log("create_api", req)
        try {
            console.log("hello")
            const Sites = `CREATE TABLE IF NOT EXISTS sites(site_name STRING,
                site_nick_name STRING,
                site_type STRING,
                standard_power STRING,
                location STRING,
                origin_date STRING,
                gsm_id STRING, 
                recent_gp STRING,
                recent_cp STRING,
                recent_grid_p STRING,
                recent_export_grid_p STRING,
                recent_import_grid_p STRING,
                grid_type STRING,
                solar STRING,
                commercial STRING,
                grid STRING,
                color STRING,
                backlogUpdatedAt TIMESTAMP,
                panel_name STRING,
                inverter_name STRING,
                tilt_angle STRING,
                direction STRING,
                benchmark_price STRING,
                site_image STRING,
                status STRING,
                ct_ratio_high STRING,
                ct_ratio_low STRING,
                calculated_ct_ratio STRING,
                last_data_generated_at TIMESTAMP,
                deletedAt TIMESTAMP,
                created_at TIMESTAMP, 
                updated_at TIMESTAMP)`
            
            const data = await db.query(Sites);
            console.log("Created TABLE---->",data);            
            const validationRule = {
                "site_name": "required|string",
                "site_nick_name": 'required|string',
                "site_type": 'required|string',
                "standard_power": 'required|string',
                "location": 'required|string',
                "origin_date": 'required|string',
                "gsm_id": 'required|string',
                "panel_name": 'required|string',
                "inverter_name": 'required|string',
                "grid_type": 'required|string',
                "tilt_angle": 'required|string',
                "ct_ratio_high": 'required|string',
                "ct_ratio_low": 'required|string',
                "direction": 'required|string',
                "benchmark_price": 'required|string',
            }
            validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    res.status(406)
                        .send({
                            success: false,
                            message: 'Errors',
                            data: err
                        });
                }
            });

            const {
                site_name,site_nick_name,site_type,standard_power,
                location,origin_date,gsm_id,panel_name,inverter_name,
                grid_type,tilt_angle,status,ct_ratio_high,ct_ratio_low,
                direction,benchmark_price, site_image} = req.body;
            var gsmData = await db.query(`SELECT * FROM sites WHERE gsm_id = ${gsm_id}`);
            console.log("gsmData---->",gsmData);
            console.log("gsmData?.rowCount", gsmData?.rowCount)
             if (gsmData?.rowCount > 0) {
                res.status(406)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: {
                            "errors": {
                                "gsm_id": [
                                    "GSM ID Must Be Uniqued"
                                ],
                            }
                        }
                    });
            } else {
                console.log("req.body", req.body)
            var createObj = `INSERT INTO sites(site_name,
                site_nick_name,site_type,standard_power,location,origin_date,gsm_id,panel_name,
                inverter_name,grid_type,tilt_angle,status,ct_ratio_high,ct_ratio_low,direction,
                benchmark_price, site_image) VALUES 
                ('${site_name}','${site_nick_name}','${site_type}',
                '${standard_power}','${location}','${origin_date}',
                '${gsm_id}','${panel_name}','${inverter_name}','${grid_type}','${tilt_angle}',
                '${status}','${ct_ratio_high}','${ct_ratio_low}','${direction}','${benchmark_price}','${site_image}') RETURNING *`;
                if (createObj?.ct_ratio_high && createObj?.ct_ratio_low) {
                    let calculatedCtRatio = (parseFloat(createObj?.ct_ratio_high) / (parseFloat(createObj?.ct_ratio_low) * 1000));
                    createObj = {
                        ...createObj,
                        calculated_ct_ratio: calculatedCtRatio.toString()
                    }
                }

                const sitesCreateData = await db.query(createObj);
                console.log("sitesCreateData-->",sitesCreateData);


                res.status(200).send({
                    message: "Data Inserted Successfully",
                    data: sitesCreateData?.rows[0]
                });
            }
            // return res.status(200).send("welcome")
        } catch (err) {
            console.log("err-->", err);
            res.status(406).send(err)
        }
    },

    async update(req, res) {
        console.log("Hello ");
        try {
            const validationRule = {
                "site_name": "required|string",
                "site_nick_name": 'required|string',
                "site_type": 'required|string',
                "standard_power": 'required|string',
                "location": 'required|string',
                "origin_date": 'required|string',
                "panel_name": 'required|string',
                "inverter_name": 'required|string',
                "grid_type": 'required|string',
                "tilt_angle": 'required|string',
                "ct_ratio_high": 'required|string',
                "ct_ratio_low": 'required|string',
                "direction": 'required|string',
                "benchmark_price": 'required|string',
                //"site_image":'required|string'
            }
            validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    res.status(406)
                        .send({
                            success: false,
                            message: 'Errors',
                            data: err
                        });
                }
            });
            let updateObj = {};
            const {site_name,site_nick_name,site_type,standard_power,location,origin_date,gsm_id,vendor_id,panel_name,inverter_name,grid_type,tilt_angle,status,ct_ratio_high,ct_ratio_low,direction,benchmark_price, site_image,defaultData} = req.body;
            // updateObj = `update sites set site_name = '${site_name}',
            //     site_nick_name = '${site_nick_name}',site_type = '${site_type}',
            //     standard_power = '${standard_power}',location = '${location}',
            //     origin_date = '${origin_date}',panel_name = '${panel_name}',
            //     inverter_name = '${inverter_name}',grid_type = '${grid_type}',tilt_angle = '${tilt_angle}',
            //     status = '${status}',ct_ratio_high = '${ct_ratio_high}',ct_ratio_low = '${ct_ratio_low}',
            //     direction = '${direction}', benchmark_price = '${benchmark_price}', site_image = '${site_image}' where gsm_id = '${req.params.gsm_id}') AND _id = '${req.authInfo?.rows[0]}' RETURNING *`;
          //  console.log("updateObj--->",updateObj);

            // if (site_image) {
            //     updateObj = 
            //         site_image: site_image && Array.isArray(site_image) ? site_image : ['']
                
            // }
            // let calculatedCtRatio = (parseFloat(updateObj?.ct_ratio_high) / (parseFloat(updateObj?.ct_ratio_low) * 1000));
            // console.log("calculatedCtRatio", calculatedCtRatio)
            const data = await db.query(`UPDATE sites SET site_name = '${site_name}',
            site_nick_name = '${site_nick_name}',site_type = '${site_type}',
            standard_power = '${standard_power}',location = '${location}',
            origin_date = '${origin_date}',panel_name = '${panel_name}',
            inverter_name = '${inverter_name}',grid_type = '${grid_type}',tilt_angle = '${tilt_angle}',
            status = '${status}',ct_ratio_high = '${ct_ratio_high}',ct_ratio_low = '${ct_ratio_low}',
            direction = '${direction}', benchmark_price = '${benchmark_price}', site_image = '${site_image}' WHERE gsm_id = '${req.params.gsm_id}' AND _id = '${req.authInfo?.rows[0]}' RETURNING *`);
            console.log("data---->", data);

            // let value = await Sites.findOne({where:{ _id: req.params.id}})
            // console.log("value--->", value);

            return res.status(200).send({
                message: "Data Updated Successfully",
                data: data?.rows[0]
            });
        } catch (err) {
            console.log("err---->",err);
            return res.status(422).send(err)
        }
    },

    async delete(req, res) {
        try {
            const query = `DELETE FROM sites WHERE gsm_id = ${req.params.gsm_id}`;
            const data = await db.query(query)
            // const data = await Sites.updateMany({ _id: ObjectId(req.params.id) }, { $set: { deletedAt: new Date() } });
            // console.log("data-------->",data);
            res.status(200).send({
                message: "Data Removed Successfully",
                data: data?.rows
            });
        } catch (err) {
            console.log("err--->",err);
            res.status(422).send(err)
        }
    },
}

module.exports = SitesController;