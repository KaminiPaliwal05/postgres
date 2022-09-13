const db = require("../config/db")


exports.crateTable = async function(){

    const query = `CREATE TABLE IF NOT EXISTS sites(site_name STRING,
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
    
    await db.query(query).then(res => {
        console.log("sites table created Successfully.");
    });
} 
