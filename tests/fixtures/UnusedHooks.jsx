import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

export function DataFetcher() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // This hook is never used
    const unusedMemo = useMemo(() => {
        return 'This is never used';
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch('/api/data')
            .then(res => res.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            {loading && <p>Loading...</p>}
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
}
