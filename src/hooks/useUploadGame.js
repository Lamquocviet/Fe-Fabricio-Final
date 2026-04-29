import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { uploadGame } from "@/services/gameService";

export const useUploadGame = () => {
  const schema = yup.object({
    Title: yup.string().required("Tên game bắt buộc"),
    Description: yup.string().required("Mô tả bắt buộc"),
    Price: yup.number().typeError("Giá phải là số").min(0).required(),
    GameType: yup.string().required("Loại game bắt buộc"),
    GameFile: yup.mixed().required("Thiếu file game"),
    Thumbnail: yup.mixed().required("Thiếu thumbnail"),
    TagIds: yup.array().default([]),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Title: "",
      Description: "",
      Price: 0,
      GameType: "Browser",
      TagIds: [],
    },
  });

  const onSubmit = async (data) => {
    try {
      await uploadGame(data);
      alert("Upload thành công");
      reset();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Lỗi upload");
    }
  };

  const handleGameFile = (e) => {
    setValue("GameFile", e.target.files?.[0], { shouldValidate: true });
  };

  const handleThumbnail = (e) => {
    setValue("Thumbnail", e.target.files?.[0], { shouldValidate: true });
  };

  const handleTagIds = (tagId) => {
    const current = watch("TagIds") || [];
    const exists = current.includes(tagId);

    setValue(
      "TagIds",
      exists ? current.filter((id) => id !== tagId) : [...current, tagId],
      { shouldValidate: true },
    );
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    handleGameFile,
    handleThumbnail,
    handleTagIds,
    watch,
  };
};
