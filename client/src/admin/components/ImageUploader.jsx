import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from 'lucide-react';
import { uploadImages } from '../../services/api.js';
import { Spinner } from '../../components/ui/States.jsx';

/** Ordered image list: upload (validated and converted server-side), reorder, edit alt text, remove. */
export function ImageListEditor({ images, onChange, folder = 'products', max = 15 }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const upload = async (files) => {
    if (!files.length) return;
    setBusy(true);
    setError('');
    try {
      const res = await uploadImages([...files].slice(0, max - images.length), folder);
      onChange([...images, ...res.files.map((f) => ({ url: f.url, alt: '' }))]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };
  const move = (i, d) => {
    const next = [...images];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };

  return (
    <div>
      <ul className="space-y-3">
        {images.map((img, i) => (
          <li key={img.url} className="flex gap-3 rounded border border-hairline p-2">
            <img src={img.url} alt="" className="size-20 shrink-0 rounded-sm bg-stone object-cover" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <label className="text-[0.75rem] text-graphite" htmlFor={`alt-${i}`}>
                {i === 0 ? 'Main image — alt text' : 'Alt text'}
              </label>
              <input id={`alt-${i}`} className="field min-h-9 py-1.5 text-sm" value={img.alt || ''} maxLength={255} onChange={(e) => onChange(images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} placeholder="Describe the image" />
            </div>
            <div className="flex flex-col gap-1">
              <button type="button" className="rounded p-1.5 hover:bg-stone disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move image up">
                <ArrowUp className="size-4" />
              </button>
              <button type="button" className="rounded p-1.5 hover:bg-stone disabled:opacity-30" disabled={i === images.length - 1} onClick={() => move(i, 1)} aria-label="Move image down">
                <ArrowDown className="size-4" />
              </button>
              <button type="button" className="rounded p-1.5 text-danger hover:bg-danger/10" onClick={() => onChange(images.filter((_, j) => j !== i))} aria-label="Remove image">
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {images.length < max && (
        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-hairline px-4 py-6 text-sm text-graphite hover:border-ink hover:text-ink">
          {busy ? <Spinner className="size-4" label="Uploading" /> : <ImagePlus className="size-4" aria-hidden />}
          {busy ? 'Uploading…' : 'Upload images (JPEG, PNG or WebP, up to 5 MB each)'}
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => upload(e.target.files)} disabled={busy} />
        </label>
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

/** Single image field (category, banner, logo, social preview). */
export function SingleImageField({ label, value, onChange, folder, hint, error }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const res = await uploadImages([file], folder);
      onChange(res.files[0].url);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <p className="field-label">{label}</p>
      <div className="flex items-center gap-4">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-sm border border-hairline bg-stone">
          {value ? <img src={value} alt="" className="size-full object-cover" /> : <ImagePlus className="size-5 text-graphite" aria-hidden />}
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="btn btn-secondary btn-sm cursor-pointer">
            {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => upload(e.target.files[0])} disabled={busy} />
          </label>
          {value && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>
      </div>
      {hint && !err && !error && <p className="mt-1.5 text-[0.8125rem] text-graphite">{hint}</p>}
      {(err || error) && <p className="field-error">{err || error}</p>}
    </div>
  );
}
