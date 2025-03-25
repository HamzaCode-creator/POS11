import React from 'react';
import { SearchResult } from './SearchResult';

import "./ResultsList.css";

export const ResultsList = ({ results }) => {
    return (
        <div className="results">
            {results.map((result, index) => {
                return (
                    <SearchResult 
                        className="result-item"
                        key={index} 
                        result={result}
                        onClick={() => window.location.href = `/details/${result.index}`} /> // Navigates to relevant page when clicking on result
                );
            })}
        </div>
    );   
};