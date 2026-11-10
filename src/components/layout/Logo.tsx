import { Link } from 'react-router-dom';
import styled from 'styled-components';

import logoImage from '../../assets/logo.png';

interface LogoProps {
  $height?: number;
}

export default function Logo({ $height = 36 }: LogoProps) {
  return (
    <LogoLink to="/" $height={$height}>
      <img src={logoImage} alt="에이비북 - 중고 노트북 전문" />
    </LogoLink>
  );
}

const LogoLink = styled(Link)<{ $height: number }>`
  display: inline-flex;
  flex-shrink: 0;

  & > img {
    width: auto;
    height: ${({ $height }) => $height}px;
    /* 로고 이미지의 흰 배경을 밝은 배경과 자연스럽게 합성 */
    mix-blend-mode: multiply;
  }

  ${({ theme }) => theme.media.mobile} {
    & > img { height: ${({ $height }) => Math.round($height * 0.86)}px; }
  }
`;
