import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header.tsx';
import Button from 'react-bootstrap/Button';
import { useFavorites } from './components/FavoritesContext.tsx';

interface Character {
  id: number;
  name: string;
  species: string;
  status: string;
  gender: string; 
  origin: { name: string };
  image: string;
}

function CharacterDetail(): JSX.Element {
  const location = useLocation();
  const { favorites,addToFavorites,removeFromFavorites } = useFavorites();
  const character = location.state?.character; 

  if (!character) {
    return <div>No character data available</div>;
  }

  function handleAddFavorites(character: Character): void {
    addToFavorites(character);
  }

  function handleRemoveFavorites(id: number): void {
    removeFromFavorites(id);
  }

  return (
    <>
      <Header />
      <div className="card-container">
        <div key={character.id} className="card" style={{ width: '18rem', marginTop: '50px' }}>
          <img className="card-img-top" src={character.image} alt={character.name} />
          <div className="card-body">
            <h5 className="card-title">{character.name}</h5>
            <p className="card-text">
              Status: {character.status}<br />
              Species: {character.species}<br />
              Gender: {character.gender}<br />
              Origin: {character.origin.name}
            </p>
            {!favorites.some(favorite => favorite.id === character.id) ? (
              <Button variant="primary" onClick={() => handleAddFavorites(character)}>Add to Favorites</Button>
            ) : (
              <Button variant="primary" onClick={() => handleRemoveFavorites(character.id)}>Remove from Favorites</Button>
            )}
          </div>
        </div>
      </div>
    </>

  );
}

export default CharacterDetail;
