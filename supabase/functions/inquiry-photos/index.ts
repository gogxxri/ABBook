// 문의 작성자가 비밀번호로 첨부 사진을 열람하기 위한 Edge Function
// 배포: supabase functions deploy inquiry-photos --no-verify-jwt
import { createClient } from 'jsr:@supabase/supabase-js@2';

const BUCKET = 'inquiry-photos';
const SIGNED_URL_TTL = 60 * 10; // 10분

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const { id, password } = await request.json().catch(() => ({}));
  if (!Number.isInteger(id) || typeof password !== 'string' || !password) {
    return json({ error: '잘못된 요청입니다.' }, 400);
  }

  // 서비스 키는 함수 내부에서만 사용 (브라우저에 노출되지 않음)
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // 비밀번호 검증은 DB 함수에 위임
  const { data, error } = await supabase.rpc('get_inquiry', { p_id: id, p_password: password });
  if (error || !data?.length) return json({ error: '비밀번호가 일치하지 않습니다.' }, 403);

  const photoPaths: string[] = data[0].photo_paths ?? [];
  if (photoPaths.length === 0) return json({ urls: [] });

  const { data: signed, error: signError } = await supabase.storage.from(BUCKET).createSignedUrls(photoPaths, SIGNED_URL_TTL);
  if (signError) return json({ error: '사진을 불러오지 못했습니다.' }, 500);

  return json({ urls: signed.map((item) => item.signedUrl).filter(Boolean) });
});
