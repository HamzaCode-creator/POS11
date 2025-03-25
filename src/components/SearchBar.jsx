import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';

import { FaSearch, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
/*import { database } from '../database';*/ //test through database

export const SearchBar = ({ setResults }) => {
    const searchBarRef = useRef(null);
    const [input, setInput] = useState('');
    const [showFilters, setShowFilters] = useState(false); // State to toggle filter dropdown
    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 400,
        rating: '',
        category: '',
    });

    // Close the filter dropdown when clicking outside the search bar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
                setShowFilters(false);
                setInput('');
                setResults([]); 
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setResults]);

    const navigate = useNavigate();
    
    // Fetch results from backend
    const fetchResults = async (query) => {
        try {
            const params = {
                query: query || '',
                minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
                maxPrice: filters.maxPrice < 400 ? filters.maxPrice : undefined,
                rating: filters.rating || undefined,
                category: filters.category || undefined,
            };

            const response = await axios.get('http://localhost:5000/search', { params });
            setResults(response.data); // Update the results with the response data
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    

    // Handles search input
    const handleSearch = (value) => {
        setInput(value);
        if (value.trim() === '') {
            setResults([]);
        } else {
            fetchResults(value);
        }
    };
    // Navigate to a specific page when the search icon is clicked
    const handleIconClick = () => {
         navigate(`/search?query=${encodeURIComponent(input)}`);
    };

    // Navigate to a specific page when Enter is pressed in the search input
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // Navigate to the related page when Enter is pressed
            navigate(`/search?query=${encodeURIComponent(input)}`);
        }
    };

    // Toggle the filter dropdown
    const handleFilterClick = () => {
        setShowFilters(!showFilters); 
    };

    // Close the filter dropdown when Enter is pressed
    const handleFilterKeyDown = (e) => {
        if (e.key === 'Enter') {
            setShowFilters(false); 
            fetchResults(input); 
        }
    };

  return (
    <div className="search-bar-container">
        <div className="input-wrapper">
                <div className="icon-container" onClick={handleIconClick}>
                    <FaSearch id="search-icon" />
                </div>
                <input
                    placeholder="Search..."
                    value={input}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className="filter-container" onClick={handleFilterClick}>
                    <FaFilter id="filter-icon" />
                </div>
            </div>
            {showFilters && (
                <div className={`filter-dropdown ${showFilters ? 'show' : ''}`}
                     tabIndex="0"
                     onKeyDown={(e)=> {
                         if (e.key === 'Escape') {
                             setShowFilters(false);
                             fetchResults(input); 
                         }
                     }}>
                    <div className="min-price">
                        <label>Min Price:</label>
                        <input
                            id="min-price"
                            type="number"
                            min ="0"
                            placeholder="0"
                            value={filters.minPrice === 0 ? "" : filters.minPrice} 
                            onChange={(e) => {
                                let value = e.target.value;
                                if (value.startsWith('0') && value.length > 1) {
                                    value = value.replace(/^0+/, '');
                                }
                                value = value === "" ? "" : Number(value);

                                setFilters((prevFilters) => ({
                                    ...prevFilters,
                                    minPrice: value === "" ? 0 : value, 
                                }));

                                if (value !== "") {
                                    fetchResults(input); 
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === '+') {
                                    e.preventDefault(); 
                                }
                            }}
                        />
                    </div>
                    <div className="max-price">
                        <label>Max Price:</label>
                        <input
                           id="max-price"
                           type="number"
                           min ="0"
                           placeholder="400"
                           value={filters.maxPrice === 400 ? "" : filters.maxPrice} 
                           onChange={(e) => {
                            let value = e.target.value;
                            if (value.startsWith('0') && value.length > 1) {
                                value = value.replace(/^0+/, '');
                            }
                            value = value === "" ? "" : Number(value);

                            setFilters((prevFilters) => ({
                                ...prevFilters,
                                maxPrice: value === "" ? 400 : value, 
                            }));

                            if (value !== "") {
                                fetchResults(input); 
                            }
                           }}
                           onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === '+') {
                                e.preventDefault(); 
                            }
                        }}
                        />
                    </div>
                    <div className="rating">
                        <label>Rating:</label>
                        <select id="rating"
                            value={filters.rating}
                            onChange={(e) =>
                                setFilters((prevFilters) => ({
                                    ...prevFilters,
                                    rating: e.target.value,
                                }))
                            }
                            onKeyDown={handleFilterKeyDown}
                        >
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className="category">
                        <label>Category:</label>
                        <input
                            id="category"
                            type="text"
                            placeholder="Enter category"
                            value={filters.category}
                            onChange={(e) =>
                                setFilters((prevFilters) => ({
                                    ...prevFilters,
                                    category: e.target.value,
                                }))
                            }
                            onKeyDown={handleFilterKeyDown}
                        />
                    </div>
        <button
            className="reset-filters-button"
            onClick={() => {
                setFilters({
                    minPrice: 0,
                    maxPrice: 400,
                    rating: '',
                    category: '',
                });
                setResults([]); 
                fetchResults('');
            }}
        >
            Reset Filters
        </button>
                </div>
            )}
    </div>);
};