import React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import './ProgressBar.scss'; // Import your existing CSS

function ProgressBar({ title = 'Carpet Dyeing Summary', data, colors = ['#536def', '#ff8c00', '#4caf50'] }) {
    if (!data || data.length === 0) {
        return <p>No data available</p>;
    }

    return (
        <div className="progress_bar">
            <div className="top">
                <p>{title}</p>
            </div>

            <div className="middle">
                <div className="progress">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                dataKey="value"
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={60} // Creates a donut chart effect
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <p className="summary-text">Breakdown of carpet dyeing types.</p>
            </div>
        </div>
    );
}

export default ProgressBar;
