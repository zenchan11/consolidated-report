import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { helix } from 'ldrs';
import { Link } from 'react-router-dom';
helix.register();

function DyeingReports() {
    const [totalCarpets, setTotalCarpets] = useState({
        freshDyeing: 0,
        redyeing: 0,
        additionalDyeing: 0 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://consolidated-backend-tan.vercel.app/api/fresh-redyeing-additional');
                // const response = await fetch('http://localhost:3000/fresh-redyeing-additional');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setTotalCarpets({
                    freshDyeing: result[0].Fresh || 0,
                    redyeing: result[0].Redyeing || 0,
                    additionalDyeing: result[0].Additional || 0
                });
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
                <l-helix size="45" speed="2" color="#536def"></l-helix>
            </div>
        );
    }

    if (error) return <p>Error: {error}</p>;

    // Prepare data for the chart
    const chartData = [
        {
            name: 'Dyeing Type',
            Fresh: totalCarpets.freshDyeing,
            Redyeing: totalCarpets.redyeing,
            Additional: totalCarpets.additionalDyeing
        }
    ];

    return (
        <div className="dyeing-reports">
            <h2>Dyeing Reports</h2>

            {/* Add the ProgressBar component */}
            <ProgressBar 
                title="Carpet Dyeing Summary"
                data={[
                    { name: 'Fresh Dyeing', value: totalCarpets.freshDyeing },
                    { name: 'Redyeing', value: totalCarpets.redyeing },
                    { name: 'Additional Dyeing', value: totalCarpets.additionalDyeing }
                ]}
                colors={['#536def', '#ff8c00', '#4caf50']}
            />
            
            <div className="details-section">
                {/* Accordion for Dyeing Summary Chart */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography >Dyeing Summary Chart</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <h3>Carpet Dyeing Summary</h3>
                    <ul className="carpet-summary-list">
                    <li>
                        <strong>Fresh Dyeing:</strong> {totalCarpets.freshDyeing} carpets
                    </li>
                    <li>
                        <strong>Redyeing:</strong> {totalCarpets.redyeing} carpets
                    </li>
                    <li>
                        <strong>Additional Dyeing:</strong> {totalCarpets.additionalDyeing} carpets
                    </li>
                    </ul>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Fresh" fill="#536def" name="Fresh Dyeing" />
                                <Bar dataKey="Redyeing" fill="#ff8c00" name="Redyeing" />
                                <Bar dataKey="Additional" fill="#4caf50" name="Additional Dyeing" />
                            </BarChart>
                        </ResponsiveContainer>
                    </AccordionDetails>
                </Accordion>

                {/* Example links for navigation */}
                <Link to="/more-details">View More Details</Link>
            </div>
        </div>
    );
}

export default DyeingReports;
