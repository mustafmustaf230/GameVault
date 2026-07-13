import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { PLATFORMS, CATEGORIES } from "../lib/utils";
import type { Platform, Category } from "../types";
import { Shield, Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

export default function PublishPage() {
  const { t } = useTranslation();
  const { session, profile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [platform, setPlatform] = useState<Platform>("pc");
  const [category, setCategory] = useState<Category>("news");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-neutral-500">{t("publish.adminOnly")}</p>
        <Link to="/signin" className="btn-primary mt-4">{t("nav.signin")}</Link>
      </div>
    );
  }

  if (!profile?.is_admin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Shield className="mx-auto h-12 w-12 text-neutral-400" />
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">{t("publish.adminOnly")}</p>
        <Link to="/" className="btn-primary mt-4">{t("nav.home")}</Link>
      </div>
    );
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
      setError("Only PNG, JPEG, WebP, and GIF images are allowed");
      return;
    }

    setError("");
    setUploading(true);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${session!.user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("article_images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("article_images")
      .getPublicUrl(fileName);

    setImageUrl(urlData.publicUrl);
    setUploading(false);
  };

  const removeImage = () => {
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const tagArray = tags.split(",").map(t => t.trim()).filter(Boolean);
    const { data, error } = await supabase
      .from("articles")
      .insert({
        title: title.trim(), summary: summary.trim(), body: body.trim(),
        cover_image_url: imageUrl.trim() || null, platform, category,
        tags: tagArray, author_id: session!.user.id,
      })
      .select("id").maybeSingle();
    if (error) { setError(error.message); setLoading(false); }
    else if (data) navigate(`/article/${data.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 animate-fade-in sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-white">{t("publish.title")}</h1>
      <p className="mt-1 text-sm text-neutral-500">{t("publish.subtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t("publish.articleTitle")}</label>
          <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="input" maxLength={200} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t("publish.summary")}</label>
          <textarea required value={summary} onChange={e => setSummary(e.target.value)} rows={2} className="input resize-none" maxLength={300} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t("publish.body")}</label>
          <textarea required value={body} onChange={e => setBody(e.target.value)} rows={8} className="input resize-none" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t("publish.imageUrl")}</label>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFileSelect} className="hidden" />

          {imageUrl ? (
            <div className="relative group overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              <img src={imageUrl} alt="Cover preview" className="h-64 w-full object-cover" />
              <button type="button" onClick={removeImage} className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-12 text-center transition-colors hover:border-primary-400 hover:bg-primary-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary-500 dark:hover:bg-primary-950/30"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                  <span className="text-sm text-neutral-500">Uploading...</span>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                    <Upload className="h-6 w-6 text-primary-500" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Click to upload an image</span>
                  <span className="text-xs text-neutral-400">PNG, JPEG, WebP, GIF — max 5MB</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t("publish.platform")}</label>
            <select value={platform} onChange={e => setPlatform(e.target.value as Platform)} className="input">
              {PLATFORMS.map(p => <option key={p} value={p}>{t(`platform.${p}`)}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t("publish.category")}</label>
            <select value={category} onChange={e => setCategory(e.target.value as Category)} className="input">
              {CATEGORIES.map(c => <option key={c} value={c}>{t(`category.${c}`)}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t("publish.tags")}</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="input" placeholder="RPG, action, multiplayer" />
        </div>
        <div className="rounded-lg bg-neutral-100 px-4 py-3 text-xs text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
          ⏳ {t("article.autoDeleteNote")}
        </div>
        {error && <p className="text-sm text-error-500">{error}</p>}
        <button type="submit" disabled={loading || uploading} className="btn-primary w-full text-base py-3">{loading ? "..." : t("publish.submit")}</button>
      </form>
    </div>
  );
}
