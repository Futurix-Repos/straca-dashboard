import React, { ReactElement, useCallback, useState } from "react";
import DashboardLayout from "../layout";
import BlogListComponent, {
  Blog,
} from "@/pages/dashboard/blogs/components/BlogList";
import BlogForm from "./components/BlogForm";
import { useRouter } from "next/router";

const BlogsPage = () => {
  const router = useRouter();
  const { action } = router.query; // Access action query parameter
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  return (
    <>
      {action === "new" || action === "edit" ? (
        <BlogForm selectedBlog={selectedBlog} />
      ) : (
        <BlogListComponent setSelectedBlog={setSelectedBlog} />
      )}
    </>
  );
};

BlogsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BlogsPage;
