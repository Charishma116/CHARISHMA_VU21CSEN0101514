import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const NumberFetcher = () => {
  const [numbers, setNumbers] = useState([]);
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [average, setAverage] = useState(0);
  const windowSize = 10;

  const fetchNumbers = useCallback(async (numberId) => {
    console.log(`Fetching numbers for ID: ${numberId}`); // Log the start of the fetch

    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzI0NzQxODQ1LCJpYXQiOjE3MjQ3NDE1NDUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjE0YTk5NmRlLTI5OGQtNDk2Yi04MGYyLTY3NTA5Njg5ZTQwZCIsInN1YiI6ImNrYXJyaW5AZ2l0YW0uaW4ifSwiY29tcGFueU5hbWUiOiJnbyBNYXJ0IiwiY2xpZW50SUQiOiIxNGE5OTZkZS0yOThkLTQ5NmItODBmMi02NzUwOTY4OWU0MGQiLCJjbGllbnRTZWNyZXQiOiJVV3RjdklKUEtVb2FhakVzIiwib3duZXJOYW1lIjoiQ2hhcmlzaG1hIEthcnJpIiwib3duZXJFbWFpbCI6ImNrYXJyaW5AZ2l0YW0uaW4iLCJyb2xsTm8iOiJWVTIxQ1NFTjAxMDE1MTQifQ.HnHgo4qdeN1ktN9pDiKnpyZ3wck0MAtJMRgVFX9WCt0";
      console.log("Using token:", token); // Log the token being used

      const response = await axios.get(`http://20.244.56.144/test/${numberId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("API Response:", response.data);

      if (response.data && response.data.numbers) {
        const newNumbers = response.data.numbers;
        console.log("Fetched Numbers:", newNumbers);

        setWindowPrevState([...windowCurrState]);
        const updatedNumbers = [...windowCurrState, ...newNumbers].slice(-windowSize);
        setWindowCurrState(updatedNumbers);
        setNumbers(newNumbers);

        const avg = updatedNumbers.reduce((acc, num) => acc + num, 0) / updatedNumbers.length;
        setAverage(avg);
      } else {
        console.error("API returned unexpected data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching numbers:", error); // Log detailed error
    }
  }, [windowCurrState, windowSize]);

  useEffect(() => {
    fetchNumbers('even'); // Start with fetching even numbers
  }, [fetchNumbers]);

  return (
    <div>
      <h2>Average Calculator Microservice</h2>
      <button onClick={() => fetchNumbers('primes')}>Fetch Primes</button>
      <button onClick={() => fetchNumbers('fibo')}>Fetch Fibonacci</button>
      <button onClick={() => fetchNumbers('even')}>Fetch Even Numbers</button>
      <button onClick={() => fetchNumbers('rand')}>Fetch Random Numbers</button>
      <div>
        <h4>Previous State:</h4>
        <p>{windowPrevState.length > 0 ? JSON.stringify(windowPrevState) : "No previous state"}</p>
      </div>
      <div>
        <h4>Current State:</h4>
        <p>{windowCurrState.length > 0 ? JSON.stringify(windowCurrState) : "No current state"}</p>
      </div>
      <div>
        <h4>Fetched Numbers:</h4>
        <p>{numbers.length > 0 ? JSON.stringify(numbers) : "No numbers fetched"}</p>
      </div>
      <div>
        <h4>Average:</h4>
        <p>{average ? average.toFixed(2) : "No average calculated"}</p>
      </div>
    </div>
  );
};

export default NumberFetcher;
