import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { checkIsAdmin, signInAdmin, signOutAdmin } from '../../api/auth';
import Button from '../../components/common/Button';
import { Field, FormError, Input } from '../../components/common/Field';
import Logo from '../../components/layout/Logo';
import { isSupabaseConfigured, toErrorMessage } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  // 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState(false); // 로그인 요청 중복 방지

  // 핸들러
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isPending) return;
    setIsPending(true);
    setErrorMessage('');

    try {
      await signInAdmin(email.trim(), password);
      // 로그인은 됐지만 admins 테이블에 없는 계정은 즉시 로그아웃
      if (!(await checkIsAdmin())) {
        await signOutAdmin();
        setErrorMessage('관리자 권한이 없는 계정이에요.');
        return;
      }
      useAuthStore.setState({ isAdmin: true });
      navigate('/admin', { replace: true });
    } catch (error) {
      const message = toErrorMessage(error);
      setErrorMessage(message === 'Invalid login credentials' ? '이메일 또는 비밀번호가 올바르지 않아요.' : message);
    } finally {
      setIsPending(false);
    }
  };

  if (isAdmin) return <Navigate to="/admin" replace />;

  return (
    <Wrapper>
      <Card onSubmit={handleSubmit}>
        <Logo />
        <h1>관리자 로그인</h1>
        {!isSupabaseConfigured && <FormError>Supabase 환경변수(.env)가 설정되지 않았어요.</FormError>}
        <Field label="이메일" htmlFor="admin-email">
          <Input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
        </Field>
        <Field label="비밀번호" htmlFor="admin-password">
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        {errorMessage && <FormError>{errorMessage}</FormError>}
        <Button type="submit" $size="lg" $block disabled={!email || !password || isPending}>
          {isPending ? '로그인 중…' : '로그인'}
        </Button>
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: 1rem;
`;

const Card = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 23.75rem;
  padding: 2rem 1.75rem;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.card};

  & > h1 {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.ink};
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 1.5rem 1.125rem;
  }
`;
