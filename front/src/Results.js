import './results.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';
//import { drawQuadrantsPlugin } from './graph-shading.js'; // Adjust the path as necessary
//import { drawCenterCirclePlugin } from './center-circle.js'; // Adjust the path as necessary
import 'chartjs-plugin-annotation';
import Chart from 'chart.js/auto';

// Register custom plugins
//Chart.register(drawQuadrantsPlugin(Chart));
//Chart.register(drawCenterCirclePlugin(Chart));

import { explanations } from './explanations.js'; // Adjust the path as necessary


function Results() {
  const [userData, setUserData] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState("");
  const [selectedLeaderStyle, setSelectedLeaderStyle] = useState(null); // Add this line
  const chartRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    if (email) {
      // Update the frontend code to expect a single object, not an array
      axios.get(`http://localhost:3001/api/user-data?email=${email}`)
        .then(response => {
          console.log('Data received:', response.data);
          const mostRecentSubmission = response.data;

          // Check if data is not null or empty
          if (mostRecentSubmission && Object.keys(mostRecentSubmission).length > 0) {
          // Extract the leader type from the most recent submission
          const leaderType = mostRecentSubmission.leaderType;

          // Set the selected leader style and explanation name
          setSelectedLeaderStyle(leaderType);
          setSelectedInfo(explanations[leaderType]);

          // Set the most recent submission data
           setUserData(mostRecentSubmission);
        } else {
          // No submission found for the email
          console.log('No submission found for the email:', email);
  }
})
.catch(error => {
  console.error('Error fetching user data:', error);
});

    } else {
      console.error('No email provided in query parameters');
    }
    
  }, [location]);
        

  const chartData = userData ? {
    datasets: [{
      label: 'Leadership Style',
      data: [{
        x: parseInt(userData.winningFocus),
        y: parseInt(userData.teamFocus)
      }],
      backgroundColor: 'rgba(255, 99, 132, 1)',
      pointRadius: 20,
      showLine: false,
    }],
  } : {};

  const medianX = 18; // Median values for x-axis
  const medianY = 18; // Median values for y-axis

  const options = {
    aspectRatio: 1,
    layout: {
      padding: {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30,}
    },
    backgroundColor: 'rgba(255,255,255,1)',
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 4,
        max: 33,
        title: {
          display: true,
          text: 'Win Focus',
          color: 'black',
          font: { size: 16 },
          position: 'bottom',
        },
        grid: {
          display: false,
          borderColor: 'transparent',
          drawBorder: false,
        },
        ticks: {
          display: false
        }
      },
      y: {
        min: 4,
        max: 33,
        title: {
          display: true,
          text: 'Team Focus',
          color: 'black',
          font: { size: 16 }
        },
        position: 'left',
        grid: {
          display: false,
          borderColor: 'transparent',
          drawBorder: false,
        },
        ticks: {
          display: false
        }
      }
    },
    maintainAspectRatio: true,
  };


  const renderExplanation = () => {
    if (selectedInfo) {
      // Access the explanation based on the selected style
      const explanation = explanations[selectedInfo];
      if (explanation) {
        return (
          <div className="explanation">
            <h2>{explanation.title}</h2>
            <p>{explanation.description}</p>
            <h3>Advantages:</h3>
            <ul>
              {explanation.advantages.map((advantage, index) => (
                <li key={index}>{advantage}</li>
              ))}
            </ul>
            <h3>Drawbacks:</h3>
            <ul>
              {explanation.drawbacks.map((drawback, index) => (
                <li key={index}>{drawback}</li>
              ))}
            </ul>
            <h3>Potential Issues:</h3>
            <ul>
              {explanation.potentialIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        );
      }
    }

    // If no leadership style is selected, display a loading message
    return <p>Loading results...</p>;
  };

 


  return (
    <div className="results-container">
      <div className="centered-content">
        <h1 className="results-title">Your Results</h1>
        <p className="results-description">Here are the results of your leadership test:</p>
        {userData ? (
          <>
            <div className="chart-container" id="myChart">
              <Scatter data={chartData} options={options} />
            </div>
            <div className="leader-info">
              <h2>Leader Type: {userData.leaderType}</h2>
              {explanations[userData.leaderType] && (
                <>
                  <h3>{explanations[userData.leaderType].title}</h3>
                  <p>{explanations[userData.leaderType].description}</p>
                  <h4>Advantages:</h4>
                  <ul>
                    {explanations[userData.leaderType].advantages.map(advantage => (
                      <li key={advantage}>{advantage}</li>
                    ))}
                  </ul>
                  <h4>Drawbacks:</h4>
                  <ul>
                    {explanations[userData.leaderType].drawbacks.map(drawback => (
                      <li key={drawback}>{drawback}</li>
                    ))}
                  </ul>
                  <h4>Potential Issues:</h4>
                  <ul>
                    {explanations[userData.leaderType].potentialIssues.map(issue => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </>
        ) : (
          <p>Loading results...</p>
        )}
      </div>
    </div>
  );
}


export default Results;
