import { useEffect, useState } from "react";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Analyst Posts</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post._id} className="bg-white rounded shadow">
            {post.mediaType === "video" ? (
              <video controls src={post.mediaUrl} />
            ) : (
              <img src={post.mediaUrl} alt="post" />
            )}
            <p className="p-3 text-sm">{post.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}