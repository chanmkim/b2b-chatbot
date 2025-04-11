'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Category,
  ChatMessage,
  Regulation,
  fetchCategories,
  fetchRegulation,
  fetchRegulations,
} from '@/lib/supabase';

const STORAGE_KEY = 'chat_history';
const UNKNOWN_MESSAGE = '죄송합니다. 해당 내용을 찾을 수 없습니다. 다시 한 번 확인해 주세요.';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Fetch regulations when category is selected
  useEffect(() => {
    const loadRegulations = async () => {
      if (!selectedCategory) return;
      try {
        const data = await fetchRegulations(selectedCategory);
        setRegulations(data);
        
        // Add bot message showing available regulations
        const regulationList = data.map(r => r.title).join('\n');
        addMessage('bot', `선택하신 카테고리의 규정 목록입니다:\n${regulationList}\n\n원하시는 규정의 제목을 입력해 주세요.`);
      } catch (error) {
        console.error('Failed to fetch regulations:', error);
      }
    };
    loadRegulations();
  }, [selectedCategory]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (type: 'user' | 'bot', content: string) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      type,
      content,
      timestamp: Date.now()
    }]);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setRegulations([]);
  };

  const handleUserInput = async (input: string) => {
    addMessage('user', input);

    if (!selectedCategory) {
      addMessage('bot', '먼저 카테고리를 선택해 주세요.');
      return;
    }

    const matchingRegulation = regulations.find(
      r => r.title.toLowerCase().includes(input.toLowerCase())
    );

    if (matchingRegulation) {
      try {
        const regulation = await fetchRegulation(matchingRegulation.id);
        addMessage('bot', regulation.content);
      } catch (error) {
        console.error('Failed to fetch regulation:', error);
        addMessage('bot', UNKNOWN_MESSAGE);
      }
    } else {
      addMessage('bot', UNKNOWN_MESSAGE);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-[80vh] flex flex-col">
      <div className="p-4 border-b">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">
                  {message.content}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      <form
        className="p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const input = (e.target as HTMLFormElement).userInput.value;
          if (!input.trim()) return;
          handleUserInput(input);
          (e.target as HTMLFormElement).reset();
        }}
      >
        <input
          name="userInput"
          className="w-full p-2 border rounded-lg"
          placeholder="메시지를 입력하세요..."
          autoComplete="off"
        />
      </form>
    </Card>
  );
} 