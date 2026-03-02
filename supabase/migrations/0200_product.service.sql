-- ==============================================================================
-- 1. increment_participants RPC (Remote Procedure Call)
-- 목적: Race Condition을 방지하며 원자적으로 current_participants를 증가/감소시킵니다.
-- 사용법: await supabase.rpc('increment_participants', { item_id: '...', amount: 1 })
-- ==============================================================================

CREATE OR REPLACE FUNCTION increment_participants(item_id UUID, amount INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- RLS를 우회하여 서버 권한으로 실행 (클라이언트 조작 방지)
AS $$
BEGIN
  UPDATE public.zero_inventory_items
  SET current_participants = current_participants + amount
  WHERE id = item_id;
END;
$$;


-- ==============================================================================
-- 2. check_and_update_goal_status TRIGGER
-- 목적: 누군가 참여하여 current_participants가 업데이트 될 때, 
-- target_participants에 도달하면 status를 'RECRUITING'에서 'GOAL_MET'으로 자동 변경합니다.
-- ==============================================================================

-- 트리거 함수 정의
CREATE OR REPLACE FUNCTION check_and_update_goal_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- 참여 인원이 목표 인원 이상이 되었고, 이전 상태가 RECRUITING 인 경우에만
  IF NEW.current_participants >= NEW.target_participants AND OLD.status = 'RECRUITING' THEN
    NEW.status = 'GOAL_MET';
  END IF;
  
  -- 취소 등으로 인원이 줄어들었을 경우 방어적 롤백 (선택 사항)
  IF NEW.current_participants < NEW.target_participants AND OLD.status = 'GOAL_MET' THEN
    NEW.status = 'RECRUITING';
  END IF;

  RETURN NEW;
END;
$$;

-- 기존 트리거가 있다면 안전하게 제거
DROP TRIGGER IF EXISTS trg_check_goal_status ON public.zero_inventory_items;

-- 트리거 생성
CREATE TRIGGER trg_check_goal_status
BEFORE UPDATE OF current_participants ON public.zero_inventory_items
FOR EACH ROW
EXECUTE FUNCTION check_and_update_goal_status();
