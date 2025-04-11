-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create regulations table
CREATE TABLE IF NOT EXISTS regulations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for both tables
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regulations_updated_at
    BEFORE UPDATE ON regulations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow read-only access for all)
CREATE POLICY "Allow read access for all users" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON regulations
    FOR SELECT USING (true);

-- Insert some sample data
INSERT INTO categories (name) VALUES
    ('인사규정'),
    ('보안규정'),
    ('복리후생'),
    ('업무규정')
ON CONFLICT DO NOTHING;

-- Insert sample regulations (using subquery to get category ids)
INSERT INTO regulations (category_id, title, content)
VALUES 
    ((SELECT id FROM categories WHERE name = '인사규정'), '근무시간 규정', '1. 기본 근무시간은 9:00-18:00입니다.\n2. 점심시간은 12:00-13:00입니다.'),
    ((SELECT id FROM categories WHERE name = '인사규정'), '휴가 규정', '1. 연차 휴가는 1년에 15일입니다.\n2. 병가는 연 60일까지 가능합니다.'),
    ((SELECT id FROM categories WHERE name = '보안규정'), '보안 준수사항', '1. 회사 비밀정보 유출 금지\n2. 개인정보 보호 의무'),
    ((SELECT id FROM categories WHERE name = '복리후생'), '복리후생 제도', '1. 건강검진 지원\n2. 경조사 지원\n3. 자기계발비 지원'),
    ((SELECT id FROM categories WHERE name = '업무규정'), '업무 보고', '1. 일일 업무보고서 작성\n2. 주간 회의 참석 필수')
ON CONFLICT DO NOTHING; 