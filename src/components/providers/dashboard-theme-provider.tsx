"use client";

import { useEffect } from "react";

/**
 * Dashboard Theme Provider
 * 
 * This component adds the 'dashboard-theme' class to the document body
 * when mounted, ensuring React Aria portals (which render at body level)
 * also receive the correct theme styles.
 */
export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Add dashboard-theme class to body for portal components
        document.body.classList.add("dashboard-theme");
        
        // Cleanup: remove the class when component unmounts
        return () => {
            document.body.classList.remove("dashboard-theme");
        };
    }, []);

    return <>{children}</>;
}
