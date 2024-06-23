import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./backlog.module.css";

const BacklogData = ({ backlogData, title, legendColor }) => {
    const svgContainer = useRef(null);
    const svgRef = useRef(null);

    const [width, setWidth] = useState();
    const height = 300;

    const parseDate = d3.timeParse("%Y-%m-%d");
    backlogData = backlogData?.map((data) => ({
        date: parseDate(data.date),
        params: data.params,
        data: data.data,
    }));

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
        if (!width || !backlogData) {
            return;
        }

        const margin = { top: 15, right: 30, bottom: 40, left: 25 };

        // Determine the series that needed to be stack
        const series = d3
            .stack()
            .keys(d3.union(backlogData.map((d) => d.params)))
            .value(([, D], key) => D.get(key).data)(
            d3.index(
                backlogData,
                (d) => d.date,
                (d) => d.params
            )
        );

        // setting the svg container
        const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

        // clear all previous content on refresh
        const everything = svg.selectAll("*");
        everything.remove();

        // setting the scales
        const xScale = d3
            .scaleBand()
            .domain(backlogData?.map((val) => val.date))
            .range([margin.left, width - margin.right])
            .paddingInner(0.5);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const color = d3
            .scaleOrdinal()
            .domain(series.map((d) => d.key))
            .range(d3.schemeSpectral[series.length])
            .range(legendColor)
            .unknown("#ff3322");

        const container = svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // setting the axes
        const xAxis = d3
            .axisBottom()
            .scale(xScale)
            .tickSize(0)
            .tickPadding(10)
            .tickFormat((d, idx) => `T-${idx}`);
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

        container
            .selectAll()
            .data(series)
            .join("g")
            .attr("fill", (d) => color(d.key))
            .selectAll("rect")
            .data((D) => D.map((d) => ((d.keys = D.key), d)))
            // .data((D) => D.map((d) => (d.key = )))
            .join("rect")
            .attr("x", (d) => xScale(d.data[0]))
            .attr("y", (d) => yScale(d[1]))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => yScale(d[0]) - yScale(d[1]));
        // .attr("height", (d) => height - yScale(d.handleTime))
        // .attr("fill", (d) =>
        //     d.handleTime === d3.max(handleTimeData, (d) => d.handleTime) ? "#A363FF" : "#D0D5DD"
        // )
        // .append("title")
        // .text((d) => d.handleTime);
    }, [width, height, backlogData]);

    return (
        <div ref={svgContainer} className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>{title}</div>
                <div className={styles.legendContainer}>
                    <span className={styles.legend}>
                        <div className={`${styles.circle} ${styles.received}`}></div>
                        <div className={styles.label}>Received</div>
                    </span>
                    <span className={styles.legend}>
                        <div className={`${styles.circle} ${styles.sent}`}></div>
                        <div className={styles.label}>Sent</div>
                    </span>{" "}
                    <span className={styles.legend}>
                        <div className={`${styles.circle} ${styles.dailyBacklog}`}></div>
                        <div className={styles.label}>Daily Backlog</div>
                    </span>{" "}
                    <span className={styles.legend}>
                        <div className={`${styles.circle} ${styles.netBacklog}`}></div>
                        <div className={styles.label}>Net Backlog</div>
                    </span>
                </div>
            </div>
            <svg ref={svgRef} className={styles.svgContainer} />
        </div>
    );
};

export default BacklogData;
