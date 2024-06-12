import React, {useState, useEffect, useRef} from 'react'
import * as d3 from 'd3'

import styles from './multilineChart.module.css'

import ChartContainer from '../chartContainer/ChartContainer'

const MultilineChart = ({callDurationData}) => {
    
    const svgRef = useRef()

    useEffect(() => {
        const margin = {top: 40, right: 20, bottom: 20, left: 10};
        const width = 1000 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        // set the dimensions and margins of the graph
        const svg = d3.select(svgRef.current)
                        .attr('width', width )
                        .attr('height', height + margin.top + margin.bottom)
                        .append('g')
                        .attr('transform', `translate(${margin.left},${margin.top})`)
                        .style('color', "#98A2B3");

        // set the ranges
        const x = d3.scaleBand().domain(callDurationData.map(d => d.date)).range([0, width]);
        const y = d3.scaleLinear().domain([0, d3.max(callDurationData, d => d.callTake) + 1]).range([height, 0]);

        // define the 1st line
        const valueline = d3.line()
                            .x(d => x(d.date) + x.bandwidth() / 2)
                            .y(d => y(d.callHold))
                            .curve(d3.curveCatmullRom.alpha(0.4));

        // define the 2nd line
        const valueline2 = d3.line()
                             .x(d => x(d.date) + x.bandwidth() / 2)
                             .y(d => y(d.callTake))
                             .curve(d3.curveCatmullRom.alpha(0.4));


        svg.append('g')
           .attr('transform', `translate(0,${height})`)
           .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
           .call(g => g.select(".domain").remove())

        // setting horizontal line in chart
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickSize(0))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - margin.left - margin.right)
                .attr("stroke-opacity", 0.1))

        svg.append('text')
            .attr("x", margin.left + 30)             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("fill", "white")
            .text("Call Duration");

        svg.append("circle").attr("cx",700).attr("cy", 0 - (margin.top / 2)).attr("r", 6).style("fill", "#A363FF")
        svg.append("text").attr("x", 720).attr("y",  0 - (margin.top / 2)).text("Hold Time (min)").style("font-size", "15px").style("fill", "white").style("padding", "10px").attr("alignment-baseline","middle")
        svg.append("circle").attr("cx",850).attr("cy", 0 - (margin.top / 2)).attr("r", 6).style("fill", "#00FF9E")
        svg.append("text").attr("x", 870).attr("y",  0 - (margin.top / 2)).text("Talk Time").style("font-size", "15px").style("fill", "white").style("padding", "10px").attr("alignment-baseline","middle")


        // // Scale the range of the data
        // x.domain(d3.extent(data, function(d) { return d.date; }));
        // y.domain([0, d3.max(data, function(d) {
        //     return Math.max(d.close, d.open); })]);

        // Add the valueline1 path.
        svg.append("path")
        .data([callDurationData])
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "#00FF9E")
        .attr("d", valueline)

        // Add the valueline2 path.
        svg.append("path")
        .data([callDurationData])
        .attr("fill", 'none')
        .attr("class", "line")
        .style("stroke", "#A363FF")
        .attr("d", valueline2);
}, [callDurationData]);

return (
    <ChartContainer>
        <svg ref={svgRef}></svg>
    </ChartContainer>
  )
}

export default MultilineChart