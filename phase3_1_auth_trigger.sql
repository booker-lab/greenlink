-- 1. 신규 유저 가입 시 프로필 자동 생성 함수 및 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, pink_temperature)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    '{"value": 36.5, "level": "첫눈", "emoji": "♥"}'::jsonb
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 만약 이전 트리거가 있다면 드롭하고 새로 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
