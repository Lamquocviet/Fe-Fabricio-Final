import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { uploadGame } from "@/services/gameService";

export const useUploadGame = () => {
  const schema = yup.object({
    name: yup.string().required("Tên game bắt buộc"),
    studio: yup.string().required("Studio bắt buộc"),
    price: yup.number().typeError("Phải là số").required(),
    buildType: yup.string().required(),
    shortDesc: yup.string().required(),
    description: yup.string().required(),
    youtubeUrl: yup.string().url().nullable(),

    file: yup.mixed().required("Thiếu file game"),
    thumbnail: yup.mixed().required("Thiếu thumbnail"),
    images: yup.array().min(1, "Ít nhất 1 ảnh"),
    tags: yup.array().min(1, "Chọn ít nhất 1 tag"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tags: [],
      images: [],
    },
  });

  const onSubmit = async (data) => {
    try {
      await uploadGame(data);
      alert("Upload thành công");
    } catch (err) {
      console.error(err);
      alert("Lỗi upload");
    }
  };

  const handleFile = (e) => {
    setValue("file", e.target.files[0]);
  };

  const handleThumbnail = (e) => {
    setValue("thumbnail", e.target.files[0]);
  };

  const handleImages = (e) => {
    setValue("images", Array.from(e.target.files));
  };

  const handleTags = (tag) => {
    const current = watch("tags") || [];
    const exists = current.includes(tag);

    setValue(
      "tags",
      exists
        ? current.filter((t) => t !== tag)
        : [...current, tag]
    );
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    handleFile,
    handleThumbnail,
    handleImages,
    handleTags,
    watch,
  };
};