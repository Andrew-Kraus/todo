import React, { BrowserRouter, Route, Routes } from 'react-router-dom';
import Projects from './pages/Projects';
import Todo from './pages/Todo';


function App() {
  return (
    <BrowserRouter>
      <div className='page'>
        <Routes>
          <Route exact path='/' element={<Projects />} />
          <Route exact path='/todo' element={<Todo />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
