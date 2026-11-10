import { MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { COMPANY_INFO } from '../../constants/home';

export default function FloatingContact() {
  return (
    <Wrapper>
      <a href={`tel:${COMPANY_INFO.phone}`} className="call" aria-label="전화 상담">
        <Phone size={18} />
      </a>
      <Link to="/#quote" className="kakao" aria-label="카카오톡 상담">
        <MessageCircle size={18} />
        <span>카톡 상담</span>
      </Link>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;

  & > a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 46px;
    min-width: 46px;
    border-radius: ${({ theme }) => theme.radius.full};
    box-shadow: ${({ theme }) => theme.shadow.float};
    font-size: 14px;
    font-weight: 700;
  }

  & > .call {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.ink};
  }

  & > .kakao {
    padding: 0 16px;
    background: ${({ theme }) => theme.colors.kakao};
    color: ${({ theme }) => theme.colors.kakaoText};
  }

  ${({ theme }) => theme.media.mobile} {
    right: 16px;
    bottom: 16px;

    & > .kakao { padding: 0; }
    & > .kakao > span { display: none; }
  }
`;
