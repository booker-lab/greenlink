import React from 'react';
import CategoryList from '@/components/category/CategoryList';
import MainHeader from '@/components/layout/MainHeader';

export default function CategoryPage() {
    return (
        <>
            <MainHeader />
            <div className="pb-20">
                <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">카테고리</h1>
                    <button className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
                <CategoryList />
            </div>
        </>
    );
}
