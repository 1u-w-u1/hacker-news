import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MessageSquare, Clock, User, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Story {
    id: number;
    title: string;
    url?: string;
    score: number;
    by: string;
    time: number;
    descendants: number;
}

const Home = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
                const ids = await response.json();
                const topIds = ids.slice(0, 30);

                const storyPromises = topIds.map((id: number) =>
                    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
                );

                const fetchedStories = await Promise.all(storyPromises);
                setStories(fetchedStories);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stories:', error);
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Fetching top stories...</p>
            </div>
        );
    }

    return (
        <div className="home-page">
            <header className="page-header">
                <h1>Top Stories</h1>
                <p>Curated tech news from the community</p>
            </header>

            <div className="story-grid">
                {stories.map((story, index) => (
                    <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="story-card-wrapper"
                    >
                        <div className="story-card glass-panel">
                            <div className="story-score">
                                <span>{story.score}</span>
                            </div>

                            <div className="story-content">
                                <div className="story-meta">
                                    <span className="story-author"><User size={12} /> {story.by}</span>
                                    <span className="story-time"><Clock size={12} /> {new Date(story.time * 1000).toLocaleDateString()}</span>
                                </div>

                                <h2 className="story-title">{story.title}</h2>

                                <div className="story-footer">
                                    <div className="story-stats">
                                        <Link to={`/story/${story.id}`} className="stat-item">
                                            <MessageSquare size={14} />
                                            <span>{story.descendants || 0} comments</span>
                                        </Link>
                                    </div>

                                    <div className="story-actions">
                                        {story.url && (
                                            <a href={story.url} target="_blank" rel="noopener noreferrer" className="external-link">
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                        <Link to={`/story/${story.id}`} className="view-detail">
                                            <span>View</span>
                                            <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Home;
