import './App.css';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header.tsx';

interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[]; 
}

interface Info{
  pages:number;
}

interface ApiResponse {
  info: Info;
  results: Location[];
}

function Locations(): JSX.Element {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationsPerPage] = useState(10); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [currentPage]); 

  async function fetchData(): Promise<void> {
    try {
      let allLocations: Location[] = [];
      let totalPages = 1; 
  
      for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`https://rickandmortyapi.com/api/location?page=${page}`);
        if (response.ok) {
          const jsonData: ApiResponse = await response.json();
          allLocations = [...allLocations, ...jsonData.results];
          totalPages = jsonData.info.pages; 
        } else {
          throw new Error('Failed to fetch data');
        }
      }
  
      setData({ info: { pages: totalPages }, results: allLocations });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function handleClick(locationName: string): void {
    navigate("/character", { state: { origin: locationName } });
  }

  function handlePageChange(pageNumber: number): void {
    setCurrentPage(pageNumber);
  }

  const totalLocations = data ? data.results.length : 0;
  const totalPages = Math.ceil(totalLocations / locationsPerPage);

  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = data?.results.slice(indexOfFirstLocation, indexOfLastLocation);

  return (
    <>
      <Header />
      <div className="container">
        {data ? (
          <div>
            <div className="card-container">
              {currentLocations?.map((location: Location) => (
                <div key={location.id} className="card" style={{ marginBottom: '20px', marginTop: '20px' }}>
                  <div className="card-body">
                    <h5 className="card-title">{location.name} / {location.type}</h5>
                    <p className="card-text">{location.dimension}</p>
                    <p className="card-text">Resident Count: {location.residents.length}</p>
                    <Button variant="primary" onClick={() => handleClick(location.name)}>Show Characters</Button>
                  </div>
                </div>
              ))}
            </div>
            <nav aria-label="Page navigation">
              <div className='pagination-container'>
                  <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                      <li key={pageNumber} className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(pageNumber)}>{pageNumber}</button>
                      </li>
                    ))}
                  </ul>
              </div>

            </nav>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
    
  );
}

export default Locations;
