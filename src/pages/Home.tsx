import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
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
    const [searchParams, setSearchParams] = useSearchParams();
    const [stories, setStories] = useState<Story[]>([]);
    const [allStoryIds, setAllStoryIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const page = parseInt(searchParams.get('page') || '1', 10) - 1; // 0-indexed internally
    const storiesPerPage = 30;

    const setPage = (newPage: number) => {
        setSearchParams({ page: String(newPage + 1) });
    };

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

            <div className="story-list">
                {stories.map((story, index) => (
                    <motion.div
                        key={story.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.01, duration: 0.15 }}
                        className="story-item"
                    >
                        <span className="story-rank">{page * storiesPerPage + index + 1}.</span>
                        <div className="story-content">
                            <Link to={`/story/${story.id}`} className="story-title">
                                {story.title}
                            </Link>
                            <div className="story-meta">
                                <span>{story.score} points</span>
                                <span>by {story.by}</span>
                                <Link to={`/story/${story.id}`}>{story.descendants || 0} comments</Link>
                                {story.url && (
                                    <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-domain">
                                        ({new URL(story.url).hostname.replace('www.', '')})
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    className="pagination-btn"
                    onClick={() => setPage(page - 1)}
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
                    onClick={() => setPage(page + 1)}
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
