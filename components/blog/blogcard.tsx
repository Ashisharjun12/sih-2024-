import React from 'react'
import Image from 'next/image'

interface BlogCardProps {
  title: string;
  description: string;
  author: string;
  date: string;
  imageUrl: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ 
  title, 
  description, 
  author, 
  date, 
  imageUrl 
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image 
          src={imageUrl} 
          alt={title} 
          layout="fill" 
          objectFit="cover" 
          className="hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{author}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
