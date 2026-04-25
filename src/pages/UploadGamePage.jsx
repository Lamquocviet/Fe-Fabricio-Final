import { useUploadGame } from "@/hooks/useUploadGame";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const TAGS = [
  "Racing",
  "Arcade",
  "Cyberpunk",
  "RPG",
  "Adventure",
  "Story",
  "Puzzle",
  "Cozy",
  "Simulation",
  "Horror",
  "Sci-Fi",
  "Strategy",
  "Turn-Based",
  "Fantasy",
  "Casual",
  "Indie",
];

export default function UploadGamePage() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleFile,
    handleThumbnail,
    handleImages,
    handleTags,
    watch,
  } = useUploadGame();

  const selectedTags = watch("tags") || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-4 lg:px-6">
          <div className="min-h-screen bg-[#050505] text-white">
            <div className="max-w-5xl mx-auto px-8">
              {/* HEADER */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 mt-0 !text-white">🎮 Đăng game mới lên cửa hàng</h1>
                <p className="text-gray-400 text-sm">
                  Tải build cho Windows, Android hoặc WebGL, thêm ảnh đại diện, ảnh show game, video YouTube, tag và giá bán.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-[#12141f] p-6 rounded-2xl border border-[#1f2130] shadow-xl mb-8"
              >
                {/* BASIC INFO */}
                <Section>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Tên game" error={errors.name?.message}>
                      <input
                        {...register("name")}
                        placeholder="Cozy Circuit"
                        className={inputCls}
                      />
                    </Input>

                    <Input label="Studio" error={errors.studio?.message}>
                      <input {...register("studio")} className={inputCls} />
                    </Input>

                    <Input label="Giá ($)" error={errors.price?.message}>
                      <input {...register("price")} className={inputCls} />
                    </Input>

                    <Input label="Build type">
                      <select {...register("buildType")} className={inputCls}>
                        <option value="windows">Windows</option>
                        <option value="android">Android</option>
                        <option value="webgl">WebGL</option>
                      </select>
                    </Input>
                  </div>
                </Section>

                {/* DESCRIPTION */}
                <Section title="Mô tả">
                  <Input label="Mô tả ngắn" error={errors.shortDesc?.message}>
                    <textarea
                      {...register("shortDesc")}
                      className={textareaCls}
                    />
                  </Input>

                  <Input
                    label="Mô tả chi tiết"
                    error={errors.description?.message}
                  >
                    <textarea
                      {...register("description")}
                      rows={4}
                      className={textareaCls}
                    />
                  </Input>
                </Section>

                {/* FILE */}
                <Section title="File game">
                  <UploadBox onChange={handleFile} />
                  {errors.file && <Error text={errors.file.message} />}
                </Section>

                {/* IMAGES */}
                <Section title="Hình ảnh">
                  <div className="grid grid-cols-2 gap-4">
                    <UploadBox onChange={handleThumbnail} />
                    <UploadBox onChange={handleImages} multiple />
                  </div>
                </Section>

                {/* YOUTUBE */}
                <Section title="Video">
                  <input
                    {...register("youtubeUrl")}
                    placeholder="YouTube link"
                    className={inputCls}
                  />
                </Section>

                {/* TAGS */}
                <Section title="Tags">
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map((tag) => {
                      const active = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTags(tag)}
                          className={`
                      px-3 py-1.5 text-sm rounded-full border transition
                      ${
                        active
  ? "bg-gradient-to-br from-[#ff6a5c] to-[#ff5a3d] text-white shadow-lg shadow-[#ff5a3d]/30"
  : "bg-[#1a1c28] border border-[#2a2d3d] text-gray-400 hover:border-orange-400 hover:text-white"
                      }
                    `}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  {errors.tags && <Error text={errors.tags.message} />}
                </Section>

                {/* SUBMIT */}
                <div className="flex justify-end pt-4 border-t border-[#1f2130]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-lg font-semibold bg-linear-to-br from-[#ff6a5c] to-[#ff5a3d] hover:from-[#ff5a3d] hover:to-[#ff6a5c] disabled:bg-gray-700 transition-all shadow-lg hover:shadow-purple-500/20 active:scale-95"
                  >
                    {isSubmitting ? "Uploading..." : "🚀 Đăng game"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////////

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-sm uppercase !text-white mb-3 tracking-wider">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-400">{label}</span>
      {children}
      {error && <Error text={error} />}
    </div>
  );
}

function UploadBox({ onChange, multiple = false }) {
  return (
    <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#2a2d3d] hover:border-purple-500 rounded-xl p-6 cursor-pointer transition">
      <input
        type="file"
        className="hidden"
        onChange={onChange}
        multiple={multiple}
      />
      <span className="text-sm text-gray-400">Click hoặc kéo file</span>
    </label>
  );
}

function Error({ text }) {
  return <p className="text-red-400 text-xs">{text}</p>;
}

//////////////////////////////////////////////////////////

const inputCls =
  "w-full bg-[#1a1c28] border border-[#2a2d3d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500";

const textareaCls = inputCls + " resize-none";
