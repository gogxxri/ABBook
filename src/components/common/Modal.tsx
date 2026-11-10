import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}

export default function Modal({ isOpen, title, onClose, children, footer, width = 520 }: ModalProps) {
  // 열림 동안 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <Backdrop onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <Dialog role="dialog" aria-modal="true" aria-label={title} $width={width}>
        <header>
          <h2>{title}</h2>
          <button type="button" aria-label="닫기" onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        <div className="body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </Dialog>
    </Backdrop>,
    document.body,
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(17, 24, 39, 0.5);

  ${({ theme }) => theme.media.mobile} {
    align-items: flex-end;
    padding: 0;
  }
`;

const Dialog = styled.div<{ $width: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ $width }) => $width / 16}rem;
  max-height: calc(100dvh - 2rem);
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.float};

  & > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 1.125rem 1.25rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  }

  & > header > h2 {
    font-size: 1.0625rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > header > button {
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: ${({ theme }) => theme.radius.sm};
    color: ${({ theme }) => theme.colors.muted};
  }

  & > .body {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    padding: 1.25rem;
    overflow-y: auto;
  }

  & > footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.875rem 1.25rem;
    border-top: 1px solid ${({ theme }) => theme.colors.line};
  }

  ${({ theme }) => theme.media.mobile} {
    max-width: none;
    max-height: 92dvh;
    border-radius: ${({ theme }) => theme.radius.lg} ${({ theme }) => theme.radius.lg} 0 0;

    & > .body { padding: 1rem; }
    & > footer { padding: 0.75rem 1rem; }
    & > footer > button { flex: 1; }
  }
`;
