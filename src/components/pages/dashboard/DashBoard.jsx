import React from "react";
import styles from "./dashboard.module.css";
import BarChart from "../../barChart/BarChart";
import LineChart from "../../lineChart/LineChart";
import AreaChart from "../../areaChart/AreaChart";
import MultilineChart from "../../multiLineChart/MultilineChart";
import { callDurationData, handleTimeData, slaData, data } from "../../../data/data";

const DashBoard = () => {
    return (
        <div className={styles.container}>
            <div className={styles.chartContainer}>
                <AreaChart data={data} title={"Total Calls"} stats={2420} />
                <AreaChart data={data} title={"Completed Calls / HR"} stats={2418} />
                <AreaChart data={data} title={"Call Waiting"} timeData={200} />
                <AreaChart data={data} title={"Average Score"} averageData={84} />
            </div>
            <MultilineChart callDurationData={callDurationData} title={"Call Duration"}/>
            <div className={styles.chartContainer}>
                <LineChart slaData={slaData} title={"Service Level Agreement"}/>
                <BarChart handleTimeData={handleTimeData} title={"Average Handle Time"} />
            </div>
        </div>
    );
};

export default DashBoard;
