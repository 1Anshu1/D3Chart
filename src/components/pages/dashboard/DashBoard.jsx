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
                <AreaChart data={data} title={"Total Calls"} stats={2420} growth={14} />
                <AreaChart data={data} title={"Completed Calls / HR"} stats={2418} growth={13} />
                <AreaChart data={data} title={"Call Waiting"} timeData={200} growth={12} />
                <AreaChart data={data} title={"Average Score"} averageData={84} growth={15} />
            </div>
            <MultilineChart
                callDurationData={callDurationData}
                title={"Call Duration"}
                height={300}
            />
            <div className={styles.twoChartContainer}>
                <LineChart slaData={slaData} title={"Service Level Agreement"} height={250} />
                <BarChart data={handleTimeData} title={"Average Handle Time"} height={250} />
            </div>
        </div>
    );
};

export default DashBoard;
