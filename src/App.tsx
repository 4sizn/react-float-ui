import React from 'react';
import './App.css';
import FloatingProvider from './FloatingProvider';

function App() {
  return (
    <div className='App'>
      <FloatingProvider>
        <TestComp />
      </FloatingProvider>
    </div>
  );
}

export default App;

function TestComp() {
  return <div>helloworld</div>;
}
