import { useState } from 'react';
import './App.css';

function IndexDB() {
    const [writeTime, setWriteTime] = useState(null);
    const [readTime, setReadTime] = useState(null);
    const [writeSize, setWriteSize] = useState(null);
    const [readSize, setReadSize] = useState(null);

    // IndexedDB helper functions
    function openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("TestDB", 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("testStore")) {
                    db.createObjectStore("testStore", { keyPath: "id" });
                }
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    function writeToIndexedDB(db, id, data) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("testStore", "readwrite");
            const store = transaction.objectStore("testStore");
            store.put({ id: id, ...data });

            transaction.oncomplete = () => {
                resolve();
            };

            transaction.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    function readFromIndexedDB(db) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("testStore", "readonly");
            const store = transaction.objectStore("testStore");
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async function testIndexedDB() {
        const numberOfIterations = 1000;

        try {
            const db = await openIndexedDB();

            const writeStart = new Date();

            for (let i = 0; i < numberOfIterations; i++) {
                let existingData = await readFromIndexedDB(db);
                if (!existingData) {
                    existingData = [];
                }

                const updatedData = { name: "Test", value: Math.random(), data: { year: 2022, month: 9, day: 1, status:{ success: true, msg:"hi"}} };
                await writeToIndexedDB(db, i, updatedData);
            }

            const writeEnd = new Date();
            setWriteTime(writeEnd - writeStart);

            const writtenData = await readFromIndexedDB(db);
            setWriteSize((new Blob([JSON.stringify(writtenData)]).size / 1024).toFixed(2));

            const readStart = new Date();
            const result = await readFromIndexedDB(db);
            const readEnd = new Date();
            setReadTime(readEnd - readStart);

            setReadSize((new Blob([JSON.stringify(result)]).size / 1024).toFixed(2));
            console.log('result',result)
            console.log('IndexedDB Test Completed');
        } catch (error) {
            console.error("IndexedDB Error:", error);
        }
    }

    async function clearData() {
    
        const request = indexedDB.deleteDatabase("TestDB");
    
        request.onsuccess = () => {
          console.log("IndexedDB cleared");
        };
    
        request.onerror = (event) => {
          console.error("Error clearing IndexedDB:", event.target.error);
        };
    
        // Reset state
        setWriteTime(null);
        setReadTime(null);
        setWriteSize(null);
        setReadSize(null);
      }

    return (
        <div style={{ color: '#555' }}>
            <button onClick={testIndexedDB}>Test IndexedDB</button>
            {writeTime !== null && <p>Write Time: {writeTime} ms</p>}
            {readTime !== null && <p>Read Time: {readTime} ms</p>}
            {writeSize !== null && <p>Write Size: {writeSize} kB</p>}
            {readSize !== null && <p>Read Size: {readSize} kB</p>}
            {writeSize !== null && <button onClick={clearData}>Clear IndexDB</button>}
        </div>
    );
}

export default IndexDB;
