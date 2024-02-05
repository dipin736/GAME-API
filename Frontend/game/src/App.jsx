// App.js
import React, { useState } from 'react';
import { Grid, GridItem} from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import useGames from './hooks/useGames';
import Login from './Auth/Login';

import Register from './Auth/Register';
import PrivateRoute from './components/PrivateRoute';
import Cartitems from './components/CartItems ';
import Orders from './components/Orders';
import Home from './Home';
import About from './pages/About';
import Contact from './pages/Contact';
import GameDetailsq from './pages/Details';
import GameDetails from './components/GameDetails';


function App() {
  const { games,loading} = useGames();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    // templateColumns={{
    //   base: '1fr',
    //   lg: '200px 1fr',
    // }}
  
      <Router>
        <Grid
          templateAreas={{
            base: `"nav" "main"`,
            lg: `"nav nav" "aside main"`,
          }}
        >
          <GridItem area="nav">
            <Navbar onSearch={handleSearch} />
          </GridItem>
          <Routes>
              <Route element={<PrivateRoute/>}>
                <Route path="cart/:userId" element={<Cartitems/>} />
                <Route path="orders/:userId" element={<Orders/>} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/game/game_details/:id" element={<GameDetails />} />

              <Route path="/game" element={<GameDetailsq/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/"element={<Home  loading={loading} filteredGames={filteredGames} />}/>                
          </Routes>
        </Grid>
      </Router>
    
  );
}

export default App;
