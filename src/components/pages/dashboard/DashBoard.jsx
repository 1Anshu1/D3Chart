import React from "react";
import styles from "./dashboard.module.css";
import BarChart from "../../barChart/BarChart";
import LineChart from "../../lineChart/LineChart";
import AreaChart from "../../areaChart/AreaChart";
import MultilineChart from "../../multiLineChart/MultilineChart";
import {
    callDurationData,
    handleTimeData,
    slaData,
    data,
    categorisationData,
    backlogData,
    heatMapData,
} from "../../../data/data";
import BacklogData from "../../backlogData/BacklogData";
import HeatMap from "../../heatMap/HeatMap";

const DashBoard = () => {
    return (
        <div className={styles.container}>
            {/* <div className={styles.chartContainer}>
                <AreaChart data={data} title={"Total Calls"} stats={2420} />
                <AreaChart data={data} title={"Completed Calls / HR"} stats={2418} />
                <AreaChart data={data} title={"Call Waiting"} timeData={200} />
                <AreaChart data={data} title={"Average Score"} averageData={84} />
            </div> */}
            {/* <MultilineChart callDurationData={callDurationData} title={"Call Duration"} /> */}
            {/* <div className={styles.chartContainer}>
                <LineChart slaData={slaData} title={"Service Level Agreement"} />
                <BarChart data={handleTimeData} title={"Average Handle Time"} />
                <BarChart data={handleTimeData} title={"Average Handle Time"} />
            </div> */}
            {/* <BacklogData backlogData={backlogData} title="Backlog Summary" /> */}
        </div>
    );
};

export default DashBoard;
