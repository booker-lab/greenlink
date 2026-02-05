# 반응형 웹 레이아웃 개선 계획 (Desktop Optimization)

## 목표 설명
현재 `max-w-md`(약 450px)로 고정된 모바일 중심 레이아웃을 데스크탑 화면에서도 쾌적하게 볼 수 있도록 반응형(Responsive)으로 개선합니다. 유저의 요청에 따라 README의 설계 지침도 수정하며, 모바일 최적화는 추후 네이티브 앱 개발 시 고려하는 것으로 전략을 변경합니다.

## 변경 제안

### 문서
#### [수정] [README.md](file:///c:/Users/JJY/.gemini/greenlink%20v1/README.md)
- **웹앱 최적화 레이아웃** 섹션 수정:
    - `Mobile First` 및 `max-w-md` 제한 내용 제거.
    - **Responsive Design**: 데스크탑을 포함한 다양한 화면 크기에 최적화된 유연한 레이아웃 채택.
    - 추후 모바일 앱(Capacitor) 전환 시 모바일 뷰 별도 최적화 예정임을 명시.

### UI 컴포넌트
#### [수정] [MobileLayout.tsx](file:///c:/Users/JJY/.gemini/greenlink%20v1/src/components/layout/MobileLayout.tsx)
- 파일명을 `ResponsiveLayout.tsx`나 `MainLayout.tsx`로 변경하는 것을 고려하거나, 기존 파일 내용을 수정. (편의상 내용 수정만 진행)
- `max-w-md` 클래스 제거.
- `min-h-screen`, `w-full` 등을 유지하며 컨텐츠가 중앙에 오면서도 넓게보이도록 수정 (`max-w-5xl` 또는 `max-w-7xl` 등 사용).

#### [수정] [dashboard/page.tsx](file:///c:/Users/JJY/.gemini/greenlink%20v1/src/app/dashboard/page.tsx)
- 메인 컨테이너의 `max-w-md` 제거.
- **그리드 시스템 도입**:
    - 모바일: 1열 (기존 유지)
    - 태블릿/데스크탑: 2열 또는 3열 그리드 (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- **SeasonCalendar 위젯**: 데스크탑에서는 사이드바나 별도 섹션으로 배치 고려.

## 검증 계획
- **서버 재시작**: 레이아웃 변경 사항 적용 확인.
- **브라우저 확인**:
    - 데스크탑 크기(1024px 이상)에서 화면이 꽉 차게 나오는지 확인.
    - 모바일 크기로 줄였을 때 깨지지 않고 잘 나오는지(반응형) 확인.
