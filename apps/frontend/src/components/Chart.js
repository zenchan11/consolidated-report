import React, { useState, useEffect } from 'react';
import { infinity } from 'ldrs';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './chart.scss';

infinity.register()

function Chart({ height, title }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://consolidated-backend-tan.vercel.app/api/total-order-received')
            .then((response) => response.json())
            .then((rawData) => {
                const cleanedData = rawData
                    .filter((row) => row["Party Name"] && row["Party Name"] !== "TOTAL ")
                    .map((row) => ({
                        name: row["Party Name"],
                        FS: row["F Total Sq.mt"] || 0,
                        CS: row["C Total Sq. mt."] || 0,
                    }));
                setData(cleanedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching chart data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <l-infinity size="55" stroke="4" stroke-length="0.15" bg-opacity="0.1" speed="1.3" color="black"></l-infinity>
            </div>
        );
    }

    const totalFS = data.reduce((sum, row) => sum + row.FS, 0).toFixed(2);
    const totalCS = data.reduce((sum, row) => sum + row.CS, 0).toFixed(2);
    const totalCombined = (parseFloat(totalFS) + parseFloat(totalCS)).toFixed(2);

    // Find the maximum value for scaling
    const maxValue = Math.max(
        ...data.map(item => Math.max(item.FS, item.CS)),
        parseFloat(totalFS),
        parseFloat(totalCS)
    );

    return (
        <div className="chart_sec">
            <div className="title">
                <p>{title} (Last Month)</p>
            </div>
            
            {/* Custom Bar Chart Section */}
            <div className="bar-chart-container">
                {data.map((item, index) => (
                    <div key={index} className="bar-group">
                        <div className="bar-label">{item.name}</div>
                        <div className="bars-container">
                            <div 
                                className="bar fs-bar" 
                                style={{ height: `${(item.FS / maxValue) * 100}%` }}
                                title={`FS: ${item.FS}`}
                            >
                                <span className="bar-value">{item.FS.toFixed(2)}</span>
                            </div>
                            <div 
                                className="bar cs-bar" 
                                style={{ height: `${(item.CS / maxValue) * 100}%` }}
                                title={`CS: ${item.CS}`}
                            >
                                <span className="bar-value">{item.CS.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="legend">
                    <div className="legend-item">
                        <div className="legend-color fs-legend"></div>
                        <span>F Total Sq.mt</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color cs-legend"></div>
                        <span>C Total Sq.mt</span>
                    </div>
                </div>
            </div>

            {/* Table Section with Accordion */}
            <div className="table_sec">
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Table Data</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <table>
                            <thead>
                                <tr>
                                    <th>Party Name</th>
                                    <th>F Total Sq.mt</th>
                                    <th>C Total Sq.mt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.name}</td>
                                        <td>{row.FS}</td>
                                        <td>{row.CS}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AccordionDetails>
                </Accordion>
            </div>

            {/* Total Sum Section */}
            <div className="total_sum">
                <p><strong>Total F Total Sq.mt: </strong>{totalFS}</p>
                <p><strong>Total C Total Sq.mt: </strong>{totalCS}</p>
                <p><strong>Total Combined Sq.mt: </strong>{totalCombined}</p>
            </div>
        </div>
    );
}

export default Chart;