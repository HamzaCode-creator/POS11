import React from 'react';

import "./SearchResult.css";

export const SearchResult = ({ result, onClick }) => {
    return <div className="search" onClick={onClick}>{result.name}</div>;
};