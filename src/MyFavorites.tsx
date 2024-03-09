import React from 'react';
import { useFavorites } from './components/FavoritesContext.tsx';
import Header from './components/Header.tsx';
import Button from 'react-bootstrap/Button';

function MyFavorites(): JSX.Element {
  const { favorites, removeFromFavorites } = useFavorites();

  function handleRemoveFavorites(id: number): void {
    removeFromFavorites(id);
  }

  return (
    <>
      <Header />
      <div className="card-container">
        {favorites.length === 0 ? (
          <div>No favorite characters available</div>
        ) : (
          favorites.map((character, i) => (
            <div key={character.id} className="custom-card">
              <img src={character.image} alt={character.name} className="card-image" />
              <div className="card-details">
                <h2>{character.name}</h2>
                <p>
                  Status: {character.status}<br />
                  Species: {character.species}<br />
                  Gender: {character.gender}<br />
                  Origin: {character.origin.name}
                </p>
                <Button variant="primary" onClick={() => handleRemoveFavorites(character.id)}>Remove</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MyFavorites;
