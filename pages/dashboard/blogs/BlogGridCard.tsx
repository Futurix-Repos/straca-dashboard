import { Blog } from '@/components/dashboard_components/BlogList';
import React from 'react'

interface BlogGridCardProps {
    blog: Blog,
}

const BlogGridCard: React.FC<BlogGridCardProps> = ({ blog }) => {

    return (
        <div className="flex flex-col w-[258px] px-3 py-4 gap-4 rounded-sm bg-white border border-[#D9D9D9]">
            <div className="h-36 bg-black rounded-sm"
                style={{
                    backgroundImage: `url(${blog.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}></div>
            <div className="flex flex-col gap-4 justify-start items-start">
                <div className="px-2 py-1 font-light text-sm bg-[#F6F1DD]">Nouveauté</div>
                <h4 className="font-bold pr-16">{blog.title}</h4>
                <p className="font-light text-sm">{blog.createdAt}</p>
            </div>
        </div>
    )
}

export default BlogGridCard