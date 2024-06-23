import React from "react";
import styles from "./email.module.css";
import HeatMap from "../../heatMap/HeatMap";
import BacklogData from "../../backlogData/BacklogData";
import {
    backlogData,
    categorisationData,
    heatMapData,
    priorityData,
    resolutionData,
} from "../../../data/data";
import BarChartH from "../../barChartH/BarChartH";
import BarChart from "../../barChart/BarChart";

const Email = () => {
    return (
        <div className={styles.container}>
            {/* <div className={styles.bargraphContainer}> */}
            <BacklogData
                backlogData={backlogData}
                title={"Backlog Summary"}
                legendColor={["#98EECE", "#D7BBFF", "#905AFA", "#00FF9E"]}
            />

            <div className={styles.bargraphContainer}>
                <BarChart data={resolutionData} title={"Mean Time To Resolution Status"} />
                <BacklogData
                    backlogData={priorityData}
                    title={"Priority Graphs"}
                    legendColor={["#F46C60", "#0C07D7", "#D7BBFF", "#00FF9E"]}
                />
            </div>
            <div className={styles.heatMapContainer}>
                <HeatMap data={heatMapData} title={"Busiest Hours"} />
                <HeatMap data={heatMapData} title={"Busiest Hours"} />
            </div>
            <div className={styles.bargraphContainer}>
                <BarChartH data={categorisationData} title={"Categorisation"} />
                <BarChart data={resolutionData} title={"Mean Time To Resolution Status"} />
            </div>
        </div>
    );
};

export default Email;
