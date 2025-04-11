import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Regulation = {
  id: string;
  category_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
};

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function fetchRegulations(categoryId: string): Promise<Regulation[]> {
  const { data, error } = await supabase
    .from('regulations')
    .select('*')
    .eq('category_id', categoryId)
    .order('title');
  
  if (error) throw error;
  return data;
}

export async function fetchRegulation(id: string): Promise<Regulation> {
  const { data, error } = await supabase
    .from('regulations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
} 