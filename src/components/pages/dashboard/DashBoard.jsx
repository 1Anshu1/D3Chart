import React from 'react'
import styles from  './dashboard.module.css'
import BarChart from '../../barChart/BarChart'
import LineChart from '../../lineChart/LineChart'
import AreaChart from '../../areaChart/AreaChart'
import MultilineChart from '../../multiLineChart/MultilineChart'
import { callDurationData, handleTimeData, slaData,data } from '../../../data/data'

const DashBoard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <AreaChart className={styles.box} data={data} title={"Total Calls"} stats={2420}/>
        <AreaChart className={styles.box} data={data} title={"Completed Calls / HR"} stats={2418}/>
        <AreaChart className={styles.box} data={data} title={"Call Waiting"} stats={3}/>
        <AreaChart className={styles.box} data={data} title={"Average Score"} stats={84}/>
      </div>
      <MultilineChart callDurationData={callDurationData}/>
      <div className={styles.chartContainer}>
        <LineChart slaData={slaData}/>  
        <BarChart handleTimeData={handleTimeData} title={"Average Handle Time"}/>
      </div>
    </div>
  )
}

export default DashBoard