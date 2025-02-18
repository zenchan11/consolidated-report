import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { zoomies } from 'ldrs';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './TotalColors.scss'; // Import the SCSS file

zoomies.register();

const TotalColors = () => {
  const [colorData, setColorData] = useState([]);
  const [totalColorData, setTotalColorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://consolidated-backend-tan.vercel.app/api/total-color-used')
      .then(response => response.json())
      .then(data => {
        const totalData = data.find(item => item["COLORS"] === "TOTAL COLOR USED");
        const validData = data.filter(item => item["COLORS"] !== "TOTAL COLOR USED");

        const processedData = validData.map(item => ({
          color: item["COLORS"],
          total: parseFloat(item["Total COST"] || 0).toFixed(2),
          costPerKg: parseFloat(item["Cost per kg"] || 0).toFixed(2),
          inGram: parseFloat(item["in GRAM"] || 0).toFixed(2),
        }));

        setColorData(processedData);

        if (totalData) {
          setTotalColorData({
            totalColorUsed: parseFloat(totalData["Total COST"] || 0).toFixed(2),
            totalCost: parseFloat(totalData["Total COST"] || 0).toFixed(2),
          });
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.error('Error fetching the color data:', error);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <l-zoomies size="80" stroke="5" bg-opacity="0.1" speed="1.4" color="black"></l-zoomies>
      </div>
    );
  }

  const maxTotal = Math.max(...colorData.map(item => parseFloat(item.total)));

  return (
    <div className="total-colors-container">
      <h2>Total Colors Used</h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={colorData} margin={{ top: 20, right: 30, left: 10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="color"
            tick={{ angle: -45, textAnchor: 'end', fontSize: 16 }}
            height={80}
          />
          <YAxis domain={[0, maxTotal * 1.2]} />
          <Tooltip />
          <Bar dataKey="total" fill="#8884d8" barSize={50} />
        </BarChart>
      </ResponsiveContainer>

      {/* Accordion for Table Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Color Data Table</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <table className="color-table">
            <thead>
              <tr>
                <th>Color</th>
                <th>Total Used</th>
                <th>Cost per kg</th>
                <th>In GRAM</th>
              </tr>
            </thead>
            <tbody>
              {colorData.map((color, index) => (
                <tr key={index}>
                  <td>{color.color}</td>
                  <td>{color.total}</td>
                  <td>{color.costPerKg}</td>
                  <td>{color.inGram}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AccordionDetails>
      </Accordion>

      {/* Display Total Color Used as a separate summary section */}
      {totalColorData && (
        <div className="total-color-summary">
          <h3>Total Color Used</h3>
          <p><strong>Total Cost of All Colors: </strong>{totalColorData.totalColorUsed}</p>
        </div>
      )}
    </div>
  );
};

export default TotalColors;
