import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="mb-6 scale-150">🌿</div>
            <h2 className="text-2xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-[280px] mx-auto">요청하신 상품이나 농장 정보가 존재하지 않거나 주소가 변경되었습니다.</p>
            <Link
                href="/"
                className="mt-8 bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-100"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
}
