import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ChartContainer from '../chartContainer/ChartContainer';

const LineChart = ({slaData}) => {
  const svgRef = useRef();

  useEffect(() => {
    // setting up svg container
    const margin = { top: 40, right: 30, bottom: 20, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .style("color", "#98A2B3");

    // setting the scaling
    const x = d3.scaleBand()
                .domain(slaData.map(d => d.month))
                .range([0, width]);

    const y = d3.scaleLinear()
                .domain([0, d3.max(slaData, d => d.sla)])
                .range([height, 0]);

    // setting the line
    const line = d3.line()
      .x(d => x(d.month) + x.bandwidth() / 2)
      .y(d => y(d.sla));

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
      .call(g => g.select(".domain").remove())

    svg.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select(".domain").remove())

    svg.append('path')
      .datum(slaData)
      .attr('fill', 'none')
      .attr('stroke', '#A363FF')
      .attr('stroke-width', 4)
      .attr('d', line);

    // setting the title
    svg.append('text')
        .attr("x", -10)             
        .attr("y", -20)
        .attr("text-anchor", "start")  
        .style("font-size", "16px") 
        .style("fill", "#D0D5DD")
        .text(`Service Level Agreement`);

  }, [slaData]);

  return (
    <ChartContainer>
      <svg ref={svgRef}></svg>
    </ChartContainer>
  )
};

export default LineChart;
