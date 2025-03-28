import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NavigationGuard() {
    const location = useLocation();
    const navigate = useNavigate();
    const navigationAttemptRef = useRef(0);
    const previousPathRef = useRef('');
    
    useEffect(() => {
        // Skip initial render
        if (previousPathRef.current === '') {
            previousPathRef.current = location.pathname;
            return;
        }
        
        // Check if we're in a chat route and navigating too rapidly
        if (location.pathname.includes('/chat')) {
            navigationAttemptRef.current += 1;
            
            // If there are too many navigations in a short period, block it
            if (navigationAttemptRef.current > 2) {
                console.log('Blocking rapid navigation in chat');
                // Block the navigation by going back to the previous path
                window.history.pushState(null, '', previousPathRef.current);
                return;
            }
            
            // Reset the counter after a delay
            setTimeout(() => {
                navigationAttemptRef.current = 0;
            }, 1000);
        }
        
        previousPathRef.current = location.pathname;
    }, [location, navigate]);
    
    return null;
}