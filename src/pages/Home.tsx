import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MessageSquare, Clock, User, ChevronRight, ChevronLeft } from 'lucide-react';
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
    const [allStoryIds, setAllStoryIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const storiesPerPage = 30;

    useEffect(() => {
        const fetchStoryIds = async () => {
            try {
                const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
                const ids = await response.json();
                setAllStoryIds(ids);
            } catch (error) {
                console.error('Error fetching story IDs:', error);
            }
        };
        fetchStoryIds();
    }, []);

    useEffect(() => {
        if (allStoryIds.length === 0) return;

        const fetchStories = async () => {
            setLoading(true);
            try {
                const start = page * storiesPerPage;
                const pageIds = allStoryIds.slice(start, start + storiesPerPage);

                const storyPromises = pageIds.map((id: number) =>
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
    }, [allStoryIds, page]);

    const totalPages = Math.ceil(allStoryIds.length / storiesPerPage);
    const canGoPrev = page > 0;
    const canGoNext = page < totalPages - 1;

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
                        transition={{ delay: index * 0.02, duration: 0.2 }}
                        className="story-card-wrapper"
                    >
                        <div className="story-card glass-panel">
                            <div className="story-rank">
                                <span>{page * storiesPerPage + index + 1}</span>
                            </div>

                            <div className="story-content">
                                <div className="story-meta">
                                    <span className="story-author"><User size={12} /> {story.by}</span>
                                    <span className="story-time"><Clock size={12} /> {new Date(story.time * 1000).toLocaleDateString()}</span>
                                </div>

                                <h2 className="story-title">
                                    <Link to={`/story/${story.id}`}>{story.title}</Link>
                                </h2>

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

            {/* Pagination */}
            <div className="pagination">
                <button
                    className="pagination-btn"
                    onClick={() => setPage(p => p - 1)}
                    disabled={!canGoPrev}
                >
                    <ChevronLeft size={18} />
                    <span>Previous</span>
                </button>
                <span className="pagination-info">
                    Page {page + 1} of {totalPages}
                </span>
                <button
                    className="pagination-btn"
                    onClick={() => setPage(p => p + 1)}
                    disabled={!canGoNext}
                >
                    <span>Next</span>
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Home;
