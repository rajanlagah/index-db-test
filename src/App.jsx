import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import IndexDB from './IndexDB';

function App() {
  const [writeTime, setWriteTime] = useState(null);
  const [readTime, setReadTime] = useState(null);
  const [writeSize, setWriteSize] = useState(null);
  const [readSize, setReadSize] = useState(null);

  // Test LocalStorage
  function testLocalStorage() {
    const numberOfIterations = 1000;

    console.time("LocalStorage Write");
    const writeStart = new Date();

    for (let i = 0; i < numberOfIterations; i++) {
      const testData = { name: "Test", value: Math.random() };
      const prevData = JSON.parse(localStorage.getItem("testData")) || [];
      const updatedData = JSON.stringify([...prevData, { id: i, ...testData }]);
      localStorage.setItem("testData", updatedData);
    }

    const writeEnd = new Date();
    console.timeEnd("LocalStorage Write");
    setWriteTime(writeEnd - writeStart);

    const writtenData = localStorage.getItem("testData");
    setWriteSize((new Blob([writtenData]).size / 1024).toFixed(2));

    console.time("LocalStorage Read");
    const readStart = new Date();

    const data = localStorage.getItem("testData");

    const readEnd = new Date();
    console.timeEnd("LocalStorage Read");
    setReadTime(readEnd - readStart);

    setReadSize((new Blob([data]).size / 1024).toFixed(2));

    console.log("local", data);
  }

  async function clearData() {
    
    localStorage.clear();

    // Reset state
    setWriteTime(null);
    setReadTime(null);
    setWriteSize(null);
    setReadSize(null);
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: "50% 50%",
      alignItems: 'baseline',
      gap: '24px'
    }}>
      <div style={{
        height: '100vh',
        backgroundColor: "#555",
        paddingTop: '120px',
        color: "#fff",
        width: '100%'
      }}>
        <button onClick={testLocalStorage}>Test LocalStorage</button>
        {writeTime !== null && <p>Write Time: {writeTime} ms</p>}
        {readTime !== null && <p>Read Time: {readTime} ms</p>}
        {writeSize !== null && <p>Write Size: {writeSize} kB</p>}
        {readSize !== null && <p>Read Size: {readSize} kB</p>}
        {writeSize !== null && <button onClick={clearData}>Clear Localstorage</button>}
      </div>
      <IndexDB />
    </div>
  );
}

export default App;
