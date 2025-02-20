import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';  // Import ProgressBar component
import { Link } from 'react-router-dom';
import { helix } from 'ldrs';
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
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setTotalCarpets({
                    freshDyeing: result.freshDyeing || 0,
                    redyeing: result.redyeing || 0,
                    additionalDyeing: result.additionalDyeing || 0
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

    return (
        <div className="dyeing-reports">
            <h2>Dyeing Reports</h2>

            {/* Add the ProgressBar component */}
            <ProgressBar />

            <div className="details-section">
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

                <h3>Additional Details</h3>
                <p>Some details about the dyeing reports can go here.</p>

                {/* Example links for navigation */}
                <Link to="/more-details">View More Details</Link>
            </div>
        </div>
    );
}

export default DyeingReports;
