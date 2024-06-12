import React, {useState, useEffect, useRef} from 'react'
import styles from './areaChart.module.css'
import * as d3 from 'd3'
import ChartContainer from '../chartContainer/ChartContainer'

const AreaChart = ({data, title, stats}) => {

    const svgRef = useRef();    

    useEffect(() => {
        const width = 100;
        const height = 40;
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;

        // declare the svg container
        const svg = d3.select(svgRef.current)
                      .attr('width', width)
                      .attr('height', height)
                      .style('overflow', 'visible')
                      .style("color", "white")
                      .attr("fill", "white")

        // Declare the x scale.
        const xScale = d3.scaleBand()
                         .domain(data.map(d => d.month))
                         .range([0, width])
                         
        // Declare the y scale.
        const yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.call)])
                    .range([height, 0]);
        
        const line = d3.line()
                       .x(d => xScale(d.month))
                       .y(d => yScale(d.call));

        // svg.append('g')
        //    .attr('transform', `translate(0,${height})`)
        // //    .call(d3.axisBottom(xScale).tickSize(0))
        //    .call(g => g.select(".domain").remove())
    
        // svg.append('g')
        //     // .call(d3.axisLeft(yScale).tickSize(0))
        //     .call(g => g.select(".domain").remove())
    
        svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#00FF9E')
        .attr('stroke-width', 2)
        .attr('d', line)

        
                    
    })
    
  return (
    <div className={styles.container}>
      <ChartContainer>
        <div className={styles.headerContainer}>
          <span className={styles.title}>{title}</span>
          <span className={styles.growth}>{12}%</span>
        </div>
        <div className={styles.bottomContainer}>
          <span className={styles.stats}>{stats.toLocaleString('en-IN')}</span>
          <svg ref={svgRef} className={styles.svgContainer}></svg>
        </div>
      </ChartContainer>
    </div>
  )
}

export default AreaChart