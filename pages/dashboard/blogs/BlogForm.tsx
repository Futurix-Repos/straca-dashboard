import CustomLoader from "@/components/CustomLoader";
import { renderInputField } from "@/components/InputComponents/InputComponents";
import DropdownComponent from "@/components/InputComponents/dropdowncomponent";
import { renderFileInputField } from "@/components/InputComponents/imageinput";
import { Blog } from "@/components/dashboard_components/BlogList";
import { BlogType } from "@/components/dashboard_components/SettingComponents/blogcard";
import { GET, POST, PUT } from "@/constants/fetchConfig";
import { BLOG_INPUTS, JOB_INPUTS } from "@/constants/templates";
import { Toast } from "@/constants/toastConfig";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import router, { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { tr } from "date-fns/locale";

interface props {
  selectedBlog: Blog | null;
}
const BlogForm: React.FC<props> = ({ selectedBlog }) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { action } = router.query;
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [blogBody, setBlogBody] = useState("");
  // Attention
  const [isChanged, setIsChanged] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [blogTypes, setBlogTypes] = useState<BlogType[]>([]);

  // Use a ref to access the quill instance directly
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],

      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],

      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
    blotFormatter2: {
      image: {
        registerImageTitleBlot: tr,
      },
    },
  };

  const formats = [
    "font",
    "blockquote",
    "code-block",
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "list",
    "indent",
    "size",
    "header",
    "link",
    "image",
    "video",
    "color",
    "background",
    "clean",
  ];
  const { quill, quillRef, Quill } = useQuill({
    placeholder: "Ecrivez votre blog",
    modules,
    formats,
  });

  const wasChanged = useCallback(() => {
    if (
      selectedBlog?.blogBody !== blogBody ||
      imageFile !== null ||
      selectedBlog?.title !== title ||
      selectedBlog?.category.label !== category
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [category, blogBody, imageFile, selectedBlog, title]);
  useEffect(() => {
    if (isModify) {
      wasChanged();
    }
  }, [blogBody, category, imageFile, title, isModify, wasChanged]);
  useEffect(() => {
    const fetchBlogTypes = async () => {
      try {
        const response = await GET("/blogType");
        const data: BlogType[] = response;
        setBlogTypes(data);
      } catch (error) {
        console.error("Error fetching blog types:", error);
      }
    };

    fetchBlogTypes();
  }, []);
  useEffect(() => {
    if (action === "edit") {
      setIsModify(true);
    } else {
      setIsModify(false); // Reset to false if selectedBlog is null or action is not "edit"
    }
  }, [action]);

  useEffect(() => {
    if (isModify) {
      setTitle(selectedBlog?.title ?? "");
      console.log(`selblog==>${selectedBlog?.description}`);
      // setImageFile(selectedBlog?.image ?? null);
      setCategory(selectedBlog?.category.label ?? "");
      setBlogBody(selectedBlog?.blogBody ?? "");
    }
  }, [selectedBlog, isModify]);
  console.log(`blog====>${blogTypes.length}`);

  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(
        isModify ? selectedBlog?.blogBody ?? "" : "",
      );
    }
  }, [isModify, quill, selectedBlog?.blogBody]);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        setBlogBody(quill.root.innerHTML);
      });
    }
  }, [quill]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Function to add blog
  const addBlog = async (isPublish: boolean) => {
    if (isPublish) {
      setIsPublishing(true);
    } else {
      setIsSaving(true);
    }
    const session: any | Session = await getSession();
    const currentUser = session?.user;
    console.log(session?.user.id);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append(
        "category",
        blogTypes.find((type) => type.label === category)?._id ?? "",
      );
      formData.append("blogBody", blogBody);
      formData.append("status", isPublish ? "published" : "drafted");
      formData.append("createdBy", currentUser.id);
      if (imageFile !== null) {
        formData.append("file", imageFile!);
      }
      // Perform validation to check if all variables are not empty
      if (
        title.trim() === "" ||
        category?.trim() === "" ||
        (imageFile === null && !isModify) ||
        blogBody.trim() === ""
      ) {
        Toast.fire({
          icon: "error",
          title: `Merci de remplir tous les champs`,
        });
        return;
      }

      var response;
      if (!isModify) {
        response = await POST(`/blogs`, formData);
      } else {
        if (isChanged === false) {
          return Toast.fire({
            icon: "error",
            title: `Les champs n'ont pas été modifiés`,
          });
        }

        response = await PUT(`/blogs/${selectedBlog?._id}`, formData);
        console.log(response);
      }

      console.log(`Blog ${isModify ? "édité" : "ajouté"} avec succès!!`);
      router.back();
      Toast.fire({
        icon: "success",
        title: `Blog ${isModify ? "édité" : "ajouté"} avec succès!`,
      });
    } catch (error) {
      console.error("Error adding blog:", error);
      Toast.fire({
        icon: "error",
        title: { error },
      });
    } finally {
      if (isPublish) {
        setIsPublishing(false);
      } else {
        setIsSaving(false);
      }
    }
  };
  console.log(`itemimg====>>${selectedBlog?.image}`);
  const handleDropdownChange = (event: any) => {
    setCategory(event.target.value);
  };

  return (
    <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
      <div className="flex flex-row justify-start items-center">
        <button
          onClick={() => {
            router.back();
          }}
          className="px-4 py-2 bg-slate-400 rounded-sm"
        >
          <i className="fa-solid fa-arrow-left text-white"></i>
        </button>
        <p className="ml-2 font-semibold text-2xl">
          {isModify ? `Modifier` : `Creer`} un blog
        </p>
      </div>
      <div className="w-full flex flex-col gap-5">
        <div className="flex pt-5 justify-between">
          <div className="w-full px-4 py-3 pb-10 mb-10 bg-[#FAFBFF] rounded-[12px]">
            <div className="mb-5 flex flex-row justify-between items-center">
              <div className="flex flex-row justify-between">
                <p className="mb-3 font-semibold text-2xl">Blog</p>
              </div>
            </div>
            <div className="flex flex-col gap-5 items-center">
              <div className="flex w-full items-start  relative ">
                {imageFile || (isModify && selectedBlog?.image) ? (
                  <div className="flex flex-row items-center gap-3">
                    <Image
                      src={
                        imageFile
                          ? URL.createObjectURL(imageFile)
                          : selectedBlog?.image
                            ? selectedBlog?.image.toString()
                            : ""
                      }
                      alt="Selected Blog Image"
                      className="w-40 h-40 object-cover"
                      width="100"
                      height="100"
                    />
                    <div className="w-80 bg-white p-6 rounded-md shadow-md">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Choisissez un image du couverture:
                      </label>
                      <input
                        type="file"
                        id="fileInput"
                        name="fileInput"
                        accept="image/*"
                        onChange={(e) => {
                          handleImageChange(e);
                        }}
                        className="border-gray-300 focus:ring focus:ring-blue-200 focus:outline-none p-2 w-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md bg-white p-6 rounded-md shadow-md">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Choisissez un image du couverture:
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      name="fileInput"
                      onChange={(e) => {
                        handleImageChange(e);
                      }}
                      className="border-gray-300 focus:ring focus:ring-blue-200 focus:outline-none p-2 w-full"
                    />
                  </div>
                )}
              </div>

              <div className="flex w-full justify-between items-start gap-[18px] relative flex-[0_0_auto]">
                {renderInputField(
                  BLOG_INPUTS[0],
                  title,
                  (e) => setTitle(e.target.value),
                  undefined,
                  undefined,
                  "w-1/2",
                )}
                <div className="w-1/2">
                  <DropdownComponent
                    input={{
                      id: "category",
                      label: "Catégorie",
                      placeholder: "Select a category", // Optional placeholder
                    }}
                    value={category}
                    handleSelect={handleDropdownChange}
                    selectList={blogTypes}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-row items-start w-full gap-5">
                <button
                  onClick={() => addBlog(false)}
                  className={`my-5 px-10 py-2 text-[#3D75B0] bg-white rounded-md shadow-md ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSaving === true ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    `Enregistrer`
                  )}
                </button>

                <button
                  onClick={() => addBlog(true)}
                  className={`my-5 px-10 py-2 text-white bg-[#3D75B0] rounded-md ${
                    isPublishing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isPublishing === true ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    `Publier`
                  )}
                </button>
              </div>

              <div className="w-full h-[100vh] md:h-[70vh] mb-28">
                <p className="mb-5">{BLOG_INPUTS[3].label}</p>
                <div ref={quillRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
