import { useState, useEffect, useLayoutEffect } from "react";

export const useResize = (targetRef) => {
    console.log(targetRef.current);
    const getSize = () => {
        return {
            width: targetRef.current ? targetRef.current.offsetWidth : 0,
            height: targetRef.current ? targetRef.current.offsetHeight : 0,
        };
    };

    const [dimensions, setDimensions] = useState(getSize);

    const handleResize = () => {
        setDimensions(getSize());
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        // handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useLayoutEffect(() => {
        handleResize();
    }, []);

    return dimensions;
};
