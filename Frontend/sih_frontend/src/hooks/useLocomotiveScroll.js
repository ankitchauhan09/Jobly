
import { useRef, useEffect } from 'react'
import LocomotiveScroll from 'locomotive-scroll'

const useLocomotiveScroll = () => {
    const scrollRef = useRef(null);
    const scroll = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scroll.current = new LocomotiveScroll({
                el: scrollRef.current,
                smooth: true,
            });
        }
    }, []);

    return { scrollRef, scroll };
};


export default useLocomotiveScroll;