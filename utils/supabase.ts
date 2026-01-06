import { createClient } from '@supabase/supabase-js';
import { DomainData, OrderData, ColumnMapping } from '../types';

const supabaseUrl = 'https://zwzvdcfpwprfighayyvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3enZkY2Zwd3ByZmlnaGF5eXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2ODk0MzcsImV4cCI6MjA4MzI2NTQzN30.TqnfdC2dhaz0LatWjZ0VHp_P2nAcDMzjibe4EfsIvQ4';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Map domain names to table names
const getDomainTableName = (domain: string): string => {
  const tableMap: { [key: string]: string } = {
    'Myntra': 'myntra_data',
    'Amazon': 'amazon_data',
    'Flipkart': 'flipkart_data',
    'AJIO': 'ajio_data',
    'Nykaa': 'nykaa_data' // Will be added if needed
  };
  return tableMap[domain] || 'domain_data'; // Fallback to generic table
};

// Get unique identifier for a row based on domain
const getUniqueIdentifier = (row: OrderData, domain: string, mapping: ColumnMapping): string => {
  switch (domain) {
    case 'Myntra':
      return `${row['seller order id'] || row[mapping.date] || 'unknown'}|${row['seller sku code'] || row[mapping.product] || 'unknown'}|${row['size'] || 'one-size'}`;
    
    case 'AJIO':
      return `${row['Sale Order Code'] || row[mapping.date] || 'unknown'}|${row['Item Code'] || row[mapping.product] || 'unknown'}`;
    
    case 'Flipkart':
    case 'Amazon':
    default:
      return `${row['Sale Order Code'] || row[mapping.date] || 'unknown'}|${row['Item SKU Code'] || row[mapping.product] || 'unknown'}`;
  }
};

// Save domain data to domain-specific Supabase table
export const saveDomainData = async (userId: string, domain: string, domainData: DomainData) => {
  try {
    const tableName = getDomainTableName(domain);
    
    // For domain-specific tables, we need to transform the data
    if (tableName !== 'domain_data') {
      // Insert raw_data as JSONB, the database will handle duplicates via UNIQUE constraint
      const rowsToInsert = domainData.data.map((row: OrderData) => {
        const baseRow = {
          user_id: userId,
          raw_data: row,
        };

        // Add domain-specific key columns
        if (domain === 'Myntra') {
          return {
            ...baseRow,
            seller_order_id: row['seller order id'] || null,
            order_id_fk: row['order id fk'] || null,
            created_on: row['created on'] ? new Date(row['created on']) : null,
            seller_sku_code: row['seller sku code'] || null,
            sku_id: row['sku id'] || null,
            size: row['size'] || null,
          };
        } else if (domain === 'AJIO') {
          return {
            ...baseRow,
            sale_order_code: row['Sale Order Code'] || null,
            order_date: row['Order Date as dd/mm/yyyy hh:MM:ss'] ? new Date(row['Order Date as dd/mm/yyyy hh:MM:ss']) : null,
            item_code: row['Item Code'] || null,
            sku_name: row['SKU Name'] || null,
          };
        } else if (domain === 'Flipkart' || domain === 'Amazon') {
          return {
            ...baseRow,
            sale_order_code: row['Sale Order Code'] || null,
            display_order_code: row['Display Order Code'] || null,
            order_date: row['Order Date as dd/mm/yyyy hh:MM:ss'] ? new Date(row['Order Date as dd/mm/yyyy hh:MM:ss']) : null,
            item_sku_code: row['Item SKU Code'] || null,
            item_code: row['Item Code'] || null,
            shipping_address_city: row['Shipping Address City'] || null,
            selling_price: parseFloat(row['Selling Price']?.toString()) || null,
            discount: parseFloat(row['Discount']?.toString()) || null,
          };
        }
        return baseRow;
      });

      // Upsert will automatically handle duplicates based on UNIQUE constraint
      const { error } = await supabase
        .from(tableName)
        .upsert(rowsToInsert, { onConflict: 'user_id,sale_order_code,item_sku_code' });

      if (error) throw error;
    } else {
      // Fallback for unknown domains - use generic table
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
    }

    console.log(`Data saved for domain: ${domain} (table: ${tableName})`);
  } catch (error) {
    console.error('Error saving domain data:', error);
    throw error;
  }
};

// Load domain data from domain-specific Supabase table
export const loadDomainData = async (userId: string, domain: string): Promise<DomainData | null> => {
  try {
    const tableName = getDomainTableName(domain);

    if (tableName !== 'domain_data') {
      const { data, error } = await supabase
        .from(tableName)
        .select('raw_data')
        .eq('user_id', userId);

      if (error && error.code !== 'PGRST116') throw error;

      if (!data || data.length === 0) return null;

      // Reconstruct DomainData from raw_data
      const orderDataArray = data.map(row => row.raw_data);
      
      // Create a generic mapping (the raw_data already has original column names)
      const mapping: ColumnMapping = {
        date: 'Order Date as dd/mm/yyyy hh:MM:ss',
        customer: 'customer_name',
        item: 'SKU Name',
        quantity: 'quantity',
        price: 'Selling Price',
        revenue: 'Total Price',
        city: domain === 'Flipkart' || domain === 'Amazon' ? 'Shipping Address City' : 'city',
        state: domain === 'Flipkart' || domain === 'Amazon' ? 'Shipping Address State' : 'state',
        brand: 'Item Type Brand',
        orderStatus: 'Sale Order Status',
        cancellationReason: 'Cancellation Reason',
        discount: 'Discount',
      };

      return {
        data: orderDataArray,
        mapping: mapping,
      };
    } else {
      const { data, error } = await supabase
        .from('domain_data')
        .select('data, mapping')
        .eq('user_id', userId)
        .eq('domain_name', domain)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) return null;

      return {
        data: data.data as OrderData[],
        mapping: data.mapping as ColumnMapping,
      };
    }
  } catch (error) {
    console.error('Error loading domain data:', error);
    return null;
  }
};

// Merge new data with existing data (remove duplicates at application level)
export const mergeAndDeduplicateData = (
  existingData: OrderData[],
  newData: OrderData[],
  mapping: ColumnMapping,
  domain: string
): OrderData[] => {
  // Create a set of unique identifiers from existing data
  const existingSet = new Set<string>();

  existingData.forEach((row) => {
    const uniqueId = getUniqueIdentifier(row, domain, mapping);
    existingSet.add(uniqueId);
  });

  // Filter new data: only keep rows not in existing set
  const dedupedNewData = newData.filter((row) => {
    const uniqueId = getUniqueIdentifier(row, domain, mapping);
    if (existingSet.has(uniqueId)) {
      console.log(`Duplicate detected and skipped: ${uniqueId}`);
      return false;
    }
    existingSet.add(uniqueId);
    return true;
  });

  console.log(`Merged ${dedupedNewData.length} new unique rows out of ${newData.length}`);
  return [...existingData, ...dedupedNewData];
};

// Get all domains for a user
export const getUserDomains = async (userId: string): Promise<string[]> => {
  try {
    const domains: { [key: string]: string } = {
      'myntra_data': 'Myntra',
      'amazon_data': 'Amazon',
      'flipkart_data': 'Flipkart',
      'ajio_data': 'AJIO',
    };

    const domainsWithData = [];

    for (const [tableName, domainName] of Object.entries(domains)) {
      const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (!error && data && data.length > 0) {
        domainsWithData.push(domainName);
      }
    }

    return domainsWithData;
  } catch (error) {
    console.error('Error loading user domains:', error);
    return [];
  }
};

// Delete data for a domain
export const deleteDomainData = async (userId: string, domain: string) => {
  try {
    const tableName = getDomainTableName(domain);

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    console.log(`Data deleted for domain: ${domain} (table: ${tableName})`);
  } catch (error) {
    console.error('Error deleting domain data:', error);
    throw error;
  }
};