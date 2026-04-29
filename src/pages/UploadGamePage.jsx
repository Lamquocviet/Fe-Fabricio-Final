import { useUploadGame } from "@/hooks/useUploadGame";
import { useTag } from "@/hooks/useTag";
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
    handleGameFile,
    handleThumbnail,
    handleTagIds,
    watch,
  } = useUploadGame();

  const { tags } = useTag();
  
  console.log("=== UPLOAD PAGE ===");
  console.log("Available tags:", tags);
  console.log("Selected TagIds:", watch("TagIds"));

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
                <h1 className="text-3xl font-bold mb-2 mt-0 !text-white">
                  🎮 Đăng game mới lên cửa hàng
                </h1>
                <p className="text-gray-400 text-sm">
                  Tải build cho Windows, Android hoặc WebGL, thêm ảnh đại diện,
                  ảnh show game, video YouTube, tag và giá bán.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-[#12141f] p-6 rounded-2xl border border-[#1f2130] shadow-xl mb-8"
              >
                {/* BASIC INFO */}
                <Section>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Hàng 1 */}
                    <Input label="Tên game" error={errors.Title?.message}>
                      <input
                        {...register("Title")}
                        placeholder="Cozy Circuit"
                        className={inputCls}
                      />
                    </Input>

                    <Input label="Giá ($)" error={errors.Price?.message}>
                      <input
                        type="number"
                        step="0.01"
                        {...register("Price")}
                        className={inputCls}
                      />
                    </Input>

                    <Input label="Game Type" error={errors.GameType?.message}>
                      <select {...register("GameType")} className={inputCls}>
                        <option value="Browser">Browser</option>
                        <option value="Download">Download</option>
                      </select>
                    </Input>

                    {/* Hàng 2 - span full */}
                    <div className="col-span-3">
                      <Input label="Mô tả" error={errors.Description?.message}>
                        <textarea
                          {...register("Description")}
                          rows={4}
                          className={textareaCls}
                        />
                      </Input>
                    </div>
                  </div>
                </Section>

                {/* FILE */}
                <Section title="File game">
                  <UploadBox onChange={handleGameFile} />
                  {errors.GameFile && <Error text={errors.GameFile.message} />}
                </Section>

                {/* IMAGES */}
                <Section title="Thumbnail">
                  <UploadBox onChange={handleThumbnail} />
                  {errors.Thumbnail && (
                    <Error text={errors.Thumbnail.message} />
                  )}
                </Section>

                {/* TAGS */}
                <Section title="Tags">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const active = watch("TagIds").includes(tag.id);

                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagIds(tag.id)}
                          className={`px-3 py-1.5 text-sm rounded-full border transition ${
                            active
                              ? "bg-gradient-to-br from-[#ff6a5c] to-[#ff5a3d] text-white shadow-lg shadow-[#ff5a3d]/30"
                              : "bg-[#1a1c28] border border-[#2a2d3d] text-gray-400 hover:border-orange-400 hover:text-white"
                          }`}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
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
