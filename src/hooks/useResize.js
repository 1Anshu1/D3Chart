import { useState, useEffect } from "react";

export const useResize = (targetRef) => {
    const [width, setWidth] = useState();

    const getSvgContainerSize = () => {
        const newWidth = targetRef.current.offsetWidth - 48;
        setWidth(newWidth);
    };
    useEffect(() => {
        getSvgContainerSize();
        window.addEventListener("resize", getSvgContainerSize);
        // cleanup event listener
        return () => window.removeEventListener("resize", getSvgContainerSize);
    }, []);

    return width;
};
