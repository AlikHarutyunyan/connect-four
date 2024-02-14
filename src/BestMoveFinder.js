import React, { useState, useEffect } from 'react';

const BestMoveFinder = ({ y, requestString }) => {
    const [bestMove, setBestMove] = useState(null);

    useEffect(() => {
        const getBestMove = () => {
            fetch(requestString)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    return response.json();
                })
                .then(data => {
                    let highestValue = -Infinity;
                    let move = null;

                    Object.entries(data).forEach(([key, value]) => {
                        if (value > highestValue) {
                            highestValue = value;
                            move = parseInt(key);
                        }
                    });

                    setBestMove(move);
                })
                .catch(error => {
                    console.error('Error fetching data:', error.message);
                    setBestMove(null);
                });
        };

        getBestMove();

    }, [requestString]);

    y(bestMove)
    return <p>{bestMove !== null ? `Best move: ${bestMove}` : 'Loading...'}</p>;
};

export default BestMoveFinder;
