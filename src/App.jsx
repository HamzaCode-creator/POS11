import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { SearchBar } from './components/SearchBar';
import { ResultsList } from './components/ResultsList';

function App() {

  const [results, setResults] = useState([]);

  return (
    <BrowserRouter>
      <div className="App">
        <div className="search-bar-container">
          <SearchBar setResults={setResults}/>
          <ResultsList results={results}/>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App
