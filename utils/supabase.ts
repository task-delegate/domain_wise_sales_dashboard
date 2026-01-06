import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zwzvdcfpwprfighayyvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3enZkY2Zwd3ByZmlnaGF5eXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2ODk0MzcsImV4cCI6MjA4MzI2NTQzN30.TqnfdC2dhaz0LatWjZ0VHp_P2nAcDMzjibe4EfsIvQ4';

export const supabase = createClient(supabaseUrl, supabaseKey);