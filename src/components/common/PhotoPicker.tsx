import { useEffect, useMemo, useRef, type ChangeEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
import styled from 'styled-components';

import { toast } from '../../stores/toastStore';
import { MAX_PHOTO_BYTES, MAX_PHOTO_COUNT } from '../../utils/image';

interface PhotoPickerProps {
  photos: File[];
  onChange: (photos: File[]) => void;
}

// 다중 사진 첨부 + 미리보기
export default function PhotoPicker({ photos, onChange }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 파생 데이터
  const previewUrls = useMemo(() => photos.map((photo) => URL.createObjectURL(photo)), [photos]); // 미리보기 주소

  // 미리보기 URL 해제
  useEffect(() => () => previewUrls.forEach((url) => URL.revokeObjectURL(url)), [previewUrls]);

  // 핸들러
  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = '';

    const images = selected.filter((file) => file.type.startsWith('image/'));
    const sized = images.filter((file) => file.size <= MAX_PHOTO_BYTES);
    if (sized.length < selected.length) toast.error('10MB 이하 이미지 파일만 첨부할 수 있어요.');

    const next = [...photos, ...sized];
    if (next.length > MAX_PHOTO_COUNT) toast.error(`사진은 최대 ${MAX_PHOTO_COUNT}장까지 첨부할 수 있어요.`);
    onChange(next.slice(0, MAX_PHOTO_COUNT));
  };

  const handleRemove = (index: number) => onChange(photos.filter((_, itemIndex) => itemIndex !== index));

  return (
    <Wrapper>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={handleSelect} />
      {previewUrls.map((url, index) => (
        <div key={url} className="thumb">
          <img src={url} alt={`첨부 사진 ${index + 1}`} />
          <button type="button" aria-label={`사진 ${index + 1} 삭제`} onClick={() => handleRemove(index)}>
            <X size={14} />
          </button>
        </div>
      ))}
      {photos.length < MAX_PHOTO_COUNT && (
        <button type="button" className="add" onClick={() => inputRef.current?.click()}>
          <ImagePlus size={20} aria-hidden="true" />
          <span>
            {photos.length}/{MAX_PHOTO_COUNT}
          </span>
        </button>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  & > .thumb,
  & > .add {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: ${({ theme }) => theme.radius.sm};
    overflow: hidden;
  }

  & > .thumb > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  & > .thumb > button {
    position: absolute;
    top: 4px;
    right: 4px;
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(17, 24, 39, 0.7);
    color: #fff;
  }

  & > .add {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    border: 1.5px dashed ${({ theme }) => theme.colors.line};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > .add:hover { border-color: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primary}; }

  ${({ theme }) => theme.media.small} {
    & > .thumb, & > .add { width: 72px; height: 72px; }
  }
`;
