import { createClient } from '@supabase/supabase-js';
import { DomainData, OrderData, ColumnMapping } from '../types';

const supabaseUrl = 'https://zwzvdcfpwprfighayyvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3enZkY2Zwd3ByZmlnaGF5eXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2ODk0MzcsImV4cCI6MjA4MzI2NTQzN30.TqnfdC2dhaz0LatWjZ0VHp_P2nAcDMzjibe4EfsIvQ4';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Save domain data to Supabase
export const saveDomainData = async (userId: string, domain: string, domainData: DomainData) => {
  try {
    const { error } = await supabase
      .from('domain_data')
      .upsert(
        {
          user_id: userId,
          domain_name: domain,
          data: domainData.data,
          mapping: domainData.mapping,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,domain_name' }
      );

    if (error) throw error;
    console.log(`Data saved for domain: ${domain}`);
  } catch (error) {
    console.error('Error saving domain data:', error);
    throw error;
  }
};

// Load domain data from Supabase
export const loadDomainData = async (userId: string, domain: string): Promise<DomainData | null> => {
  try {
    const { data, error } = await supabase
      .from('domain_data')
      .select('data, mapping')
      .eq('user_id', userId)
      .eq('domain_name', domain)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
    
    if (!data) return null;

    return {
      data: data.data as OrderData[],
      mapping: data.mapping as ColumnMapping,
    };
  } catch (error) {
    console.error('Error loading domain data:', error);
    return null;
  }
};

// Merge new data with existing data (remove duplicates)
export const mergeAndDeduplicateData = (
  existingData: OrderData[],
  newData: OrderData[],
  mapping: ColumnMapping
): OrderData[] => {
  // Create a set of unique identifiers from existing data
  const existingSet = new Set<string>();
  
  existingData.forEach((row) => {
    // Use date + customer + product + quantity as unique identifier
    const dateVal = row[mapping.date] || 'unknown';
    const customerVal = row[mapping.customer] || 'unknown';
    const productVal = row[mapping.product] || 'unknown';
    const quantityVal = row[mapping.quantity] || '0';
    
    const uniqueId = `${dateVal}|${customerVal}|${productVal}|${quantityVal}`;
    existingSet.add(uniqueId);
  });

  // Filter new data: only keep rows not in existing set
  const dedupedNewData = newData.filter((row) => {
    const dateVal = row[mapping.date] || 'unknown';
    const customerVal = row[mapping.customer] || 'unknown';
    const productVal = row[mapping.product] || 'unknown';
    const quantityVal = row[mapping.quantity] || '0';
    
    const uniqueId = `${dateVal}|${customerVal}|${productVal}|${quantityVal}`;
    return !existingSet.has(uniqueId);
  });

  // Merge: existing data + new non-duplicate data
  return [...existingData, ...dedupedNewData];
};

// Get all domains for a user
export const getUserDomains = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('domain_data')
      .select('domain_name')
      .eq('user_id', userId);

    if (error) throw error;
    
    return data?.map(row => row.domain_name) || [];
  } catch (error) {
    console.error('Error loading user domains:', error);
    return [];
  }
};

// Delete data for a domain
export const deleteDomainData = async (userId: string, domain: string) => {
  try {
    const { error } = await supabase
      .from('domain_data')
      .delete()
      .eq('user_id', userId)
      .eq('domain_name', domain);

    if (error) throw error;
    console.log(`Data deleted for domain: ${domain}`);
  } catch (error) {
    console.error('Error deleting domain data:', error);
    throw error;
  }
};