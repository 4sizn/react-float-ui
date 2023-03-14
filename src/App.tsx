import React, { useLayoutEffect } from 'react';
import './App.css';
import { useFloatingItem, FloatingProvider } from './';

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
  const { register } = useFloatingItem();

  //register floating item
  useLayoutEffect(() => {
    register({
      Component: () => <div>div 테스트</div>,
      options: {
        resize: true,
      },
    });

    register({
      Component: () => <div>button 테스트</div>,
      options: {
        resize: true,
      },
    });

    register({
      Component: () => <div>span 테스트</div>,
      options: {
        resize: true,
      },
    });
  }, []);

  return <div>helloWorld</div>;
}
