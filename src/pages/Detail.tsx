import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Clock, ExternalLink, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface Comment {
    id: number;
    by: string;
    text: string;
    time: number;
    kids?: number[];
    children?: Comment[];
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

const processCommentText = (html: string) => {
    if (!html) return '';
    // Add target="_blank" and rel="noopener noreferrer" to all <a> tags
    return html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
};

const CommentItem = ({ comment, depth }: { comment: Comment; depth: number }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasReplies = comment.children && comment.children.length > 0;

    // Different colors for different nesting levels
    const depthColors = ['#ff6600', '#9b59b6', '#3498db', '#2ecc71', '#e74c3c'];
    const borderColor = depthColors[depth % depthColors.length];

    return (
        <div
            className="comment-thread"
            style={{
                marginLeft: depth > 0 ? 16 : 0,
                borderLeftColor: depth > 0 ? borderColor : 'transparent'
            }}
        >
            <div className={`comment-item ${depth === 0 ? 'glass-panel' : ''}`}>
                <div
                    className={`comment-meta ${hasReplies ? 'clickable' : ''}`}
                    onClick={hasReplies ? () => setIsExpanded(!isExpanded) : undefined}
                >
                    <span className="comment-author">{comment.by}</span>
                    <span className="comment-time">{new Date(comment.time * 1000).toLocaleTimeString()}</span>
                    {hasReplies && (
                        <span className="reply-count">
                            {isExpanded ? '▼' : '▶'} {comment.children!.length} replies
                        </span>
                    )}
                </div>
                <div
                    className="comment-text"
                    dangerouslySetInnerHTML={{ __html: processCommentText(comment.text) }}
                />
            </div>
            {hasReplies && isExpanded && (
                <div className="comment-replies">
                    {comment.children!.map((child) => (
                        <CommentItem key={child.id} comment={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const Detail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [story, setStory] = useState<Story | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    // Splitter state
    const [sidebarWidth, setSidebarWidth] = useState(500);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = containerRect.right - e.clientX;
        const minWidth = 300;
        const maxWidth = containerRect.width * 0.6;
        setSidebarWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        const fetchStoryDetail = async () => {
            try {
                const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                const item = await response.json();
                setStory(item);

                if (item.kids) {
                    const fetchCommentsRecursive = async (ids: number[], depth: number = 0): Promise<Comment[]> => {
                        if (depth > 2 || ids.length === 0) return []; // Limit depth to 2 levels
                        const commentsData = await Promise.all(
                            ids.slice(0, depth === 0 ? 15 : 5).map(async (cid: number) => {
                                const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${cid}.json`);
                                const comment = await res.json();
                                if (!comment || comment.deleted || comment.dead) return null;
                                if (comment.kids && comment.kids.length > 0) {
                                    comment.children = await fetchCommentsRecursive(comment.kids, depth + 1);
                                }
                                return comment;
                            })
                        );
                        return commentsData.filter((c): c is Comment => c !== null);
                    };
                    const fetchedComments = await fetchCommentsRecursive(item.kids);
                    setComments(fetchedComments);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching story detail:', error);
                setLoading(false);
            }
        };

        fetchStoryDetail();
    }, [id]);

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
        <div className="detail-page" ref={containerRef}>
            {/* Article on the LEFT as requested */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="article-viewer"
            >
                <button onClick={() => navigate(-1)} className="back-btn-overlay">
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>

                {story.url ? (
                    <div className="iframe-wrapper">
                        <iframe
                            src={story.url}
                            title={story.title}
                        />
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

            {/* Draggable Splitter */}
            <div
                className={`splitter ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleMouseDown}
            >
                <GripVertical size={16} />
            </div>

            {/* Comments on the RIGHT as requested */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="detail-sidebar right-sidebar"
                style={{ width: sidebarWidth, flexShrink: 0 }}
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
                    <a href={`https://news.ycombinator.com/item?id=${story.id}`} target="_blank" rel="noopener noreferrer" className="action-btn" title="View on Hacker News">
                        <ExternalLink size={16} />
                    </a>
                    {story.url && (
                        <a href={story.url} target="_blank" rel="noopener noreferrer" className="action-btn primary-action-btn" title="Open Article">
                            <span>Open Article</span>
                        </a>
                    )}
                </div>

                <div className="comment-section">
                    <h3>Community Discussion</h3>

                    <div className="comment-list">
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} depth={0} />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Detail;
