// import { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
// import ChartContainer from "../chartContainer/ChartContainer";

// import styles from "./lineChart.module.css";

// const LineChart = ({ slaData, title }) => {
//     const parseDate = d3.timeParse("%Y-%m");

//     slaData = slaData?.map((data) => ({
//         date: parseDate(data.date),
//         sla: data.sla,
//     }));

//     const svgRef = useRef();

//     useEffect(() => {
//         const margin = { top: 20, right: 40, bottom: 20, left: 50 };
//         const width = 700 - margin.left - margin.right;
//         const height = 250 - margin.top - margin.bottom;

//         // setting the svg container
//         const svg = d3
//             .select(svgRef.current)
//             // .attr("width", width)
//             // .attr("height", height + margin.top + margin.bottom)
//             .attr("viewBox", [0, 0, 700, 250])
//             .attr("class", styles.svgContainer)
//             .append("g")
//             .attr("transform", `translate(${margin.left},${margin.top})`);

//         // setting the scales
//         const x = d3
//             .scaleTime()
//             .domain(d3.extent(slaData, (d) => d.date))
//             .range([0, width]);

//         const y = d3
//             .scaleLinear()
//             .domain([0, d3.max(slaData, (d) => d.sla)])
//             .nice()
//             .range([height, 0]);

//         // setting the axis
//         svg.append("g")
//             .attr("transform", `translate(0,${height})`)
//             .call(d3.axisBottom(x).tickSize(0).tickPadding(20).tickFormat(d3.timeFormat("%b")))
//             .call((g) => g.select(".domain").remove())
//             .style("font-size", "12px");

//         svg.append("g")
//             .call(d3.axisLeft(y).tickSize(0).tickPadding(30))
//             .call((g) => g.select(".domain").remove())
//             .style("font-size", "12px");

//         // setting the title
//         svg.append("text")
//             .attr("x", -40)
//             .attr("y", -20)
//             .attr("text-anchor", "start")
//             .attr("class", styles.title)
//             .text(`${title}`);

//         // Line generator
//         const line = d3
//             .line()
//             .x((d) => x(d.date))
//             .y((d) => y(d.sla));

//         // Draw the line
//         svg.append("path")
//             .datum(slaData)
//             .attr("fill", "none")
//             .attr("stroke", "#A363FF")
//             .attr("stroke-width", 2)
//             .attr("d", line)
//             .on("pointerenter pointermove", pointermoved)
//             .on("pointerleave", pointerleft)
//             .on("touchstart", (event) => event.preventDefault());

//         const tooltip = svg.append("g");

//         function formatDate(date) {
//             return date.toLocaleString("en", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//             });
//         }
//         const bisect = d3.bisector((d) => d.date).center;

//         function pointermoved(event) {
//             const i = bisect(slaData, x.invert(d3.pointer(event)[0]));
//             tooltip.style("display", null);
//             tooltip.attr("transform", `translate(${x(slaData[i].date)},${y(slaData[i].sla)})`);

//             const path = tooltip
//                 .selectAll("path")
//                 .data([,])
//                 .join("path")
//                 .attr("class", styles.tooltip);

//             const text = tooltip
//                 .selectAll("text")
//                 .data([,])
//                 .join("text")
//                 .call((text) =>
//                     text
//                         .selectAll("tspan")
//                         .data([formatDate(slaData[i].date), slaData[i].sla])
//                         .join("tspan")
//                         .attr("x", 0)
//                         .attr("y", (_, i) => `${i * 1.1}em`)
//                         .attr("font-weight", (_, i) => (i ? null : "bold"))
//                         .attr("fill", "white")
//                         .style("font-size", "12px")
//                         .text((d) => d)
//                 );
//             size(text, path);
//         }

//         function pointerleft() {
//             tooltip.style("display", "none");
//         }

//         // Wraps the text with a callout path of the correct size, as measured in the page.
//         function size(text, path) {
//             const { x, y, width: w, height: h } = text.node().getBBox();
//             text.attr("transform", `translate(${-w / 2},${15 - y})`);
//             path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
//         }
//     }, [slaData]);

//     return (
//         <>
//             {/* <div className={styles.container}> */}
//             {/* <ChartContainer> */}
//             <svg ref={svgRef}></svg>
//             {/* </ChartContainer> */}
//             {/* </div> */}
//         </>
//     );
// };

// export default LineChart;

// import { useRef, useEffect, useState } from "react";
// import * as d3 from "d3";

// import styles from "./lineChart.module.css";

// const LineChart = ({ slaData, title }) => {
//     const svgContainer = useRef(null);
//     const svgRef = useRef(null);
//     const tooltipRef = useRef(null);

//     const parseDate = d3.timeParse("%Y-%m");
//     slaData = slaData?.map((data) => ({
//         date: parseDate(data.date),
//         sla: data.sla,
//     }));

//     const [width, setWidth] = useState();
//     const height = 250;

//     // This function calculates width and height of the container
//     const getSvgContainerSize = () => {
//         const newWidth = svgContainer.current.offsetWidth;
//         setWidth(newWidth);
//     };

//     useEffect(() => {
//         getSvgContainerSize();
//         window.addEventListener("resize", getSvgContainerSize);
//         // cleanup event listener
//         return () => window.removeEventListener("resize", getSvgContainerSize);
//     }, []);

//     useEffect(() => {
//         // Dimensions
//         let dimensions = {
//             width: width,
//             height: height,
//             margins: 20,
//         };

//         dimensions.containerWidth = dimensions.width - dimensions.margins * 4;
//         dimensions.containerHeight = dimensions.height - dimensions.margins * 2;
//         console.log(dimensions);

//         // setting the svg container
//         const svg = d3
//             .select(svgRef.current)
//             .attr("width", dimensions.width)
//             .attr("height", dimensions.height);

//         // clear all previous content on refresh
//         const everything = svg.selectAll("*");
//         everything.remove();

//         // setting the scales
//         const xScale = d3
//             .scaleTime()
//             .domain(d3.extent(slaData, (d) => d.date))
//             .range([0, dimensions.containerWidth])
//             .nice();

//         const yScale = d3
//             .scaleLinear()
//             .domain([0, d3.max(slaData, (d) => d.sla)])
//             .range([dimensions.containerHeight, 0])
//             .nice();

//         const container = svg
//             .append("g")
//             .classed("container", true)
//             .attr("transform", `translate(${dimensions.margins}, ${dimensions.margins})`);

//         // setting the axis
//         const xAxis = d3
//             .axisBottom(xScale)
//             .tickSize(0)
//             .tickPadding(10)
//             .tickFormat(d3.timeFormat("%b"));

//         const yAxis = d3
//             .axisLeft(yScale)
//             .tickSize(0)
//             .tickPadding(0)
//             .tickFormat((d) => `${d}`);

//         // Line Generator
//         const lineGenerator = d3
//             .line()
//             .x((d) => xScale(d.date))
//             .y((d) => yScale(d.sla));

//         // Draw Line
//         container
//             .append("path")
//             .datum(slaData)
//             .attr("fill", "none")
//             .attr("stroke", "#A363FF")
//             .attr("stroke-width", 2)
//             .attr("d", lineGenerator);

//         // Axis

//         const yAxisGroup = container.append("g").classed("yAxis", true).call(yAxis);

//         // y-axis label
//         yAxisGroup
//             .append("text")
//             .attr("x", -dimensions.containerHeight / 2)
//             .attr("y", -dimensions.margins)
//             .attr("fill", "black")
//             .style("font-size", ".8rem")
//             .style("transform", "rotate(270deg)")
//             .style("text-anchor", "middle");

//         container
//             .append("g")
//             .classed("xAxis", true)
//             .style("transform", `translateY(${dimensions.containerHeight}px)`)
//             .call(xAxis);

//         // const tooltip = d3.select(tooltipRef.current);
//         // const tooltipDot = container
//         //     .append("circle")
//         //     .classed("tool-tip-dot", true)
//         //     .attr("r", 5)
//         //     .attr("fill", "#fc8781")
//         //     .attr("stroke", "black")
//         //     .attr("stroke-width", 2)
//         //     .style("opacity", 0)
//         //     .style("pointer-events", "none");

//         // Tooltip
//         // container
//         //     .append("rect")
//         //     .classed("mouse-tracker", true)
//         //     .attr("width", dimensions.containerWidth)
//         //     .attr("height", dimensions.containerHeight)
//         //     .style("opacity", 0)
//         //     .on("touchmouse mousemove", function (event) {
//         //         const mousePos = d3.pointer(event, this);

//         //         // x coordinate stored in mousePos index 0
//         //         const date = xScale.invert(mousePos[0]);

//         //         // Custom Bisector - left, center, right
//         //         const dateBisector = d3.bisector(xAccessor).center;

//         //         const bisectionIndex = dateBisector(Data, date);
//         //         //console.log(bisectionIndex);
//         //         // math.max prevents negative index reference error
//         //         const hoveredIndexData = Data[Math.max(0, bisectionIndex)];

//         //         // Update Image
//         //         tooltipDot
//         //             .style("opacity", 1)
//         //             .attr("cx", xScale(xAccessor(hoveredIndexData)))
//         //             .attr("cy", yScale(yAccessor(hoveredIndexData)))
//         //             .raise();

//         //         tooltip
//         //             .style("display", "block")
//         //             .style("top", `${yScale(yAccessor(hoveredIndexData)) - 50}px`)
//         //             .style("left", `${xScale(xAccessor(hoveredIndexData))}px`);

//         //         tooltip.select(".data").text(`${yAccessor(hoveredIndexData)}`);

//         //         const dateFormatter = d3.timeFormat("%B");

//         //         tooltip.select(".date").text(`${dateFormatter(xAccessor(hoveredIndexData))}`);
//         //     })
//         //     .on("mouseleave", function () {
//         //         tooltipDot.style("opacity", 0);
//         //         tooltip.style("display", "none");
//         //     });
//     }, [slaData, width, height]);

//     return (
//         <div ref={svgContainer} className={styles.container}>
//             <div className={styles.title}>sdkjlksjfds</div>
//             <svg ref={svgRef} />
//             {/* <div ref={tooltipRef} className="lc-tooltip">
//                 <div className="data"></div>
//                 <div className="date"></div>
//             </div> */}
//         </div>
//     );
// };

// export default LineChart;

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import styles from "./lineChart.module.css";

const LineChart = ({ slaData, title }) => {
    const svgContainer = useRef(null);
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);

    const parseDate = d3.timeParse("%Y-%m-%d");
    slaData = slaData?.map((data) => ({
        date: parseDate(data.date),
        sla: data.sla,
    }));

    const [width, setWidth] = useState();
    const height = 250;

    // This function calculates width and height of the container
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

    useEffect(() => {
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
            .classed("container", true)
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
            // .call((g) =>
            //     g.selectAll(".tick line").clone().attr("x2", width).attr("stroke-opacity", 0.1)
            // )
            .style("font-size", "12px");

        // Line Generator
        const lineGenerator = d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.sla));

        // Draw Line
        container
            .append("path")
            .datum(slaData)
            .attr("fill", "none")
            .attr("stroke", "#A363FF")
            .attr("stroke-width", 2)
            .attr("d", lineGenerator);

        // Axis

        // const yAxisGroup = container.append("g").classed("yAxis", true).call(yAxis);

        // y-axis label
        // yAxisGroup
        //     .append("text")
        //     .attr("x", -dimensions.containerHeight / 2)
        //     .attr("y", -dimensions.margins)
        //     .attr("fill", "black")
        //     .style("font-size", ".8rem")
        //     .style("transform", "rotate(270deg)")
        //     .style("text-anchor", "middle");

        // container
        //     .append("g")
        //     .classed("xAxis", true)
        //     .style("transform", `translateY(${dimensions.containerHeight}px)`)
        //     .call(xAxis);

        // const tooltip = d3.select(tooltipRef.current);
        // const tooltipDot = container
        //     .append("circle")
        //     .classed("tool-tip-dot", true)
        //     .attr("r", 5)
        //     .attr("fill", "#fc8781")
        //     .attr("stroke", "black")
        //     .attr("stroke-width", 2)
        //     .style("opacity", 0)
        //     .style("pointer-events", "none");

        // Tooltip
        // container
        //     .append("rect")
        //     .classed("mouse-tracker", true)
        //     .attr("width", dimensions.containerWidth)
        //     .attr("height", dimensions.containerHeight)
        //     .style("opacity", 0)
        //     .on("touchmouse mousemove", function (event) {
        //         const mousePos = d3.pointer(event, this);

        //         // x coordinate stored in mousePos index 0
        //         const date = xScale.invert(mousePos[0]);

        //         // Custom Bisector - left, center, right
        //         const dateBisector = d3.bisector(xAccessor).center;

        //         const bisectionIndex = dateBisector(Data, date);
        //         //console.log(bisectionIndex);
        //         // math.max prevents negative index reference error
        //         const hoveredIndexData = Data[Math.max(0, bisectionIndex)];

        //         // Update Image
        //         tooltipDot
        //             .style("opacity", 1)
        //             .attr("cx", xScale(xAccessor(hoveredIndexData)))
        //             .attr("cy", yScale(yAccessor(hoveredIndexData)))
        //             .raise();

        //         tooltip
        //             .style("display", "block")
        //             .style("top", `${yScale(yAccessor(hoveredIndexData)) - 50}px`)
        //             .style("left", `${xScale(xAccessor(hoveredIndexData))}px`);

        //         tooltip.select(".data").text(`${yAccessor(hoveredIndexData)}`);

        //         const dateFormatter = d3.timeFormat("%B");

        //         tooltip.select(".date").text(`${dateFormatter(xAccessor(hoveredIndexData))}`);
        //     })
        //     .on("mouseleave", function () {
        //         tooltipDot.style("opacity", 0);
        //         tooltip.style("display", "none");
        //     });
    }, [slaData, width, height]);

    return (
        <div ref={svgContainer} className={styles.container}>
            <div className={styles.title}>{title}</div>
            <svg ref={svgRef} className={styles.svgContainer} />
            {/* <div ref={tooltipRef} className="lc-tooltip">
                <div className="data"></div>
                <div className="date"></div>
            </div> */}
        </div>
    );
};

export default LineChart;
