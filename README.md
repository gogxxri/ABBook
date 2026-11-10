# 에이비북 웹

중고 노트북·IT기기 매입 사이트 (React + TypeScript + Vite + Supabase)

- 일반 사용자: 로그인 없이 AI 견적, 매입신청, 비밀번호 문의 작성·확인·삭제
- 관리자(`/admin`): 매입신청 관리, 문의 답변, 단가표 관리, 매입후기 관리

## 1. Supabase 설정

1. [supabase.com](https://supabase.com)에서 새 프로젝트를 만들어요.
2. **SQL Editor**에 `supabase/schema.sql` 전체를 붙여넣고 실행해요.
3. **Authentication > Sign In / Providers**에서 `Allow new users to sign up`을 꺼요. 관리자만 로그인하도록 하기 위해서예요.
4. **Authentication > Users > Add user**로 관리자 계정(이메일·비밀번호)을 만들어요.
5. SQL Editor에서 그 계정을 관리자로 등록해요.

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = '관리자@이메일.com';
   ```

6. **Project Settings > API**에서 `Project URL`과 `anon public` 키를 복사해요.
7. 문의 사진을 작성자가 비밀번호로 볼 수 있도록 Edge Function을 배포해요. ([Supabase CLI](https://supabase.com/docs/guides/cli) 필요)

   ```bash
   supabase login
   supabase link --project-ref <프로젝트 ref>
   supabase functions deploy inquiry-photos --no-verify-jwt
   ```

## 2. 로컬 실행

```bash
cp .env.example .env   # 값 채우기
npm install
npm run dev
```

## 3. 배포 (Vercel)

1. GitHub에 올리고 Vercel에서 저장소를 Import 해요.
2. Environment Variables에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 등록해요.
3. Build command `npm run build`, Output directory `dist` (자동 인식). `vercel.json`이 새로고침 404를 막아요.
4. Supabase **Authentication > URL Configuration**의 Site URL을 배포 주소로 바꿔요.

## 보안 구조

- 문의 비밀번호는 bcrypt 해시로 저장하고, 상세 조회·삭제는 DB 함수(`get_inquiry`, `delete_inquiry`)에서 비밀번호를 검증해요.
- 공개 목록은 `inquiry_list` 뷰로 제목·마스킹된 작성자·상태만 노출해요.
- 매입신청은 누구나 등록만 가능하고, 조회·수정은 `admins` 테이블에 등록된 계정만 가능해요(RLS).
- 신청 사진은 비공개 버킷에 저장되고 관리자만 10분짜리 임시 URL로 열람해요.
- 문의 사진도 비공개 버킷(`inquiry-photos`)에 저장돼요. 관리자는 직접, 작성자는 Edge Function이 비밀번호를 확인한 뒤 발급하는 10분짜리 임시 URL로만 볼 수 있어요.
- 문의를 삭제해도 저장소의 사진 파일은 남아요. 필요하면 Supabase Storage에서 정리해 주세요.
