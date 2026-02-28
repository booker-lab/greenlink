// 1. Core API & Supabase Client
export * from './api/supabase';
export { greenlinkApi } from './api';
export * from './api/client';

// 2. Domain Types & Models (SSOT)
export * from './types';

// 3. Constants & Utilities
export * from './constants';
export * from './utils';

// 4. Global State Stores (Zustand)
export * from './stores';

// 5. External Integrations (Namespaced)
export * as NaverAPI from './api/external/naver-smartstore';
export * as TossAPI from './api/external/toss-payments';
