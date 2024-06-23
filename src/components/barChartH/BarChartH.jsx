import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

import styles from "./barChartH.module.css";

const BarChartH = ({ data, title }) => {
    const svgContainer = useRef(null);
    const svgRef = useRef(null);

    const [width, setWidth] = useState();
    const height = 250;

    // sort data
    data.sort(function (b, a) {
        return a.value - b.value;
    });

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

        const margin = { top: 10, right: 0, bottom: 20, left: 0 };

        // setting the svg container
        const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

        // clear all previous content on refresh
        const everything = svg.selectAll("*");
        everything.remove();

        // setting the scales
        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value) + 5])
            .range([margin.left, width - margin.right]);

        const yScale = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([margin.top, height - margin.bottom]);
        // .range([height - margin.bottom, margin.top]);

        const container = svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // setting the color scale
        const colorScale = d3
            .scaleLinear()
            .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
            .range(["#27E376", "#072B15"]);

        // setting the bar
        container
            .selectAll()
            .data(data)
            .enter()
            .append("rect")
            .attr("x", xScale(0))
            .attr("y", (d) => yScale(d.name))
            .attr("height", yScale.bandwidth())
            .attr("width", (d) => xScale(d.value))
            .attr("fill", (d) => colorScale(d.value));
        // .attr("rx", function (d, i) {
        //     // Calculate different radii for each corner
        //     if (i === 0) {
        //         return 6; // top-left rounded
        //     } else if (i === data.length - 1) {
        //         return 0; // top-right not rounded
        //     } else {
        //         return 0; // no rounding for other bars
        //     }
        // })
        // .attr("ry", function (d, i) {
        //     // Calculate different radii for each corner
        //     if (i === 0) {
        //         return 6; // top-left rounded
        //     } else if (i === data.length - 1) {
        //         return 0; // top-right not rounded
        //     } else {
        //         return 0; // no rounding for other bars
        //     }
        // });

        // Add labels inside bars
        container
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("text")
            .attr("class", styles.barLabel)
            .attr("x", xScale(1))
            .attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em") // Vertical alignment
            .text((d) => d.name);

        container
            .selectAll(".bar-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", styles.barValue)
            .attr("x", (d) => xScale(d.value) + 20)
            .attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .text((d) => `${d.value}%`);
    }, [data, width, height]);

    return (
        <div ref={svgContainer} className={styles.container}>
            <div className={styles.title}>{title}</div>
            <svg ref={svgRef} className={styles.svgContainer} />
        </div>
    );
};

export default BarChartH;
