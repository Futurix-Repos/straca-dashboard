import React, { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/router";
import BlogGridCard from "@/pages/dashboard/blogs/components/BlogGridCard";
import { DELETE, GET } from "@/constants/fetchConfig";

import ConfirmationModal from "../../../../components/ConfirmationModal";
import CustomLoader from "../../../../components/CustomLoader";
import { getFormatedDate, htmlToPlainText } from "@/constants/markdownUtil";
import { Toast } from "@/constants/toastConfig";
import { BlogType, UserType } from "@/constants/types";

export interface Blog {
  _id: string;
  title: string;
  category: BlogType;
  image: File | null;
  description: string;
  blogBody: string;
  status: string;
  createdBy: UserType | null;
  createdAt: string;
  slug: string;
}
interface props {
  setSelectedBlog: (item: Blog) => void;
}

const BlogListComponent: React.FC<props> = ({ setSelectedBlog }) => {
  const [showGrid, setShowGrid] = useState(false);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [modify, setModify] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState<Blog>();
  const [showModal, setShowModal] = useState(false);

  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>();

  const toggleShowModal = () => {
    setShowModal(!showModal);
    if (showModal) {
      setModify(false);
    }
  };

  const handleModify = useCallback(
    (item: Blog) => {
      setSelectedBlog(item);
      router.push("?action=edit");
    },
    [router, setSelectedBlog],
  );

  const [blogsData, setBlogsData] = useState<Blog[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const [itemToDeleteId, setItemToDelete] = useState("");

  const handleDeleteItem = useCallback(async () => {
    if (itemToDeleteId.length > 0) {
      try {
        console.log(`Deleting employee with ID: ${itemToDeleteId}`);
        const response = await DELETE(`/blogs/${itemToDeleteId}`);

        Toast.fire({
          icon: "success",
          title: `Supprimé avec succès`,
        });
        router.reload();
      } catch (error) {
        console.error(`Error deleting:`, error);
        Toast.fire({
          icon: "error",
          title: `Échec de la suppression`,
        });
      }
    }
  }, [itemToDeleteId, router]);

  // Function to fetch commandes data
  const fetchBlogsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await GET(
        `/blogs${
          searchText.length > 0 ? `?search=${searchText.toLowerCase()}` : ""
        }`,
      );

      const data: Blog[] = response;
      // Set the fetched data into state
      setBlogsData(data);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: { error },
      });
      console.error("Error fetching data:", error);
      // Handle errors
    }
  }, [searchText]);

  useEffect(() => {
    fetchBlogsData().finally(() => setLoading(false));
  }, [fetchBlogsData]);

  return (
    <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
      <div className="flex flex-row justify-between items-center">
        <p className="mb-3 font-semibold text-2xl">Gestion des Blogs</p>
        <button
          onClick={toggleShowModal}
          className="inline-flex h-[48px] items-center justify-center gap-[8px] p-[16px] relative bg-[#3D75B0] rounded-md"
        >
          <div
            onClick={() => {
              router.push("?action=new");
            }}
            className="relative w-fit mt-[-4.00px] mb-[-2.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[normal]"
          >
            Ajouter un blog
          </div>
          <i className="fa-solid fa-plus ml-1 text-white"></i>
        </button>
      </div>
      <div className="pt-5">
        <div className="px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row justify-between">
              <p className="mb-3 font-semibold text-2xl">Liste des blogs</p>
            </div>
            <div className="flex flex-row w-[60%] justify-between">
              <div className="relative w-[90%]">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full px-4 py-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Recherche ..."
                  onChange={(e) => {
                    clearTimeout(timer);

                    let newTimer = setTimeout(() => {
                      setSearchText(e.target.value);
                    }, 500);

                    setTimer(newTimer);
                  }}
                />
              </div>
              <button
                onClick={() => {
                  setShowGrid(!showGrid);
                }}
                className="px-4 py-2 bg-slate-400 rounded-sm"
              >
                <i
                  className={`${showGrid ? "fa-solid" : "fa-brands"} ${
                    showGrid ? "fa-list" : "fa-windows"
                  } text-slate-800`}
                ></i>
              </button>
            </div>
          </div>
          {/* Table */}

          {loading ? (
            <CustomLoader />
          ) : (
            <div className="w-full flex flex-col rounded-[12px] border-blue-600">
              <div className="w-full inline-flex flex-col items-start gap-[16px]">
                <div className="container mx-auto mt-8 overflow-auto">
                  {showGrid ? (
                    // Grid
                    <div className="gap-y-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
                      {blogsData.map((item, index) => (
                        <BlogGridCard
                          key={index}
                          blog={item}
                          handleModify={handleModify}
                          setItemToDelete={setItemToDelete}
                          toggleShowDeleteModal={toggleShowDeleteModal}
                        />
                      ))}
                    </div>
                  ) : (
                    // Table
                    <table className="min-w-full text-center">
                      <thead>
                        <tr className="text-gray-500">
                          <th className="py-2 px-4 border-b">Titre</th>
                          <th className="py-2 px-4 border-b">Catégorie</th>
                          <th className="py-2 px-4 border-b">Editeur</th>
                          <th className="py-2 px-4 border-b">Description</th>
                          <th className="py-2 px-4 border-b">
                            Date de creation
                          </th>
                          <th className="py-2 px-4 border-b">Status</th>
                          <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogsData.map((item) => {
                          // Description
                          const plainDescription = htmlToPlainText(
                            item.description,
                            { maxLines: 2, maxLength: 30 },
                          );

                          // DateTime
                          const formattedDateString = getFormatedDate(
                            item.createdAt,
                          );

                          return (
                            <tr key={item._id}>
                              <td className="py-2 px-4 border-b ">
                                <div className="max-h-20 overflow-y-auto">
                                  {item.title}
                                </div>
                              </td>
                              <td className="py-2 px-4 border-b">
                                {item.category.label}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {item.createdBy?.email ?? ""}
                              </td>
                              <td className="py-2 px-4 border-b ">
                                <div className="max-h-20 overflow-y-auto">
                                  {item.description}
                                </div>
                              </td>
                              <td className="py-2 px-4 border-b">
                                {formattedDateString}
                              </td>
                              <td className="py-2 px-4 border-b  ">
                                <div
                                  className={`px-4 py-2 rounded-3xl items-center justify-center text-center ${
                                    item.status.toLocaleLowerCase() ===
                                    "published"
                                      ? "bg-[#DCFCE7]"
                                      : "bg-[#FFEDD5]"
                                  } ${
                                    item.status.toLocaleLowerCase() ===
                                    "published"
                                      ? "text-[#166534]"
                                      : "text-[#9A3412]"
                                  }`}
                                >
                                  {item.status}
                                </div>
                              </td>
                              <td className="py-2 px-4 border-b text-center">
                                {/* Add your action buttons or links here */}
                                <i
                                  onClick={() => {
                                    setItemToDelete(item._id);
                                    toggleShowDeleteModal();
                                  }}
                                  className="fa-regular fa-trash-can text-red-600 cursor-pointer"
                                ></i>
                                <i
                                  onClick={() => {
                                    handleModify(item);
                                  }}
                                  className="ml-4 fa-regular fa-pen-to-square text-[#5C73DB] cursor-pointer"
                                ></i>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isVisible={showDeleteModal}
        onClose={() => {
          toggleShowDeleteModal();
        }}
        onYesClick={handleDeleteItem}
      />
      {/* <AddClientModal
                isVisible={showModal}
                onClose={toggleShowModal}
                type='employee'
                isModify={modify}
                selectedUser={selectedEmployee!}
            />
            */}
    </div>
  );
};
export default BlogListComponent;
