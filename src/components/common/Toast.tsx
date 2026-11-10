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
  bottom: 2rem;
  z-index: 200;
  max-width: calc(100% - 2rem);
  padding: 0.75rem 1.125rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $tone }) => ($tone === 'error' ? '#B91C1C' : '#1E2128')};
  box-shadow: ${({ theme }) => theme.shadow.float};
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  transform: translateX(-50%);
`;
