import { useState, type FormEvent } from 'react';
import { Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import PhotoGallery from '../../components/common/PhotoGallery';
import { Field, Input } from '../../components/common/Field';
import { toast } from '../../stores/toastStore';
import { useDeleteInquiryMutation, useInquiryPhotosQuery, useVerifyInquiryMutation } from '../../queries/inquiries';
import { INQUIRY_STATUS_LABEL } from '../../constants/home';
import InquiryLayout from './InquiryLayout';

export default function InquiryDetailPage() {
  const navigate = useNavigate();
  const inquiryId = Number(useParams().id);

  // 상태
  const [password, setPassword] = useState(''); // 확인용 비밀번호 (삭제 시 재사용)

  // 변경
  const verifyMutation = useVerifyInquiryMutation(); // 비밀번호 확인 + 상세 조회
  const deleteMutation = useDeleteInquiryMutation(); // 비밀번호로 문의 삭제

  // 파생 데이터
  const inquiry = verifyMutation.data; // 확인 성공 시 상세 내용
  const photoCount = inquiry?.photo_paths.length ?? 0; // 첨부 사진 수

  // 조회
  const { data: photoUrls = [], isLoading: isPhotoLoading } = useInquiryPhotosQuery(inquiryId, password, photoCount > 0); // 본인 확인 후 사진 임시 URL

  // 핸들러
  const handleVerify = (event: FormEvent) => {
    event.preventDefault();
    if (!password || verifyMutation.isPending) return;
    verifyMutation.mutate({ id: inquiryId, password });
  };

  const handleDelete = () => {
    if (!window.confirm('문의를 삭제할까요? 삭제한 문의는 되돌릴 수 없어요.')) return;
    deleteMutation.mutate(
      { id: inquiryId, password },
      {
        onSuccess: () => {
          toast.success('문의를 삭제했어요.');
          navigate('/inquiries');
        },
      },
    );
  };

  if (!inquiry) {
    return (
      <InquiryLayout title="비밀글 확인">
        <Locked onSubmit={handleVerify}>
          <span className="icon">
            <Lock size={22} aria-hidden="true" />
          </span>
          <p>작성 시 입력한 비밀번호를 입력해 주세요.</p>
          <Field label="비밀번호" htmlFor="verify-password">
            <Input id="verify-password" type="password" autoFocus value={password} onChange={(event) => setPassword(event.target.value)} />
          </Field>
          <div className="actions">
            <Button $variant="secondary" onClick={() => navigate('/inquiries')}>
              목록
            </Button>
            <Button type="submit" disabled={!password || verifyMutation.isPending}>
              {verifyMutation.isPending ? '확인 중…' : '확인'}
            </Button>
          </div>
        </Locked>
      </InquiryLayout>
    );
  }

  return (
    <InquiryLayout title="매입문의">
      <Article>
        <header>
          <Chip $tone={inquiry.status === 'waiting' ? 'warning' : 'primary'}>{INQUIRY_STATUS_LABEL[inquiry.status]}</Chip>
          <h2>{inquiry.title}</h2>
          <p>
            {inquiry.author_name} · {inquiry.created_at.slice(0, 10)}
          </p>
        </header>
        <div className="content">{inquiry.content}</div>
        {photoCount > 0 && (
          <div className="photos">
            <PhotoGallery urls={photoUrls} isLoading={isPhotoLoading} count={photoCount} />
          </div>
        )}

        <Answer>
          <strong>관리자 답변</strong>
          {inquiry.answer ? (
            <>
              <p>{inquiry.answer}</p>
              {inquiry.answered_at && <small>{inquiry.answered_at.slice(0, 10)}</small>}
            </>
          ) : (
            <p className="empty">아직 답변이 등록되지 않았어요. 영업일 기준 1일 이내에 답변드려요.</p>
          )}
        </Answer>

        <div className="actions">
          <Button $variant="ghost" onClick={handleDelete} disabled={deleteMutation.isPending}>
            삭제
          </Button>
          <Button $variant="secondary" onClick={() => navigate('/inquiries')}>
            목록
          </Button>
        </div>
      </Article>
    </InquiryLayout>
  );
}

const Locked = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 360px;
  margin: 24px auto;
  text-align: center;

  & > .icon {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin: 0 auto;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  }

  & > p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & label { text-align: left; }

  & > .actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`;

const Article = styled.article`
  & > header {
    padding-bottom: 20px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  }

  & > header > h2 {
    margin-top: 12px;
    font-size: 22px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.ink};
    word-break: break-all;
  }

  & > header > p {
    margin-top: 6px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > .content {
    min-height: 120px;
    padding: 24px 0;
    font-size: 15px;
    line-height: 1.7;
    white-space: pre-wrap;
    word-break: break-all;
  }

  & > .photos { padding-bottom: 24px; }

  & > .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
  }

  ${({ theme }) => theme.media.mobile} {
    & > header > h2 { font-size: 18px; }
    & > .content { font-size: 14px; }
  }
`;

const Answer = styled.section`
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primarySoft};

  & > strong {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.primary};
  }

  & > p {
    margin-top: 8px;
    font-size: 15px;
    line-height: 1.7;
    white-space: pre-wrap;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > p.empty {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > small {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.muted};
  }
`;
