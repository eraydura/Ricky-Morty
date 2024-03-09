
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Locations from './Location.tsx';
import Character from './Character.tsx'; 
import CharacterDetail from './CharacterDetail.tsx'; 
import MyFavorites from './MyFavorites.tsx'; 

function App(): JSX.Element {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Locations />} />
        <Route path="/character" element={<Character />} />
        <Route path="/characterdetail" element={<CharacterDetail />} />
        <Route path="/myfavorites" element={<MyFavorites />} />
      </Routes>
    </Router>
  );
}

export default App;