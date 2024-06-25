import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
// import debounce from "lodash/debounce";
// import { useResize } from "../../hooks/useResize";

import styles from "./barchart.module.css";
import { useResize } from "../../hooks/useResize";

const BarChart = ({ data, title, height }) => {
    const svgContainer = useRef(null);
    const svgRef = useRef(null);

    const [width, setWidth] = useState();

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

    // const width = useResize(svgContainer);

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
            .style("font-size", "12px");

        // setting the svg data
        container
            .selectAll()
            .data(data)
            .enter()
            .append("rect")
            .attr("rx", 4)
            .attr("x", (d) => xScale(d.week))
            .attr("y", (d) => yScale(d.handleTime))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => height - margin.bottom - yScale(d.handleTime))
            .attr("fill", (d) =>
                d.handleTime === d3.max(data, (d) => d.handleTime) ? "#A363FF" : "#D0D5DD"
            )
            .on("mouseover", function (e, data) {
                tooltip.html(`<div>${data.handleTime}</div>`).style("visibility", "visible");
            })
            .on("mousemove", function (e) {
                tooltip.style("top", e.pageY - 10 + "px").style("left", e.pageX + 10 + "px");
            })
            .on("mouseout", function () {
                tooltip.html(``).style("visibility", "hidden");
            });

        const tooltip = d3.select(svgContainer.current).append("div").attr("class", styles.tooltip);
    }, [width, height, data]);

    return (
        <div ref={svgContainer} className={styles.container}>
            <div className={styles.title}>{title}</div>
            <svg ref={svgRef} className={styles.svgContainer} />
        </div>
    );
};

export default BarChart;
