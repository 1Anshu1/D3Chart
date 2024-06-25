import React from "react";
import styles from "./analysisContainer.module.css";
import arrow from "../../assets/icons/arrow.svg";

const AnalysisContainer = ({ title, value, time, incrementData }) => {
    console.log(title);
    const formatTime = (time) => {
        const min = (time / 60).toFixed(0);
        const sec = (time - min * 60) % 60;
        return `${min}min ${sec}sec`;
    };

    return (
        <div className={styles.miniContainer}>
            <div className={styles.title}>{title}</div>
            <div className="">
                <span className={styles.arrowContainer}>
                    {value && (
                        <span className={styles.boldText}>{value.toLocaleString("en-IN")}</span>
                    )}
                    {time && <span className={styles.boldText}>{formatTime(time)}</span>}
                    <img src={arrow} alt="arrow" className={styles.arrow} />
                    <span className={styles.greenText}>{incrementData}%</span>
                </span>
            </div>
        </div>
    );
};

export default AnalysisContainer;
