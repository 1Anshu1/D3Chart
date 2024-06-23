// import React, { useState, useEffect, useRef } from "react";
// import * as d3 from "d3";

// import styles from "./barchart.module.css";

// const BarChart = ({ handleTimeData, title }) => {
//     const svgRef = useRef();

//     useEffect(() => {
//         // setting up svg container
//         const margin = { top: 30, right: 0, bottom: 20, left: 30 };
//         const width = 400 - margin.left - margin.right;
//         const height = 250 - margin.top - margin.bottom;
//         const svg = d3
//             .select(svgRef.current)
//             .attr("height", height + margin.top + margin.bottom)
//             .attr("viewBox", [0, 0, 400, 250])
//             .attr("class", styles.svgContainer)
//             .append("g")
//             .attr("transform", `translate(${margin.left},${margin.top})`);

//         // setting the scales
//         const xScale = d3
//             .scaleBand()
//             .domain(handleTimeData?.map((val) => val.week))
//             .range([0, width])
//             .paddingInner(0.5);

//         const yScale = d3
//             .scaleLinear()
//             .domain([
//                 d3.min(handleTimeData, (d) => d.handleTime) - 0.5,
//                 d3.max(handleTimeData, (d) => d.handleTime),
//             ])
//             .range([height, 0]);

//         // setting the axes
//         const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10);
//         const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(16);

//         svg.append("g")
//             .call(xAxis)
//             .call((g) => g.select(".domain").remove())
//             .attr("transform", `translate(0, ${height})`);

//         svg.append("g")
//             .call(yAxis)
//             .call((g) => g.select(".domain").remove());

//         // setting the svg data
//         svg.selectAll()
//             .data(handleTimeData)
//             .join("rect")
//             .attr("x", (d) => xScale(d.week))
//             .attr("y", (d) => yScale(d.handleTime))
//             .attr("width", xScale.bandwidth())
//             .attr("height", (d) => height - yScale(d.handleTime))
//             .attr("fill", (d) =>
//                 d.handleTime === d3.max(handleTimeData, (d) => d.handleTime) ? "#A363FF" : "#D0D5DD"
//             )
//             .append("title")
//             .text((d) => d.handleTime);

//         // setting the title
//         svg.append("text")
//             .attr("x", -margin.left)
//             .attr("y", -20)
//             .attr("text-anchor", "start")
//             .attr("class", styles.title)
//             .text(`${title}`);
//     }, [handleTimeData]);

//     return (
//         <>
//             <svg ref={svgRef} preserveAspectRatio="none" className={styles.svgContainer}></svg>
//         </>
//     );
// };

// export default BarChart;

import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
// import debounce from "lodash/debounce";
// import { useResize } from "../../hooks/useResize";

import styles from "./barchart.module.css";

const BarChart = ({ data, title }) => {
    const svgContainer = useRef(null);
    const svgRef = useRef(null);

    const [width, setWidth] = useState();
    const height = 250;

    const getSvgContainerSize = () => {
        // subtract padding 24 * 2
        const newWidth = svgContainer.current.offsetWidth - 48;
        setWidth(newWidth);
    };

    useEffect(() => {
        getSvgContainerSize();
        window.addEventListener("resize", getSvgContainerSize);
        // cleanup event listener
        return () => window.removeEventListener("resize", getSvgContainerSize);
    }, []);

    useEffect(() => {
        if (!width || !data) {
            return;
        }

        const margin = { top: 15, right: 30, bottom: 40, left: 20 };

        // setting the svg container
        const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

        // clear all previous content on refresh
        const everything = svg.selectAll("*");
        everything.remove();

        // setting the scales
        const xScale = d3
            .scaleBand()
            .domain(data?.map((val) => val.week))
            .range([margin.left, width - margin.right])
            .paddingInner(0.5);

        const yScale = d3
            .scaleLinear()
            .domain([d3.min(data, (d) => d.handleTime) - 1, d3.max(data, (d) => d.handleTime) + 1])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const container = svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // setting the axes
        const xAxis = d3.axisBottom().scale(xScale).tickSize(0).tickPadding(10);

        const yAxis = d3.axisLeft().scale(yScale).tickSize(0).tickPadding(20);

        container
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis)
            .call((g) => g.select(".domain").remove())
            .style("font-size", "12px");

        container
            .append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis)
            .call((g) => g.select(".domain").remove())
            // .call((g) =>
            //     g.selectAll(".tick line").clone().attr("x2", width).attr("stroke-opacity", 0.1)
            // )
            .style("font-size", "12px");

        // setting the svg data
        container
            .selectAll()
            .data(data)
            .join("rect")
            .attr("rx", 4)
            .attr("x", (d) => xScale(d.week))
            .attr("y", (d) => yScale(d.handleTime))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => height - margin.bottom - yScale(d.handleTime))
            // .attr("height", (d) => height - yScale(d.handleTime))
            .attr("fill", (d) =>
                d.handleTime === d3.max(data, (d) => d.handleTime) ? "#A363FF" : "#D0D5DD"
            )
            .append("title")
            .text((d) => d.handleTime);
    }, [width, height, data]);

    return (
        <div ref={svgContainer} className={styles.container}>
            <div className={styles.title}>{title}</div>
            <svg ref={svgRef} className={styles.svgContainer} />
        </div>
    );
};

export default BarChart;
