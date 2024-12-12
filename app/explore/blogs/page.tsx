import React from 'react'
import BlogCard from '@/components/blog/blogcard'

const FAKE_BLOGS = [
  {
    id: 1,
    title: "The Future of AI",
    description: "Exploring the latest advancements in artificial intelligence and machine learning.",
    author: "Jane Doe",
    date: "May 15, 2023",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71"
  },
  {
    id: 2,
    title: "Sustainable Technology",
    description: "How tech innovations are helping to combat climate change.",
    author: "John Smith",
    date: "April 22, 2023",
    imageUrl: ""
    
  },
  {
    id: 3,
    title: "Cybersecurity in 2023",
    description: "Key trends and strategies to protect your digital assets.",
    author: "Alex Johnson",
    date: "June 1, 2023",
    imageUrl: "#"
  }
]

const BlogsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Blogs</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {FAKE_BLOGS.map((blog) => (
          <BlogCard 
            key={blog.id}
            title={blog.title}
            description={blog.description}
            author={blog.author}
            date={blog.date}
            imageUrl={blog.imageUrl}
          />
        ))}
      </div>
    </div>
  )
}

export default BlogsPage
