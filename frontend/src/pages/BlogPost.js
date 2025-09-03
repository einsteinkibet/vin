// pages/BlogPost.js  
import React from 'react';
import { useParams } from 'react-router-dom';

const BlogPost = () => {
  const { id } = useParams();
  return (
    <div className="container py-5">
      <div className="text-center">
        <h1>Blog Post #{id}</h1>
        <p className="text-muted">This blog post is coming soon</p>
      </div>
    </div>
  );
};

export default BlogPost;