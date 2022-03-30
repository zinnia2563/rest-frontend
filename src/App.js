import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Home from './Components/Home';
function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
         <Route path="/api/res/:res_id/:branch_id/:table_id/menu/" element={<Home />}>
         </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
