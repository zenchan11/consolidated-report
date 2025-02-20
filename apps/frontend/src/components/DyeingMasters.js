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
                // const response = await fetch('https://consolidated-backend-tan.vercel.app/api/matching-efficiency');
                const response = await fetch('http://localhost:3000/matching-efficiency');
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
                    <XAxis 
                        dataKey="No. of Attempt" 
                        label={{ value: 'Attempts', position: 'insideBottom', offset: 0 }} // Adjusted offset for space
                    />
                    <YAxis 
                        label={{ value: 'No of Attempts', angle: -90, position: 'insideLeft', offset: 5 }} 
                    />
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="top" align="center" /> {/* Adjusted legend layout */}
                    <Area type="monotone" dataKey="Manoj kumar" stroke="#536def" fill="#536def" fillOpacity={0.4} strokeWidth={2} name="Manoj Kumar" />
                    <Area type="monotone" dataKey="Manoj sharma" stroke="#ff8c00" fill="#ff8c00" fillOpacity={0.4} strokeWidth={2} name="Manoj Sharma" />
                    <Area type="monotone" dataKey="Bijay" stroke="#4caf50" fill="#4caf50" fillOpacity={0.4} strokeWidth={2} name="Bijay" />
                    <Area type="monotone" dataKey="Raj Kumar" stroke="#ff0000" fill="#ff0000" fillOpacity={0.4} strokeWidth={2} name="Raj Kumar" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DyeingMasters;
