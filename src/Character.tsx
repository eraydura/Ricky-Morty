import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';
import Header from './components/Header.tsx';
import { useFavorites } from './components/FavoritesContext.tsx';
import { MdAddCircle } from "react-icons/md";
import { MdOutlineRemoveCircle } from "react-icons/md";

interface Character {
  id: number;
  name: string;
  species: string;
  status: string;
  gender: string; 
  origin: { name: string };
  image: string;
}

function Character(): JSX.Element {
  const [characters, setCharacters] = useState<Character[]>([]);
  const location = useLocation();
  const originData = location.state?.origin;
  const [totalPages, setTotalPages] = useState(0);
  const [locationsPerPage] = useState(10); 
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all'); 
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const navigate = useNavigate(); 

  useEffect(() => {
    fetchData();
  }, [currentPage, originData, statusFilter]); 

  async function fetchData(): Promise<void> {
    try {
      let allCharacters: Character[] = [];
      let totalPagesFromAPI = 1; 

      for (let page = 1; page <= totalPagesFromAPI; page++) {
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
        if (response.ok) {
          const jsonData = await response.json();
          allCharacters = [...allCharacters, ...jsonData.results];
          totalPagesFromAPI = jsonData.info.pages; 
        } else {
          throw new Error('Failed to fetch character data');
        }
      }

      // Apply status filter
      let filteredCharacters = allCharacters;
      if (statusFilter !== 'all') {
        filteredCharacters = filteredCharacters.filter(character => character.status === statusFilter);
      }

      // Apply origin filter if provided
      if (originData) {
        filteredCharacters = filteredCharacters.filter(character => character.origin.name === originData);
      }
      
      setCharacters(filteredCharacters);
      setTotalPages(Math.ceil(filteredCharacters.length / locationsPerPage)); 
    } catch (error) {
      console.error('Error fetching character data:', error);
    }
  }

  function handlePageChange(pageNumber: number): void {
    setCurrentPage(pageNumber);
  }

  function handleClick(character: Character): void {
    navigate("/characterdetail", { state: { character } }); 
  }

  function handleAddFavorites(character: Character): void {
    addToFavorites(character);
  }

  function handleRemoveFavorites(id: number): void {
    removeFromFavorites(id);
  }

  const totalLocations = characters.length;
  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = characters.slice(indexOfFirstLocation, indexOfLastLocation);

  return (
    <div>
      <Header />

        {currentLocations.length ? (
          <>
           <div className="card-container">
                <label htmlFor="status">Filter by Status: </label>
                  <select id="status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="alive">Alive</option>
                    <option value="dead">Dead</option>
                    <option value="unknown">Unknown</option>
                  </select>
            </div>
            <div className="card-container">
            {currentLocations.map((character: Character) => (

              <div key={character.id} className="card">
                <img src={character.image} alt={character.name} />
                <div className="card-body">
                  <h5 onClick={() => handleClick(character)} className="card-title">{character.name}</h5>
                  <p className="card-text">Status: {character.status}</p>
                  <div className="card-buttons">
                    {!favorites.some(favorite => favorite.id === character.id) ? (
                      <Button variant="primary" onClick={() => handleAddFavorites(character)}><MdAddCircle className="button-icon" /></Button>
                    ) : (
                      <Button variant="primary" onClick={() => handleRemoveFavorites(character.id)}><MdOutlineRemoveCircle className="button-icon" /></Button>
                    )}
                   
                  </div>
                </div>
              </div>


            ))}
         </div>
          </>
        ) : (
          <div>No character found.</div>
        )}
      {totalLocations > 10 && (
        <div className="pagination-container">
          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => handlePageChange(pageNumber)}>
                {pageNumber}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default Character;
