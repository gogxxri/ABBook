import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../../components/common/Button';
import { Field, Input, Textarea } from '../../components/common/Field';
import PhotoPicker from '../../components/common/PhotoPicker';
import { toast } from '../../stores/toastStore';
import { useCreateInquiryMutation } from '../../queries/inquiries';
import InquiryLayout from './InquiryLayout';

const MIN_PASSWORD_LENGTH = 4;

// 문의 내용 기본 양식
const CONTENT_TEMPLATE = `매입 희망 항목 : 
수량 : 
상태 : 
지역 : 
전화번호 : `;

export default function InquiryWritePage() {
  const navigate = useNavigate();

  // 상태
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState(CONTENT_TEMPLATE); // 기본 양식으로 시작
  const [photos, setPhotos] = useState<File[]>([]); // 첨부 사진 (최대 5장)

  // 변경
  const createInquiryMutation = useCreateInquiryMutation(); // 비밀글 문의 등록

  // 파생 데이터
  const isPasswordValid = password.length >= MIN_PASSWORD_LENGTH;
  const isContentFilled = content.trim() !== '' && content.trim() !== CONTENT_TEMPLATE.trim(); // 양식만 남은 경우 제외
  const canSubmit = title.trim() && author.trim() && isContentFilled && isPasswordValid && !createInquiryMutation.isPending;

  // 핸들러
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    createInquiryMutation.mutate(
      { title: title.trim(), author: author.trim(), password, content: content.trim(), photos },
      {
        onSuccess: () => {
          toast.success('문의가 등록됐어요. 비밀번호를 꼭 기억해 주세요.');
          navigate('/inquiries');
        },
      },
    );
  };

  return (
    <InquiryLayout title="문의하기" description="답변은 이 게시판에서 비밀번호로 확인할 수 있어요.">
      <Form onSubmit={handleSubmit}>
        <Field label="제목" htmlFor="inquiry-title" required>
          <Input id="inquiry-title" value={title} maxLength={100} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Row>
          <Field label="작성자" htmlFor="inquiry-author" required>
            <Input id="inquiry-author" value={author} maxLength={20} onChange={(event) => setAuthor(event.target.value)} />
          </Field>
          <Field
            label="비밀번호"
            htmlFor="inquiry-password"
            required
            hint={`${MIN_PASSWORD_LENGTH}자 이상 · 문의 확인과 삭제에 사용돼요`}
          >
            <Input
              id="inquiry-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
        </Row>
        <Field label="내용" htmlFor="inquiry-content" required>
          <Textarea
            id="inquiry-content"
            value={content}
            maxLength={5000}
            onChange={(event) => setContent(event.target.value)}
            style={{ minHeight: '13.75rem' }}
          />
        </Field>
        <Field label="사진 첨부" htmlFor="inquiry-photos" hint="제품 외관, 모델 스티커, 파손 부위 사진이 있으면 견적이 정확해져요. 작성자와 관리자만 볼 수 있어요.">
          <PhotoPicker photos={photos} onChange={setPhotos} />
        </Field>
        <Actions>
          <Button $variant="secondary" onClick={() => navigate('/inquiries')}>
            취소
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            {createInquiryMutation.isPending ? (photos.length ? '사진 업로드 중…' : '등록 중…') : '등록하기'}
          </Button>
        </Actions>
      </Form>
    </InquiryLayout>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;

  ${({ theme }) => theme.media.mobile} {
    & > button { flex: 1; }
  }
`;
