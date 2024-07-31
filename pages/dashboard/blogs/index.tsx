import React, { ReactElement, useCallback, useState } from "react";
import DashboardLayout from "../layout";
import {
  Blog,
  BlogListComponent,
} from "@/components/dashboard_components/BlogList";
import BlogForm from "./BlogForm";
import { useRouter } from "next/router";
import DeleteCountryModal from "@/components/dashboard_components/SettingComponents/SettingPopups/DeleteCountryModal";
import { DELETE } from "@/constants/fetchConfig";
import { Toast } from "@/constants/toastConfig";

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
