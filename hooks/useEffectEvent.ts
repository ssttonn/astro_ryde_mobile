import { useEffect, useRef, useCallback } from 'react';

function useEffectEvent(callback: () => void, dependencies: any[]) {
    const callbackRef = useRef(callback);

    // Update the callback reference on each render
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Create a stable function that calls the latest callback
    const stableCallback = useCallback(() => {
        callbackRef.current();
    }, [callbackRef]);

    // Use the stable callback in the effect
    useEffect(() => {
        stableCallback();
    }, [stableCallback, ...dependencies]);
}

export default useEffectEvent;