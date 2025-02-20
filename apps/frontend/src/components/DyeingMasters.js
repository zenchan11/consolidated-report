import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { helix } from 'ldrs';
helix.register();

function DyeingMasters() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://consolidated-backend-tan.vercel.app/api/matching-efficiency');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <l-helix size="45" speed="2" color="#536def"></l-helix> {/* Use the Helix loader */}
            </div>
        );
    }

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="dyeing-masters">
            <h2>Dyeing Masters Efficiency Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="efficiency" stroke="#536def" fill="#536def" fillOpacity={0.4} strokeWidth={2} name="Master 1" />
                    <Area type="monotone" dataKey="efficiency2" stroke="#ff8c00" fill="#ff8c00" fillOpacity={0.4} strokeWidth={2} name="Master 2" />
                    <Area type="monotone" dataKey="efficiency3" stroke="#4caf50" fill="#4caf50" fillOpacity={0.4} strokeWidth={2} name="Master 3" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DyeingMasters;
