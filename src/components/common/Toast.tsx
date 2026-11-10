import styled from 'styled-components';

import { useToastStore } from '../../stores/toastStore';

export default function Toast() {
  const message = useToastStore((state) => state.message);
  const tone = useToastStore((state) => state.tone);

  if (!message) return null;
  return (
    <Wrapper role="status" $tone={tone}>
      {message}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $tone: 'success' | 'error' }>`
  position: fixed;
  left: 50%;
  bottom: 32px;
  z-index: 200;
  max-width: calc(100% - 32px);
  padding: 12px 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $tone }) => ($tone === 'error' ? '#B91C1C' : '#1E2128')};
  box-shadow: ${({ theme }) => theme.shadow.float};
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  transform: translateX(-50%);
`;
