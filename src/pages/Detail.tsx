import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Clock, Share2, ExternalLink, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface Comment {
    id: number;
    by: string;
    text: string;
    time: number;
    kids?: number[];
}

interface Story {
    id: number;
    title: string;
    url?: string;
    score: number;
    by: string;
    time: number;
    text?: string;
    kids?: number[];
}

const Detail = () => {
    const { id } = useParams<{ id: string }>();
    const [story, setStory] = useState<Story | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [iframeError, setIframeError] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Local simulated auth

    useEffect(() => {
        // Check local storage for persistent simulated login
        const savedLogin = localStorage.getItem('hn_logged_in') === 'true';
        setIsLoggedIn(savedLogin);

        const fetchStoryDetail = async () => {
            try {
                const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                const item = await response.json();
                setStory(item);

                if (item.kids) {
                    const commentPromises = item.kids.slice(0, 10).map((cid: number) =>
                        fetch(`https://hacker-news.firebaseio.com/v0/item/${cid}.json`).then(res => res.json())
                    );
                    const fetchedComments = await Promise.all(commentPromises);
                    setComments(fetchedComments.filter(c => c && !c.deleted));
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching story detail:', error);
                setLoading(false);
            }
        };

        fetchStoryDetail();
    }, [id]);

    const handlePostComment = () => {
        if (!isLoggedIn) {
            alert('Please login first to leave a comment!');
            return;
        }
        if (!newComment.trim()) return;

        const fakeComment: Comment = {
            id: Math.random(),
            by: 'You (Preview)',
            text: newComment,
            time: Math.floor(Date.now() / 1000)
        };

        setComments([fakeComment, ...comments]);
        setNewComment('');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading session...</p>
            </div>
        );
    }

    if (!story) return null;

    return (
        <div className="detail-page">
            {/* Article on the LEFT as requested */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="article-viewer"
            >
                <Link to="/" className="back-btn-overlay">
                    <ArrowLeft size={18} />
                    <span>Feed</span>
                </Link>

                {story.url ? (
                    <div className="iframe-wrapper">
                        {iframeError ? (
                            <div className="iframe-placeholder">
                                <h2>Unable to display article</h2>
                                <p>Site prevents embedding. Standard for many news outlets.</p>
                                <a href={story.url} target="_blank" rel="noopener noreferrer" className="external-btn">
                                    Open in New Tab
                                </a>
                            </div>
                        ) : (
                            <iframe
                                src={story.url}
                                title={story.title}
                                onError={() => setIframeError(true)}
                            />
                        )}
                    </div>
                ) : (
                    <div className="text-content-viewer">
                        <div className="text-content-card glass-panel">
                            <h1>{story.title}</h1>
                            <div dangerouslySetInnerHTML={{ __html: story.text || '' }} />
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Comments on the RIGHT as requested */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="detail-sidebar right-sidebar"
            >
                <div className="detail-header">
                    <div className="story-meta">
                        <span><User size={14} /> {story.by}</span>
                        <span><Clock size={14} /> {new Date(story.time * 1000).toLocaleDateString()}</span>
                    </div>
                    <h1>{story.title}</h1>
                    <div className="story-stats">
                        <span className="detail-score">{story.score} points</span>
                        <span className="detail-comments-count">{comments.length} comments</span>
                    </div>
                </div>

                <div className="detail-actions">
                    <button className="action-btn"><Share2 size={16} /></button>
                    <a href={story.url} target="_blank" rel="noopener noreferrer" className="action-btn">
                        <ExternalLink size={16} />
                    </a>
                </div>

                <div className="comment-section">
                    <h3>Community Discussion</h3>

                    <div className="add-comment glass-panel">
                        <textarea
                            placeholder={isLoggedIn ? "Write a comment..." : "Login to join the discussion"}
                            rows={3}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={!isLoggedIn}
                        />
                        <div className="comment-controls">
                            {!isLoggedIn && (
                                <button className="login-prompt-btn" onClick={() => {
                                    localStorage.setItem('hn_logged_in', 'true');
                                    setIsLoggedIn(true);
                                    window.location.reload(); // Refresh to update navbar
                                }}>
                                    Login
                                </button>
                            )}
                            <button className="post-btn" onClick={handlePostComment} disabled={!isLoggedIn || !newComment.trim()}>
                                <Send size={14} />
                                <span>Post</span>
                            </button>
                        </div>
                    </div>

                    <div className="comment-list">
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment-item glass-panel">
                                <div className="comment-meta">
                                    <span className="comment-author">{comment.by}</span>
                                    <span className="comment-time">{new Date(comment.time * 1000).toLocaleTimeString()}</span>
                                </div>
                                <div
                                    className="comment-text"
                                    dangerouslySetInnerHTML={{ __html: comment.text }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Detail;
