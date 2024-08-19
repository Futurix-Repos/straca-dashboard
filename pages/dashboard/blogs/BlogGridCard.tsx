import { Blog } from "@/components/dashboard_components/BlogList";
import React, { Dispatch, SetStateAction, useMemo } from "react";

interface BlogGridCardProps {
  blog: Blog;
  handleModify: (item: Blog) => void;
  setItemToDelete: Dispatch<SetStateAction<string>>;
  toggleShowDeleteModal: () => void;
}

const BlogGridCard = ({
  blog,
  handleModify,
  setItemToDelete,
  toggleShowDeleteModal,
}: BlogGridCardProps) => {
  const getBackground = useMemo(() => {
    if (blog != null) {
      if (blog.image !== null) {
        return blog.image;
      }
    }

    return "https://placehold.co/600x400";
  }, []);

  return (
    <div className="flex flex-col w-[258px] px-3 py-4 gap-4 rounded-sm bg-white border border-[#D9D9D9]">
      <div
        className="h-36 bg-black rounded-sm"
        style={{
          backgroundImage: `url(${getBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="flex flex-col gap-4 justify-start items-start">
        <div className="px-2 py-1 font-light text-sm bg-[#F6F1DD]">
          Nouveauté
        </div>
        <h4 className="font-bold pr-16 line-clamp-3">{blog?.title ?? ""}</h4>
        <p className="font-light text-sm">{blog?.createdAt ?? ""}</p>
      </div>
      <div className="my-auto text-center flex flex-row">
        {/* Add your action buttons or links here */}
        <i
          onClick={() => {
            setItemToDelete(blog._id);
            toggleShowDeleteModal();
          }}
          className="fa-regular fa-trash-can text-red-600"
        ></i>
        <i
          onClick={() => {
            handleModify(blog);
          }}
          className="ml-4 fa-regular fa-pen-to-square text-[#5C73DB]"
        ></i>
      </div>
    </div>
  );
};

export default BlogGridCard;
