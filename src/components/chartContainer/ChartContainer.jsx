import React from 'react'
import styles from './chartContainer.module.css'

const ChartContainer = ({children}) => {
  return (
    <div className={styles.chartContainer}>
        {children}
    </div>
  )
}

export default ChartContainer