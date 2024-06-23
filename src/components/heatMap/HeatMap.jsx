import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./heatMap.module.css";

const HeatMap = ({ data, title }) => {
    const svgContainer = useRef(null);
    const svgRef = useRef(null);

    const [width, setWidth] = useState();

    // Define height and other constants
    const height = 600;
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const time = [
        "0:00",
        "1:00",
        "2:00",
        "3:00",
        "4:00",
        "5:00",
        "6:00",
        "7:00",
        "8:00",
        "9:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
    ];

    useEffect(() => {
        // Function to calculate SVG container size
        const getSvgContainerSize = () => {
            // subtract padding 24 * 2
            const newWidth = svgContainer.current.offsetWidth - 48;
            setWidth(newWidth);
        };

        // Initial size calculation and resize listener
        getSvgContainerSize();
        window.addEventListener("resize", getSvgContainerSize);

        // Cleanup event listener
        return () => {
            window.removeEventListener("resize", getSvgContainerSize);
        };
    }, []);

    useEffect(() => {
        if (!width || !data) return; // Exit early if width or data is not ready

        // Clear previous content
        d3.select(svgRef.current).selectAll("*").remove();

        // Define margins
        const margin = { top: 15, right: 30, bottom: 40, left: 40 };

        // Define scales
        const xScale = d3
            .scaleBand()
            .domain(day)
            .range([0, width - margin.right])
            .paddingInner(0.05);

        const yScale = d3
            .scaleBand()
            .domain(time)
            .range([height - margin.bottom, margin.top])
            .paddingInner(0.1);

        // Define color scale
        const color = d3
            .scaleLinear()
            .range(["#48494B", "#00FF9E"]) // Example color range
            .domain([200, 800]); // Example domain

        // Create SVG container
        const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

        // Create container for heatmap and apply margins
        const container = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add X axis
        container
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickSize(0))
            .select(".domain")
            .remove();

        // Add Y axis
        container
            .append("g")
            .call(d3.axisLeft(yScale).tickSize(0).tickPadding(10))
            .select(".domain")
            .remove();

        // Render heatmap rectangles
        container
            .selectAll()
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d) => xScale(d.day))
            .attr("y", (d) => yScale(d.time))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .style("fill", (d) => color(d.value));
    }, [width, data]); // Depend on width and data changes

    return (
        <div ref={svgContainer} className={styles.container}>
            <div className={styles.title}>{title}</div>
            <svg ref={svgRef} className={styles.svgContainer} />
        </div>
    );
};

export default HeatMap;
