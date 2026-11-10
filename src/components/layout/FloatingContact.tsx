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
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.625rem;

  & > a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 2.875rem;
    min-width: 2.875rem;
    border-radius: ${({ theme }) => theme.radius.full};
    box-shadow: ${({ theme }) => theme.shadow.float};
    font-size: 0.875rem;
    font-weight: 700;
  }

  & > .call {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.ink};
  }

  & > .kakao {
    padding: 0 1rem;
    background: ${({ theme }) => theme.colors.kakao};
    color: ${({ theme }) => theme.colors.kakaoText};
  }

  ${({ theme }) => theme.media.mobile} {
    right: 1rem;
    bottom: 1rem;

    & > .kakao { padding: 0; }
    & > .kakao > span { display: none; }
  }
`;
