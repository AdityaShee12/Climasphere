const calculateScore = (post) => {

    const now = Date.now();

    const createdAt = new Date(post.createdAt).getTime();

    const hours = (now - createdAt) / (1000 * 60 * 60);

    const freshness = Math.max(0, 48 - hours);

    return Number(
        (
            (post.post.likesCount * 4) +
            (post.post.commentsCount * 8) +
            (post.post.sharesCount * 12) +
            (post.post.viewsCount * 0.1) +
            freshness
        ).toFixed(2)
    );
}

export default calculateScore;