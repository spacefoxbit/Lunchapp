import React, { useState, useEffect } from 'react';
import './App.css';


const initialPeople = [
  { id: 'K', name: 'K' },
  { id: 'A', name: 'A' },
  { id: 'H', name: 'H' },
];


function getToday() {
  const d = new Date();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function App() {
  const [people, setPeople] = useState(initialPeople);
  const [iPaid, setIPaid] = useState(() => {
    const saved = localStorage.getItem('iPaid');
    return saved ? JSON.parse(saved) : [];
  });
  const [theyPaid, setTheyPaid] = useState(() => {
    const saved = localStorage.getItem('theyPaid');
    return saved ? JSON.parse(saved) : [];
  });
  const [clearToggle, setClearToggle] = useState(false);

  // Save to localStorage whenever iPaid or theyPaid changes
  useEffect(() => {
    localStorage.setItem('iPaid', JSON.stringify(iPaid));
  }, [iPaid]);
  useEffect(() => {
    localStorage.setItem('theyPaid', JSON.stringify(theyPaid));
  }, [theyPaid]);

  // Archive and re-add person to end of list
  const handleArchive = (id, type) => {
    const person = people.find(p => p.id === id);
    setPeople([...people.filter(p => p.id !== id), person]); // move to end
    const archived = { ...person, date: getToday() };
    if (type === 'iPaid') setIPaid(prev => [...prev, archived]);
    else setTheyPaid(prev => [...prev, archived]);
  };

  // Clear lists
  const handleClear = () => {
    if (clearToggle) {
      setIPaid([]);
      setTheyPaid([]);
      setClearToggle(false);
      localStorage.removeItem('iPaid');
      localStorage.removeItem('theyPaid');
    }
  };

  return (
    <div className="container">
      <h1 style={{ letterSpacing: '2px' }}>LUNCHAPP</h1>
      <div className="list">
        {people.length === 0 && <div className="empty">No more people</div>}
        {people.map(person => (
          <div className={`card ${person.id.toLowerCase()}`} key={Math.random() + person.id}>
            <button className="left" onClick={() => handleArchive(person.id, 'iPaid')}>← I paid</button>
            <span className="person-name">{person.name}</span>
            <button className="right" onClick={() => handleArchive(person.id, 'theyPaid')}>They paid →</button>
          </div>
        ))}
      </div>
      <div className="archive">
        <h2>I paid</h2>
        {iPaid.length === 0 ? <div className="empty">None</div> : iPaid.slice(-5).map((p, i) => <div key={i}>{p.name} <span className="date">({p.date})</span></div>)}
        <h2>They paid</h2>
        {theyPaid.length === 0 ? <div className="empty">None</div> : theyPaid.slice(-5).map((p, i) => <div key={i}>{p.name} <span className="date">({p.date})</span></div>)}
      </div>
      <div className="clear-btn-container">
        <button
          className={`clear-btn${clearToggle ? ' confirm' : ''}`}
          onClick={() => clearToggle ? handleClear() : setClearToggle(true)}
          title={clearToggle ? 'Click to confirm clear' : 'Toggle to enable clear'}
        >
          {clearToggle ? 'Confirm Clear' : '🗑️'}
        </button>
      </div>
    </div>
  );
}

export default App;
