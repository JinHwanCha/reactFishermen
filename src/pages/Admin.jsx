import { useEffect, useMemo, useState } from 'react';
import { useFishermenData } from '../hooks/useFishermenData';
import {
  supabase,
  POPUP_IMAGES_BUCKET,
  POPUP_IMAGES_TABLE,
} from '../supabase/client';
import '../styles/admin.css';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? '';
const AUTH_KEY = 'fishermen_admin_authed';

function AdminGate({ onPass }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ADMIN_PASSWORD) {
      setError('VITE_ADMIN_PASSWORD 가 설정되지 않았습니다.');
      return;
    }
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1');
      onPass();
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="admin_gate">
      <form className="admin_gate_form" onSubmit={handleSubmit}>
        <h1>Admin</h1>
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoFocus
        />
        <button type="submit">들어가기</button>
        {error && <p className="admin_gate_error">{error}</p>}
      </form>
    </div>
  );
}

function sanitizeFileName(name) {
  const dot = name.lastIndexOf('.');
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : '';
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .slice(0, 40);
  return `${base || 'img'}${ext}`;
}

function AdminItem({ item, allImages, onChanged }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const images = useMemo(
    () => allImages.filter((row) => row.post_title === item.title),
    [allImages, item.title]
  );

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    const baseOrder = images.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `${encodeURIComponent(item.title)}/${Date.now()}_${i}_${sanitizeFileName(
          file.name
        )}`;

        const { error: upErr } = await supabase.storage
          .from(POPUP_IMAGES_BUCKET)
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || undefined,
          });
        if (upErr) throw upErr;

        const { data: pub } = supabase.storage
          .from(POPUP_IMAGES_BUCKET)
          .getPublicUrl(path);

        const { error: insErr } = await supabase
          .from(POPUP_IMAGES_TABLE)
          .insert({
            post_title: item.title,
            image_url: pub.publicUrl,
            storage_path: path,
            sort_order: baseOrder + i,
          });
        if (insErr) throw insErr;
      }
      await onChanged();
    } catch (err) {
      console.error(err);
      setError(err.message || '업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (img) => {
    if (!confirm('이 이미지를 삭제할까요?')) return;
    setError('');
    try {
      const { error: stErr } = await supabase.storage
        .from(POPUP_IMAGES_BUCKET)
        .remove([img.storage_path]);
      if (stErr) console.warn('storage remove warning:', stErr);

      const { error: delErr } = await supabase
        .from(POPUP_IMAGES_TABLE)
        .delete()
        .eq('id', img.id);
      if (delErr) throw delErr;
      await onChanged();
    } catch (err) {
      console.error(err);
      setError(err.message || '삭제 실패');
    }
  };

  return (
    <li className="admin_item">
      <div className="admin_item_head">
        <img
          className="admin_item_thumb"
          src={item.imageSrc}
          alt={item.category}
        />
        <div className="admin_item_meta">
          <p className="admin_item_title">{item.title}</p>
          <p className="admin_item_sub">
            {item.category} · 모임장 {item.leaders}
          </p>
        </div>
      </div>

      <div className="admin_item_gallery">
        {images.length === 0 ? (
          <p className="admin_item_empty">등록된 이미지가 없습니다.</p>
        ) : (
          <ul className="admin_thumb_list">
            {images.map((img) => (
              <li key={img.id} className="admin_thumb">
                <img src={img.image_url} alt="" />
                <button
                  type="button"
                  className="admin_thumb_remove"
                  onClick={() => handleDelete(img)}
                  aria-label="삭제"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <label className="admin_upload_btn">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
        />
        {uploading ? '업로드 중…' : '+ 이미지 추가'}
      </label>

      {error && <p className="admin_item_error">{error}</p>}
    </li>
  );
}

function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const { data, loading } = useFishermenData();
  const [allImages, setAllImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  const loadAllImages = async () => {
    setImagesLoading(true);
    const { data: rows, error } = await supabase
      .from(POPUP_IMAGES_TABLE)
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) {
      console.error(error);
    } else {
      setAllImages(rows ?? []);
    }
    setImagesLoading(false);
  };

  useEffect(() => {
    document.body.style.background = '#f5f6f8';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  useEffect(() => {
    if (authed) loadAllImages();
  }, [authed]);

  if (!authed) return <AdminGate onPass={() => setAuthed(true)} />;

  return (
    <div className="admin_wrap">
      <header className="admin_header">
        <h1>팝업 이미지 관리</h1>
        <button
          type="button"
          className="admin_logout"
          onClick={() => {
            sessionStorage.removeItem(AUTH_KEY);
            setAuthed(false);
          }}
        >
          로그아웃
        </button>
      </header>

      {(loading || imagesLoading) && (
        <p className="admin_status">불러오는 중…</p>
      )}

      <ul className="admin_list">
        {data.map((item, idx) => (
          <AdminItem
            key={`${item.title}-${idx}`}
            item={item}
            allImages={allImages}
            onChanged={loadAllImages}
          />
        ))}
      </ul>
    </div>
  );
}

export default Admin;
