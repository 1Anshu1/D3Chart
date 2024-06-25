import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import styles from "./lineChart.module.css";
import { useResize } from "../../hooks/useResize";

const LineChart = ({ slaData, title, height }) => {
    const svgContainer = useRef(null);
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);

    const parseDate = d3.timeParse("%Y-%m-%d");
    slaData = slaData?.map((data) => ({
        date: parseDate(data.date),
        sla: data.sla,
    }));

    const [width, setWidth] = useState();

    const getSvgContainerSize = () => {
        const newWidth = svgContainer.current.offsetWidth;
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
        if (!width || !slaData) {
            return;
        }
        const margin = { top: 15, right: 40, bottom: 40, left: 20 };

        // setting the svg container
        const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

        // clear all previous content on refresh
        const everything = svg.selectAll("*");
        everything.remove();

        // setting the scales
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(slaData, (d) => d.date))
            .range([margin.left, width - margin.right])
            .nice();

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(slaData, (d) => d.sla)])
            .range([height - margin.bottom, margin.top])
            .nice();

        const container = svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // setting the axis
        const xAxis = d3
            .axisBottom(xScale)
            .tickSize(0)
            .tickPadding(10)
            .tickFormat(d3.timeFormat("%b"));

        const yAxis = d3
            .axisLeft(yScale)
            .tickSize(0)
            .tickPadding(20)
            .tickFormat((d) => `${d}`);

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

        // Line Generator
        const lineGenerator = d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.sla));

        // Draw Line
        const path = container
            .append("path")
            .datum(slaData)
            .attr("fill", "none")
            .attr("stroke", "#A363FF")
            .attr("stroke-width", 2)
            .attr("d", lineGenerator);

        // Mouseover and Mouseout event handlers
        path.on("mouseover", function () {
            console.log(dots);
            dots.style("visibility", "visible");
            d3.select(this).attr("stroke-width", 2); // Increase stroke width on hover
        }).on("mouseout", function () {
            dots.style("visibility", "hidden");
            d3.select(this).attr("stroke-width", 2); // Revert stroke width on mouseout
        });

        // Tooltip
        const tooltip = d3.select(tooltipRef.current).style("opacity", 1);

        // Dots (Circles)
        const dots = container
            .selectAll("circle")
            .data(slaData)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(d.date))
            .attr("cy", (d) => yScale(d.sla))
            .attr("r", 4)
            .attr("fill", "#A363FF")
            .style("visibility", "hidden");

        // Mouseover and Mouseout event handlers for dots
        dots.on("mouseover", function (e, data) {
            e.preventDefault();
            tooltip.style("visibility", "visible");
            tooltip
                .html(`<div>SLA: ${data.sla}</div>`)
                .style("left", `${e.pageX}px`)
                .style("top", `${e.pageY - 28}px`);
        }).on("mouseout", function (e) {
            e.preventDefault();
            tooltip.style("visibility", "hidden");
        });
    }, [slaData, width, height]);

    return (
        <div ref={svgContainer} className={styles.container}>
            <div className={styles.title}>{title}</div>
            <svg ref={svgRef} className={styles.svgContainer} />
            <div ref={tooltipRef} className={styles.tooltip}></div>
        </div>
    );
};

export default LineChart;
