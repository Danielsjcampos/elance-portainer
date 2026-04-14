import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const META_PIXEL_ID = '1226807225840226';

const MinimalLayout: React.FC = () => {
    useEffect(() => {
        // Meta Pixel Code
        if (!(window as any).fbq) {
            const n = ((window as any).fbq = function (...args: any[]) {
                n.callMethod
                    ? n.callMethod.apply(n, args)
                    : n.queue.push(args);
            }) as any;
            if (!(window as any)._fbq) (window as any)._fbq = n;
            n.push = n;
            n.loaded = true;
            n.version = '2.0';
            n.queue = [] as any[];

            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://connect.facebook.net/en_US/fbevents.js';
            document.head.appendChild(script);
        }

        (window as any).fbq('init', META_PIXEL_ID);
        (window as any).fbq('track', 'PageView');
    }, []);

    return (
        <div className="min-h-screen bg-[#151d38] text-white">
            {/* Meta Pixel noscript fallback */}
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>

            {/* Background patterns could go here if global */}
            <Outlet />
        </div>
    );
};

export default MinimalLayout;
