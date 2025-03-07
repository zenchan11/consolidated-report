import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './YarnIssued.scss';
import { hourglass } from 'ldrs';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

hourglass.register();

function YarnIssued() {
    const [transformedData, setTransformedData] = useState([]); // Transformed data for the table
    const [chartData, setChartData] = useState([]); // Data for the bar chart
    const [loading, setLoading] = useState(true); // State for loading status

    useEffect(() => {
        fetch('https://consolidated-backend-tan.vercel.app/api/undyed-yarn')  // API endpoint
            .then((response) => response.json())
            .then((data) => {
                const yarnTypes = [...new Set(data.map(item => item.Type))];
                const weeks = [1, 2, 3, 4];  // Defining the 4 weeks

                // Prepare table data (Ensure null values are replaced with 0 and round to 2 decimal places)
                const tableData = yarnTypes.map(type => {
                    const row = { type };
                    weeks.forEach(week => {
                        const weekData = data.find(item => item.Type === type && item.Week === week);
                        row[`week${week}_in`] = weekData?.In ? weekData.In.toFixed(2) : '0.00'; // Replace null with 0 and round to 2 decimals
                        row[`week${week}_out`] = weekData?.Out ? weekData.Out.toFixed(2) : '0.00'; // Replace null with 0 and round to 2 decimals
                    });
                    return row;
                });

                // Prepare chart data: One entry per week, each yarn type gets its own "in" and "out"
                const chartData = weeks.map(week => {
                    let weekData = { name: `Week ${week}` };
                    yarnTypes.forEach(type => {
                        const typeData = data.find(d => d.Type === type && d.Week === week) || {};
                        weekData[`${type}_in`] = typeData.In ? typeData.In.toFixed(2) : '0.00';  // Replace null with 0 and round to 2 decimals
                        weekData[`${type}_out`] = typeData.Out ? typeData.Out.toFixed(2) : '0.00'; // Replace null with 0 and round to 2 decimals
                    });
                    return weekData;
                });

                setTransformedData(tableData);
                setChartData(chartData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data: ', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <l-hourglass size="40" bg-opacity="0.1" speed="1.75" color="black"></l-hourglass>
            </div>
        );
    }

    const yarnColors = {
        Yarn: '#536def',
        Silk: '#f57c00',
        Cotton: '#4caf50',
    };

    // Function to render bars dynamically for each yarn type
    const renderBars = (type, index) => (
        <>
            <Bar
                dataKey={`${type}_in`}
                name={`${type} - In`}
                fill={yarnColors[type]}
                barSize={25}
                stackId={`stack${index}`}
            />
            <Bar
                dataKey={`${type}_out`}
                name={`${type} - Out`}
                fill={yarnColors[type]}
                barSize={25}
                stackId={`stack${index}`}
            />
        </>
    );

    return (
        <div className="yarn-issued">
            <h2>Yarn Issued Weekly Data</h2>

            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    barCategoryGap="10%" // Reduce spacing between groups for better alignment with thicker bars
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(yarnColors).map((type, index) => (
                        <React.Fragment key={type}>
                            {renderBars(type, index)} {/* Render bars dynamically */}
                        </React.Fragment>
                    ))}
                </BarChart>
            </ResponsiveContainer>

            {/* Accordion for Data Table */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Yarn Data Table</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <table>
                        <thead>
                            <tr>
                                <th>Yarn Type</th>
                                {[1, 2, 3, 4].map(week => (
                                    <th key={week} colSpan={2}>Week {week}</th>
                                ))}
                            </tr>
                            <tr>
                                <th></th>
                                {[1, 2, 3, 4].map(week => (
                                    <>
                                        <th key={`week${week}_in`}>In</th>
                                        <th key={`week${week}_out`}>Out</th>
                                    </>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {transformedData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.type}</td>
                                    {Array.from({ length: 4 }, (_, weekIndex) => {
                                        const week = weekIndex + 1;
                                        return (
                                            <React.Fragment key={week}>
                                                <td>{parseFloat(row[`week${week}_in`]).toFixed(2)}</td>
                                                <td>{parseFloat(row[`week${week}_out`]).toFixed(2)}</td>
                                            </React.Fragment>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default YarnIssued;
