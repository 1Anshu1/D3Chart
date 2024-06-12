import React, {useState, useEffect, useRef} from 'react'
import * as d3 from 'd3';

import styles from './barchart.module.css'
import ChartContainer from '../chartContainer/ChartContainer';

const BarChart = ({handleTimeData, title}) => {

    const svgRef = useRef()

    useEffect(() => {
        // setting up svg container
        const margin = { top: 40, right: 30, bottom: 20, left: 40 };
        const width = 400 - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;
        const svg = d3.select(svgRef.current)
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .attr('transform', `translate(${margin.left},${margin.top})`)
                    .style('overflow', 'visible')
                    .style('color', '#D0D5DD')

        // setting the scaling
        const xScale = d3.scaleBand()
                        .domain(handleTimeData.map((val) => val.week))
                        .range([0, width])
                        .padding(0.4)

        const yScale = d3.scaleLinear()
                        .domain([d3.min(handleTimeData, (d) => d.handleTime) - 0.5,  d3.max(handleTimeData, (d) => d.handleTime)])
                        .range([height, 0])
                        
        // setting the axes
        const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10)
        const yAxis = d3.axisLeft(yScale).tickSize(0)
        
        svg.append('g')
            .call(xAxis)
            .call(g => g.select(".domain").remove())
            .attr('transform', `translate(0, ${height})`)

        svg.append('g')
            .call(yAxis)
            .call(g => g.select(".domain").remove())

        // setting the svg data        
        svg.selectAll()
            .data(handleTimeData)
            .join('rect')
                .attr('x', (d) => xScale(d.week))
                .attr('y', (d) => yScale(d.handleTime))
                .attr('width', xScale.bandwidth())
                .attr('height', (d) => height - yScale(d.handleTime))
                .attr('fill', (d) => d.handleTime === d3.max(handleTimeData, (d) => d.handleTime) ? '#A363FF' : '#D0D5DD');

        // setting the title
        svg.append('text')
            .attr("x", -10)             
            .attr("y", -20)
            .attr("text-anchor", "start")  
            .style("font-size", "16px") 
            .style("fill", "#D0D5DD")
            .text(`${title}`);
    }, [handleTimeData]);

  return (
    <ChartContainer>
        {/* <div className={styles.title}>{title}</div> */}
        <svg ref={svgRef} className={styles.svgContainer}></svg>
    </ChartContainer>
  )
}

export default BarChart