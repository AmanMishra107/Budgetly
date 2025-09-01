// SmoothScroll.js (separate component)
import { useEffect } from 'react';
import Scrollbar from 'smooth-scrollbar';

export default function SmoothScroll() {
    useEffect(() => {
        const options = {
            damping: 0.07, // 0 = not smooth, 1 = laggy, 0.07 = optimal
        };
        Scrollbar.init(document.body, options);

        return () => {
            Scrollbar.destroy(document.body);
        };
    }, []);
    return null;
}