import styled from 'styled-components';

import { StatusMessage } from './StatusMessage';

interface PhotoGalleryProps {
  urls: string[];
  isLoading?: boolean;
  count: number; // 첨부된 사진 수 (로딩 중 안내용)
}

// 첨부 사진 썸네일 (클릭 시 새 탭 원본)
export default function PhotoGallery({ urls, isLoading, count }: PhotoGalleryProps) {
  if (count === 0) return null;
  if (isLoading) return <StatusMessage>사진 {count}장을 불러오는 중이에요.</StatusMessage>;
  if (urls.length === 0) return <StatusMessage>사진을 불러오지 못했어요.</StatusMessage>;

  return (
    <Grid>
      {urls.map((url, index) => (
        <li key={url}>
          <a href={url} target="_blank" rel="noreferrer">
            <img src={url} alt={`첨부 사진 ${index + 1}`} loading="lazy" />
          </a>
        </li>
      ))}
    </Grid>
  );
}

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 8px;

  & a {
    display: block;
    aspect-ratio: 1;
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.background};
    overflow: hidden;
  }

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
  }

  & a:hover img { transform: scale(1.04); }
`;
