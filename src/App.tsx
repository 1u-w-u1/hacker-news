import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Detail from './pages/Detail.tsx';
import Navbar from './components/Navbar.tsx';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/story/:id" element={<Detail />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
