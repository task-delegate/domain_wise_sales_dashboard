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
      return `${row['seller order id'] || row[mapping.date] || 'unknown'}|${row['seller sku code'] || row[mapping.item] || 'unknown'}|${row['size'] || 'one-size'}`;
    
    case 'AJIO':
      return `${row['Sale Order Code'] || row[mapping.date] || 'unknown'}|${row['Item Code'] || row[mapping.item] || 'unknown'}`;
    
    case 'Flipkart':
    case 'Amazon':
    default:
      return `${row['Sale Order Code'] || row[mapping.date] || 'unknown'}|${row['Item SKU Code'] || row[mapping.item] || 'unknown'}`;
  }
};

// Helper function to parse decimal values
const parseDecimal = (value: any): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = parseFloat(value.toString());
  return isNaN(parsed) ? null : parsed;
};

// Helper function to parse timestamp values
const parseTimestamp = (value: any): string | null => {
  if (value === null || value === undefined || value === '') return null;
  try {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
};

// Transform row data based on domain
const transformRowData = (row: OrderData, domain: string): any => {
  const baseRow = {
    raw_data: row,
  };

  if (domain === 'Myntra') {
    return {
      ...baseRow,
      seller_id: row['seller id'] || null,
      warehouse_id: row['warehouse id'] || null,
      po_type: row['po_type'] || null,
      store_order_id: row['store order id'] || null,
      order_release_id: row['order release id'] || null,
      order_line_id: row['order line id'] || null,
      seller_order_id: row['seller order id'] || null,
      order_id_fk: row['order id fk'] || null,
      created_on: parseTimestamp(row['created on']),
      style_id: row['style id'] || null,
      seller_sku_code: row['seller sku code'] || null,
      sku_id: row['sku id'] || null,
      myntra_sku_code: row['myntra sku code'] || null,
      size: row['size'] || null,
      vendor_article_number: row['vendor article number'] || null,
      brand: row['brand'] || null,
      style_name: row['style name'] || null,
      article_type: row['article type'] || null,
      order_status: row['order status'] || null,
      packet_id: row['packet id'] || null,
      seller_packet_id: row['seller packe id'] || null,
      courier_code: row['courier code'] || null,
      order_tracking_number: row['order tracking number'] || null,
      seller_warehouse_id: row['seller warehouse id'] || null,
      cancellation_reason_id_fk: row['cancellation reason id fk'] || null,
      cancellation_reason: row['cancellation reason'] || null,
      packed_on: parseTimestamp(row['packed on']),
      fmpu_date: parseTimestamp(row['fmpu date']),
      inscanned_on: parseTimestamp(row['inscanned on']),
      shipped_on: parseTimestamp(row['shipped on']),
      delivered_on: parseTimestamp(row['delivered on']),
      cancelled_on: parseTimestamp(row['cancelled on']),
      rto_creation_date: parseTimestamp(row['rto creation date']),
      lost_date: parseTimestamp(row['lost date']),
      return_creation_date: parseTimestamp(row['return creation date']),
      final_amount: parseDecimal(row['final amount']),
      total_mrp: parseDecimal(row['total mrp']),
      discount: parseDecimal(row['discount']),
      coupon_discount: parseDecimal(row['coupon discount']),
      shipping_charge: parseDecimal(row['shipping charge']),
      gift_charge: parseDecimal(row['gift charge']),
      tax_recovery: parseDecimal(row['tax recovery']),
      city: row['city'] || null,
      state: row['state'] || null,
      zipcode: row['zipcode'] || null,
    };
  } else if (domain === 'AJIO') {
    return {
      ...baseRow,
      sale_order_code: row['Sale Order Code'] || null,
      item_code: row['Item Code'] || null,
      order_date: parseTimestamp(row['Order Date as dd/mm/yyyy hh:MM:ss']),
      sale_order_status: row['Sale Order Status'] || null,
      on_hold: (row['On Hold'] as any) === 'true' || (row['On Hold'] as any) === 'True' ? true : false,
      priority: row['Priority'] || null,
      sku_name: row['SKU Name'] || null,
      seller_sku_code: row['Seller SKU Code'] || null,
      combination_identifier: row['Combination Identifier'] || null,
      combination_description: row['Combination Description'] || null,
      mrp: parseDecimal(row['MRP']),
      total_price: parseDecimal(row['Total Price']),
      selling_price: parseDecimal(row['Selling Price']),
      cost_price: parseDecimal(row['Cost Price']),
      discount: parseDecimal(row['Discount']),
      voucher_code: row['Voucher Code'] || null,
      transfer_price: parseDecimal(row['Transfer Price']),
      gst_tax_type_code: row['GST Tax Type Code'] || null,
      cgst: parseDecimal(row['CGST']),
      igst: parseDecimal(row['IGST']),
      sgst: parseDecimal(row['SGST']),
      utgst: parseDecimal(row['UTGST']),
      cess: parseDecimal(row['CESS']),
      cgst_rate: parseDecimal(row['CGST Rate']),
      igst_rate: parseDecimal(row['IGST Rate']),
      sgst_rate: parseDecimal(row['SGST Rate']),
      utgst_rate: parseDecimal(row['UTGST Rate']),
      cess_rate: parseDecimal(row['CESS Rate']),
      tcs_amount: parseDecimal(row['TCS Amount']),
      tax_percent: parseDecimal(row['Tax %']),
      tax_value: parseDecimal(row['Tax Value']),
      shipping_charges: parseDecimal(row['Shipping Charges']),
      shipping_method_charges: parseDecimal(row['Shipping Method Charges']),
      cod_service_charges: parseDecimal(row['COD Service Charges']),
      gift_wrap_charges: parseDecimal(row['Gift Wrap Charges']),
      shipping_provider: row['Shipping provider'] || null,
      shipping_courier: row['Shipping Courier'] || null,
      shipping_arranged_by: row['Shipping Arranged By'] || null,
      shipping_package_code: row['Shipping Package Code'] || null,
      shipping_package_creation_date: parseTimestamp(row['Shipping Package Creation Date']),
      shipping_package_status_code: row['Shipping Package Status Code'] || null,
      shipping_package_type: row['Shipping Package Type'] || null,
      tracking_number: row['Tracking Number'] || null,
      dispatch_date: parseTimestamp(row['Dispatch Date']),
      delivery_time: row['Delivery Time'] || null,
      sale_order_item_status: row['Sale Order Item Status'] || null,
      cancellation_reason: row['Cancellation Reason'] || null,
      return_date: parseTimestamp(row['Return Date']),
      return_reason: row['Return Reason'] || null,
      return_remarks: row['Return Remarks'] || null,
      facility: row['Facility'] || null,
      packet_number: row['Packet Number'] || null,
      imei: row['IMEI'] || null,
      weight: parseDecimal(row['Weight']),
      hsn_code: row['HSN Code'] || null,
      gstin: row['GSTIN'] || null,
      customer_gstin: row['Customer GSTIN'] || null,
      tin: row['TIN'] || null,
      payment_instrument: row['Payment Instrument'] || null,
      batch_code: row['Batch Code'] || null,
      vendor_batch_number: row['Vendor Batch Number'] || null,
      item_type_ean: row['Item Type EAN'] || null,
      item_seal_id: row['Item Seal Id'] || null,
      parent_sale_order_code: row['Parent Sale Order Code'] || null,
      item_tag: row['Item Tag'] || null,
      shipment_tag: row['Shipment Tag'] || null,
      gift_wrap: row['Gift Wrap'] || null,
      gift_message: row['Gift Message'] || null,
      prepaid_amount: parseDecimal(row['Prepaid Amount']),
      subtotal: parseDecimal(row['Subtotal']),
      store_credit: parseDecimal(row['Store Credit']),
      irn: row['IRN'] || null,
      acknowledgement_number: row['Acknowledgement Number'] || null,
      bundle_sku_code_number: row['Bundle SKU Code Number'] || null,
      currency: row['Currency'] || null,
      currency_conversion_rate: parseDecimal(row['Currency Conversion Rate']),
      fulfillment_tat: row['Fulfillment TAT'] || null,
      adjustment_in_selling_price: parseDecimal(row['Adjustment In Selling Price']),
      adjustment_in_discount: parseDecimal(row['Adjustment In Discount']),
      shipping_courier_status: row['Shipping Courier Status'] || null,
      shipping_tracking_status: row['Shipping Tracking Status'] || null,
      cashfree: row['CASHFREE'] || null,
      tags: row['tags'] || null,
      channel_shipping: row['Channel Shipping'] || null,
      item_details: row['Item Details'] || null,
    };
  } else if (domain === 'Flipkart' || domain === 'Amazon') {
    return {
      ...baseRow,
      sale_order_code: row['Sale Order Code'] || null,
      item_sku_code: row['Item SKU Code'] || null,
      sale_order_item_code: row['Sale Order Item Code'] || null,
      display_order_code: row['Display Order Code'] || null,
      order_date: parseTimestamp(row['Order Date as dd/mm/yyyy hh:MM:ss']),
      sale_order_status: row['Sale Order Status'] || null,
      on_hold: (row['On Hold'] as any) === 'true' || (row['On Hold'] as any) === 'True' ? true : false,
      priority: row['Priority'] || null,
      reverse_pickup_code: row['Reverse Pickup Code'] || null,
      reverse_pickup_created_date: parseTimestamp(row['Reverse Pickup Created Date']),
      reverse_pickup_reason: row['Reverse Pickup Reason'] || null,
      notification_email: row['Notification Email'] || null,
      notification_mobile: row['Notification Mobile'] || null,
      require_customization: (row['Require Customization'] as any) === 'true' || (row['Require Customization'] as any) === 'True' ? true : false,
      sku_require_customization: (row['SKU Require Customization'] as any) === 'true' || (row['SKU Require Customization'] as any) === 'True' ? true : false,
      cod: (row['COD'] as any) === 'true' || (row['COD'] as any) === 'True' ? true : false,
      shipping_address_id: row['Shipping Address Id'] || null,
      shipping_address_name: row['Shipping Address Name'] || null,
      shipping_address_line_1: row['Shipping Address Line 1'] || null,
      shipping_address_line_2: row['Shipping Address Line 2'] || null,
      shipping_address_city: row['Shipping Address City'] || null,
      shipping_address_state: row['Shipping Address State'] || null,
      shipping_address_country: row['Shipping Address Country'] || null,
      shipping_address_pincode: row['Shipping Address Pincode'] || null,
      shipping_address_latitude: parseDecimal(row['Shipping Address Latitude']),
      shipping_address_longitude: parseDecimal(row['Shipping Address Longitude']),
      shipping_address_phone: row['Shipping Address Phone'] || null,
      billing_address_id: row['Billing Address Id'] || null,
      billing_address_name: row['Billing Address Name'] || null,
      billing_address_line_1: row['Billing Address Line 1'] || null,
      billing_address_line_2: row['Billing Address Line 2'] || null,
      billing_address_city: row['Billing Address City'] || null,
      billing_address_state: row['Billing Address State'] || null,
      billing_address_country: row['Billing Address Country'] || null,
      billing_address_pincode: row['Billing Address Pincode'] || null,
      billing_address_latitude: parseDecimal(row['Billing Address Latitude']),
      billing_address_longitude: parseDecimal(row['Billing Address Longitude']),
      billing_address_phone: row['Billing Address Phone'] || null,
      shipping_method: row['Shipping Method'] || null,
      item_code: row['Item Code'] || null,
      channel_product_id: row['Channel Product Id'] || null,
      item_type_name: row['Item Type Name'] || null,
      item_type_color: row['Item Type Color'] || null,
      item_type_size: row['Item Type Size'] || null,
      item_type_brand: row['Item Type Brand'] || null,
      channel_name: row['Channel Name'] || null,
      sku_name: row['SKU Name'] || null,
      category: row['Category'] || null,
      mrp: parseDecimal(row['MRP']),
      total_price: parseDecimal(row['Total Price']),
      selling_price: parseDecimal(row['Selling Price']),
      cost_price: parseDecimal(row['Cost Price']),
      discount: parseDecimal(row['Discount']),
      prepaid_amount: parseDecimal(row['Prepaid Amount']),
      subtotal: parseDecimal(row['Subtotal']),
      voucher_code: row['Voucher Code'] || null,
      transfer_price: parseDecimal(row['Transfer Price']),
      gst_tax_type_code: row['GST Tax Type Code'] || null,
      cgst: parseDecimal(row['CGST']),
      igst: parseDecimal(row['IGST']),
      sgst: parseDecimal(row['SGST']),
      utgst: parseDecimal(row['UTGST']),
      cess: parseDecimal(row['CESS']),
      cgst_rate: parseDecimal(row['CGST Rate']),
      igst_rate: parseDecimal(row['IGST Rate']),
      sgst_rate: parseDecimal(row['SGST Rate']),
      utgst_rate: parseDecimal(row['UTGST Rate']),
      cess_rate: parseDecimal(row['CESS Rate']),
      tcs_amount: parseDecimal(row['TCS Amount']),
      tax_percent: parseDecimal(row['Tax %']),
      tax_value: parseDecimal(row['Tax Value']),
      shipping_charges: parseDecimal(row['Shipping Charges']),
      shipping_method_charges: parseDecimal(row['Shipping Method Charges']),
      cod_service_charges: parseDecimal(row['COD Service Charges']),
      gift_wrap_charges: parseDecimal(row['Gift Wrap Charges']),
      shipping_provider: row['Shipping provider'] || null,
      shipping_courier: row['Shipping Courier'] || null,
      shipping_arranged_by: row['Shipping Arranged By'] || null,
      shipping_package_code: row['Shipping Package Code'] || null,
      shipping_package_creation_date: parseTimestamp(row['Shipping Package Creation Date']),
      shipping_package_status_code: row['Shipping Package Status Code'] || null,
      shipping_package_type: row['Shipping Package Type'] || null,
      tracking_number: row['Tracking Number'] || null,
      dispatch_date: parseTimestamp(row['Dispatch Date']),
      facility: row['Facility'] || null,
      delivery_time: row['Delivery Time'] || null,
      length_mm: parseDecimal(row['Length(mm)']),
      width_mm: parseDecimal(row['Width(mm)']),
      height_mm: parseDecimal(row['Height(mm)']),
      weight: parseDecimal(row['Weight']),
      sale_order_item_status: row['Sale Order Item Status'] || null,
      cancellation_reason: row['Cancellation Reason'] || null,
      return_date: parseTimestamp(row['Return Date']),
      return_reason: row['Return Reason'] || null,
      return_remarks: row['Return Remarks'] || null,
      invoice_code: row['Invoice Code'] || null,
      invoice_created: parseTimestamp(row['Invoice Created']),
      eway_bill_no: row['EWayBill No'] || null,
      eway_bill_date: parseTimestamp(row['EWayBill Date']),
      eway_bill_valid_till: parseTimestamp(row['EWayBill Valid Till']),
      gift_wrap: row['Gift Wrap'] || null,
      gift_message: row['Gift Message'] || null,
      payment_instrument: row['Payment Instrument'] || null,
      store_credit: parseDecimal(row['Store Credit']),
      hsn_code: row['HSN Code'] || null,
      gstin: row['GSTIN'] || null,
      customer_gstin: row['Customer GSTIN'] || null,
      tin: row['TIN'] || null,
      irn: row['IRN'] || null,
      acknowledgement_number: row['Acknowledgement Number'] || null,
      bundle_sku_code_number: row['Bundle SKU Code Number'] || null,
      batch_code: row['Batch Code'] || null,
      vendor_batch_number: row['Vendor Batch Number'] || null,
      seller_sku_code: row['Seller SKU Code'] || null,
      item_type_ean: row['Item Type EAN'] || null,
      imei: row['IMEI'] || null,
      fulfillment_tat: row['Fulfillment TAT'] || null,
      adjustment_in_selling_price: parseDecimal(row['Adjustment In Selling Price']),
      adjustment_in_discount: parseDecimal(row['Adjustment In Discount']),
      shipping_courier_status: row['Shipping Courier Status'] || null,
      shipping_tracking_status: row['Shipping Tracking Status'] || null,
      packet_number: row['Packet Number'] || null,
      item_seal_id: row['Item Seal Id'] || null,
      parent_sale_order_code: row['Parent Sale Order Code'] || null,
      item_tag: row['Item Tag'] || null,
      shipment_tag: row['Shipment Tag'] || null,
      cashfree: row['CASHFREE'] || null,
      tags: row['tags'] || null,
      channel_shipping: row['Channel Shipping'] || null,
      item_details: row['Item Details'] || null,
      currency: row['Currency'] || null,
      currency_conversion_rate: parseDecimal(row['Currency Conversion Rate']),
    };
  }

  return baseRow;
};

// Save domain data to domain-specific Supabase table
export const saveDomainData = async (userId: string, domain: string, domainData: DomainData) => {
  try {
    if (!userId) {
      throw new Error('User ID is required to save data');
    }

    if (!domainData || !domainData.data || domainData.data.length === 0) {
      throw new Error('No data provided to save');
    }

    const tableName = getDomainTableName(domain);
    console.log(`Saving ${domainData.data.length} rows to table: ${tableName}`);
    
    // For domain-specific tables, we need to transform the data
    if (tableName !== 'domain_data') {
      // Transform and map all columns for the domain
      const rowsToInsert = domainData.data.map((row: OrderData) => {
        return {
          user_id: userId,
          ...transformRowData(row, domain),
        };
      });

      // Validate that we have rows to insert
      if (rowsToInsert.length === 0) {
        throw new Error('No rows to insert after data transformation');
      }

      // Get the conflict columns based on domain
      let conflictColumns = 'user_id,sale_order_code,item_sku_code';
      if (domain === 'Myntra') {
        conflictColumns = 'user_id,seller_order_id,seller_sku_code,size';
      } else if (domain === 'AJIO') {
        conflictColumns = 'user_id,sale_order_code,item_code';
      }

      console.log(`Upserting ${rowsToInsert.length} rows with conflict columns: ${conflictColumns}`);
      
      // Upsert will automatically handle duplicates based on UNIQUE constraint
      const { error, data } = await supabase
        .from(tableName)
        .upsert(rowsToInsert, { onConflict: conflictColumns });

      if (error) {
        console.error(`Supabase error for ${tableName}:`, error);
        throw new Error(`Failed to save to ${domain}: ${error.message}`);
      }

      console.log(`Successfully saved data for ${domain}. Response:`, data);
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

      if (error) {
        console.error('Supabase error for domain_data:', error);
        throw new Error(`Failed to save to generic table: ${error.message}`);
      }
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
        zipcode: domain === 'Flipkart' || domain === 'Amazon' ? 'Shipping Address Pincode' : 'zipcode',
        brand: 'Item Type Brand',
        orderStatus: 'Sale Order Status',
        cancellationReason: 'Cancellation Reason',
        discount: 'Discount',
        courier: 'Shipping Courier',
        sku: 'SKU Name',
        articleType: 'article type',
        deliveredDate: 'delivered on',
        cancelledDate: 'cancelled on',
        returnDate: 'return creation date',
        orderId: domain === 'Myntra' ? 'seller order id' : 'Sale Order Code',
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