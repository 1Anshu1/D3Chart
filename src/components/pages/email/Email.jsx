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
import AnalysisContainer from "../../analysisContainer/AnalysisContainer";

const Email = () => {
    return (
        <div className={styles.container}>
            {/* <div className={styles.bargraphContainer}> */}
            <div className={styles.singleChartContainer}>
                <BacklogData
                    backlogData={backlogData}
                    title={"Backlog Summary"}
                    legendColor={["#98EECE", "#D7BBFF", "#905AFA", "#00FF9E"]}
                    legend={["Received", "Sent", "Daily Backlog", "Net Backlog"]}
                />
            </div>

            <div className={styles.bargraphContainer}>
                <BarChart
                    data={resolutionData}
                    title={"Mean Time To Resolution Status"}
                    height={300}
                />
                <BacklogData
                    backlogData={priorityData}
                    title={"Priority Graphs"}
                    legendColor={["#F46C60", "#0C07D7", "#D7BBFF", "#A363FF", "#00FF9E"]}
                    legend={["P1", "P2", "P3", "P4", "P5"]}
                    height={300}
                />
            </div>
            {/* <div className={styles.heatMapContainer}>
                <HeatMap data={heatMapData} title={"Busiest Hours"} />
                <HeatMap data={heatMapData} title={"Busiest Hours"} />
            </div> */}
            <div className={styles.bargraphContainer}>
                <BarChartH data={categorisationData} title={"Categorisation"} height={250} />
                <BarChart
                    data={resolutionData}
                    title={"Mean Time To Resolution Status"}
                    height={250}
                />
            </div>
            {/* <div className={styles.agentAnalysisContainer}>
                <div className={styles.title}>Agent Analysis </div>
                <div className={styles.bt}>
                    <AnalysisContainer title={"Avg Response Time"} time={200} incrementData={12} />
                    <AnalysisContainer title={"Avg Response Time"} time={200} incrementData={12} />
                    <AnalysisContainer title={"Avg Response Time"} time={200} incrementData={12} />
                    <AnalysisContainer title={"Avg Response Time"} time={200} incrementData={12} />
                    <AnalysisContainer title={"Avg Response Time"} time={200} incrementData={12} />
                    <AnalysisContainer title={"Avg Response Time"} time={200} incrementData={12} />
                    <AnalysisContainer title={"Avg Response Time"} time={200} incrementData={12} />
                </div>
            </div> */}
        </div>
    );
};

export default Email;
