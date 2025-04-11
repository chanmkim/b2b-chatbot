'use client';

import { ChatInterface } from '@/components/chat/chat-interface';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          기업 규정 조회 시스템
        </h1>
        <p className="text-center text-muted-foreground">
          카테고리를 선택하고 규정을 검색해보세요.
        </p>
      </div>
      <ChatInterface />
    </main>
  );
}
