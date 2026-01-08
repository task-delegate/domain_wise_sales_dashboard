
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardPage from './DashboardPage';
import UploadModal from './UploadModal';
import DeleteDataModal from './DeleteDataModal';
import PPTGeneratorPage from './PPTGeneratorPage';
import { AllData, DomainData, OrderData, ColumnMapping } from '../types';
import { supabase, saveDomainData, loadDomainData, getUserDomains, deleteDomainData } from '../utils/supabase';

interface DashboardLayoutProps {
  onLogout: () => void;
}

type View = 'Dashboard' | 'PPT';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const UPLOAD_DOMAINS = ["Myntra", "Amazon", "Flipkart", "AJIO", "Nykaa"];
  const SIDEBAR_DOMAINS = ["All Domains", ...UPLOAD_DOMAINS];

  const [activeDomain, setActiveDomain] = useState(SIDEBAR_DOMAINS[0]);
  const [allData, setAllData] = useState<AllData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('Dashboard');
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize userId from localStorage or generate a proper UUID
  useEffect(() => {
    try {
      // First, verify localStorage is available
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch (e) {
      console.error('⚠️ localStorage is NOT available! Using memory storage only. You may be in Incognito/Private mode.', e);
      console.warn('To fix: Use regular browsing mode, not Incognito/Private mode.');
    }

    let storedUserId = localStorage.getItem('userId');
    console.log('🔍 Checking for stored userId...', storedUserId ? 'FOUND ✓' : 'NOT FOUND');
    
    if (!storedUserId) {
      // Generate a proper UUID v4
      storedUserId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      console.log('🆔 Generated new userId:', storedUserId);
      
      try {
        localStorage.setItem('userId', storedUserId);
        console.log('💾 Saved userId to localStorage ✓');
      } catch (e) {
        console.error('❌ Failed to save userId to localStorage:', e);
      }
    } else {
      console.log('✅ Using existing userId from localStorage:', storedUserId);
    }
    
    setUserId(storedUserId);
  }, []);

  // Load data from Supabase when userId is set
  useEffect(() => {
    if (!userId) return;

    const loadAllData = async () => {
      try {
        console.log('📊 Loading data for userId:', userId);
        const domains = await getUserDomains(userId);
        const loadedData: AllData = {};

        for (const domain of domains) {
          const domainData = await loadDomainData(userId, domain);
          if (domainData) {
            loadedData[domain] = domainData;
          }
        }

        setAllData(loadedData);
        console.log(`✅ Loaded data for ${domains.length} domains from Supabase:`, domains);
      } catch (error) {
        console.error("Could not load data from Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [userId]);

  const handleFileUpload = async (domain: string, newData: OrderData[], newMapping: ColumnMapping) => {
    if (!userId) {
      alert('User ID not initialized. Please refresh the page.');
      return;
    }

    try {
      setAllData(prev => {
        const existingDomainData = prev[domain];
        const existingData = existingDomainData?.data || [];

        // Load ALL data without removing duplicates - keep everything as-is
        const consolidatedData = [...existingData, ...newData];
        const totalRows = consolidatedData.length;

        console.log(`Loaded ${newData.length} new rows (including duplicates). Total rows: ${totalRows}`);

        return { ...prev, [domain]: { data: consolidatedData, mapping: newMapping } };
      });

      // Save to Supabase - load all data without deduplication for calculation accuracy
      const updatedDomainData = { ...allData[domain], data: newData, mapping: newMapping };
      if (allData[domain]) {
        // Merge all data - don't remove duplicates
        updatedDomainData.data = [...allData[domain].data, ...newData];
      }

      await saveDomainData(userId, domain, updatedDomainData);
      
      setActiveDomain(domain);
      setCurrentView('Dashboard');
    } catch (error: any) {
      console.error('Error uploading data:', error);
      const errorMessage = error?.message || 'Failed to save data. Please try again.';
      alert(errorMessage);
    }
  };


  const handleDataDelete = async (domain: string, year: number, month: number) => {
    if (!userId) return;

    try {
      if (domain === 'All Domains' && month === -1 && year) {
        setAllData(prev => {
          const nextState = { ...prev };
          for (const dom in nextState) {
            const domainState = nextState[dom];
            if (!domainState) continue;
            const { data, mapping } = domainState;
            if (!mapping.date) continue;

            const newData = data.filter(row => {
              const date = new Date(row[mapping.date!] as string);
              if (isNaN(date.getTime())) return true;
              return date.getFullYear() !== year;
            });
            nextState[dom] = { ...domainState, data: newData };
          }
          return nextState;
        });

        // Save all updated domains to Supabase
        for (const dom of Object.keys(allData)) {
          const updatedDomainData = allData[dom];
          if (updatedDomainData) {
            await saveDomainData(userId, dom, updatedDomainData);
          }
        }
        return;
      }

      if (domain === 'All Domains') {
        setAllData({});
        // Delete all domains from Supabase
        for (const dom of Object.keys(allData)) {
          await deleteDomainData(userId, dom);
        }
        return;
      }

      setAllData(prev => {
        const domainState = prev[domain];
        if (!domainState) return prev;

        const { data, mapping } = domainState;
        if (!mapping.date) return prev;

        const newData = data.filter(row => {
          const date = new Date(row[mapping.date!] as string);
          if (isNaN(date.getTime())) return true;

          const matchesYear = date.getFullYear() === year;
          const matchesMonth = month === -1 ? true : date.getMonth() === month;

          return !(matchesYear && matchesMonth);
        });

        return { ...prev, [domain]: { ...domainState, data: newData } };
      });

      // Save updated data to Supabase
      const updatedDomainData = allData[domain];
      if (updatedDomainData) {
        await saveDomainData(userId, domain, updatedDomainData);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Failed to delete data. Please try again.');
    }
  };

  const currentDomainData = useMemo<DomainData | null>((() => {
    if (activeDomain === 'All Domains') {
      // FIX: Use a type guard to ensure that elements from `allData` are valid DomainData objects.
      // This resolves type errors where properties like 'data' were accessed on an 'unknown' type.
      // FIX: Added 'd: any' to allow property access on 'd' within the type guard, resolving a TypeScript error where 'd' was inferred as 'unknown'.
      const allDomainValues = Object.values(allData).filter((d: any): d is DomainData => !!d?.data?.length);
      if (allDomainValues.length === 0) return null;

      // FIX: Included deliveredDate, cancelledDate, returnDate, and orderId in standardKeys for complete data normalization.
      const standardKeys: (keyof ColumnMapping)[] = [
        'date', 'customer', 'item', 'quantity', 'price', 'city', 'state', 
        'zipcode', 'revenue', 'brand', 'orderStatus', 'cancellationReason', 
        'courier', 'sku', 'articleType', 'discount', 'deliveredDate', 'cancelledDate', 'returnDate', 'orderId'
      ];
      
      // FIX: With the type guard above, `domainState` is now correctly inferred as `DomainData`,
      // allowing safe access to `data` and `mapping` properties.
      const consolidatedData: OrderData[] = allDomainValues.flatMap(domainState => {
        const { data, mapping } = domainState;
        return data.map(row => {
          const normalizedRow: OrderData = {};
          for (const key of standardKeys) {
            const mappedKey = mapping[key];
            if (mappedKey && row[mappedKey] !== undefined && row[mappedKey] !== null) {
              normalizedRow[key] = row[mappedKey];
            } else {
              normalizedRow[key] = null;
            }
          }
          // Post-normalization: Calculate revenue if it's missing but price/quantity exist.
          if (normalizedRow['revenue'] === null && normalizedRow['price'] !== null && normalizedRow['quantity'] !== null) {
              const price = Number(normalizedRow['price']);
              const quantity = Number(normalizedRow['quantity']);
              if (!isNaN(price) && !isNaN(quantity)) {
                  normalizedRow['revenue'] = price * quantity;
              }
          }
          return normalizedRow;
        });
      });
      
      // FIX: Added deliveredDate, cancelledDate, returnDate, and orderId to consolidatedMapping to satisfy the ColumnMapping type requirement.
      const consolidatedMapping: ColumnMapping = {
        date: 'date', customer: 'customer', item: 'item', quantity: 'quantity', 
        price: 'price', city: 'city', state: 'state', zipcode: 'zipcode', 
        revenue: 'revenue', brand: 'brand', orderStatus: 'orderStatus', 
        cancellationReason: 'cancellationReason', courier: 'courier', sku: 'sku', 
        articleType: 'articleType', discount: 'discount',
        deliveredDate: 'deliveredDate', cancelledDate: 'cancelledDate', returnDate: 'returnDate', orderId: 'orderId'
      };

      return { data: consolidatedData, mapping: consolidatedMapping };
    }
    return allData[activeDomain] || null;
  }), [activeDomain, allData]);

  const onSetActiveDomain = (domain: string) => {
    setActiveDomain(domain);
    setCurrentView('Dashboard');
  };

  return (
    <div className="flex h-screen bg-gray-900 flex-col md:flex-row">
      <Sidebar 
        domains={SIDEBAR_DOMAINS} 
        activeDomain={activeDomain} 
        setActiveDomain={onSetActiveDomain} 
        onLogout={onLogout}
        setCurrentView={setCurrentView}
        activeView={currentView}
        openDeleteModal={() => setIsDeleteModalOpen(true)}
      />
      <main className="flex-1 p-2 sm:p-4 lg:p-6 overflow-y-auto flex flex-col">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white">
            {currentView === 'Dashboard' ? `${activeDomain} Dashboard` : 'PPT Generator'}
          </h1>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-2.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors duration-300"
          >
            Upload New Data
          </button>
        </header>
        <div className="flex-1">
          {currentView === 'Dashboard' ? (
            <DashboardPage key={activeDomain} domain={activeDomain} domainData={currentDomainData} />
          ) : (
            <PPTGeneratorPage allData={allData} domains={SIDEBAR_DOMAINS} />
          )}
        </div>
      </main>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleFileUpload}
        domains={UPLOAD_DOMAINS}
      />
      <DeleteDataModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDataDelete}
        allData={allData}
        domains={UPLOAD_DOMAINS}
      />
    </div>
  );
};

export default DashboardLayout;