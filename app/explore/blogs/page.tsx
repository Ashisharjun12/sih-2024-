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
    imageUrl: "https://cloud.appwrite.io/v1/storage/buckets/6751f5b2001b866143e5/files/675ab75d000ec3144c0f/view?project=6751f4b40018a3ea8247&project=6751f4b40018a3ea8247&mode=admin"
    
  },
  {
    id: 3,
    title: "Cybersecurity in 2023",
    description: "Key trends and strategies to protect your digital assets.",
    author: "Alex Johnson",
    date: "June 1, 2023",
    imageUrl: "https://cloud.appwrite.io/v1/storage/buckets/6751f5b2001b866143e5/files/675ab75c0019987dba73/view?project=6751f4b40018a3ea8247&project=6751f4b40018a3ea8247&mode=admin"
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
