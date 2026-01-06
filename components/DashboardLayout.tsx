
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardPage from './DashboardPage';
import UploadModal from './UploadModal';
import DeleteDataModal from './DeleteDataModal';
import PPTGeneratorPage from './PPTGeneratorPage';
import { AllData, DomainData, OrderData, ColumnMapping } from '../types';
import { supabase } from '../utils/supabase';

interface DashboardLayoutProps {
  onLogout: () => void;
}

type View = 'Dashboard' | 'PPT';

// FIX: Removed apiKey prop drilling. The Gemini API client will now be instantiated with an environment variable at the point of use.
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const UPLOAD_DOMAINS = ["Myntra", "Amazon", "Flipkart", "AJIO", "Nykaa"];
  const SIDEBAR_DOMAINS = ["All Domains", ...UPLOAD_DOMAINS];

  const [activeDomain, setActiveDomain] = useState(SIDEBAR_DOMAINS[0]);
  const [allData, setAllData] = useState<AllData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('Dashboard');

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await supabase.from('dashboard_data').select('*');
        if (error) throw error;
        const loadedData: AllData = {};
        data.forEach((row: any) => {
          loadedData[row.domain] = { data: row.data, mapping: row.mapping };
        });
        setAllData(loadedData);
      } catch (error) {
        console.error("Could not load data from Supabase", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      if (isLoading) return;
      try {
        const promises = Object.entries(allData).map(([domain, domainData]) =>
          supabase.from('dashboard_data').upsert({
            domain,
            data: domainData.data,
            mapping: domainData.mapping,
          })
        );
        await Promise.all(promises);
      } catch (error) {
        console.error("Could not save data to Supabase", error);
      }
    };
    saveData();
  }, [allData, isLoading]);

  const handleFileUpload = (domain: string, newData: OrderData[], newMapping: ColumnMapping) => {
    setAllData(prev => {
      const existingDomainData = prev[domain];
      const existingData = existingDomainData?.data || [];

      // Helper to create a consistent, sorted string from a row object for accurate duplication checks
      const rowToString = (row: OrderData): string => {
        return JSON.stringify(Object.entries(row).sort((a, b) => a[0].localeCompare(b[0])));
      };

      // Create a set of all known rows for efficient duplicate checking.
      const allKnownRows = new Set(existingData.map(rowToString));

      const uniqueNewData = newData.filter(row => {
        const rowString = rowToString(row);
        // Check if the row already exists in our dataset.
        if (allKnownRows.has(rowString)) {
          return false; 
        }
        // Add the new unique row to the set to handle duplicates within the same uploaded file.
        allKnownRows.add(rowString); 
        return true;
      });

      console.log(`Added ${uniqueNewData.length} new unique rows for domain ${domain}.`);

      const consolidatedData = [...existingData, ...uniqueNewData];
      
      return { ...prev, [domain]: { data: consolidatedData, mapping: newMapping } };
    });
    setActiveDomain(domain);
    setCurrentView('Dashboard');
  };


  const handleDataDelete = (domain: string, year: number, month: number) => {
    if (domain === 'All Domains' && month === -1 && year) {
        setAllData(prev => {
            const nextState = { ...prev };
            for(const dom in nextState) {
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
        return;
    }


    if (domain === 'All Domains') {
      setAllData({});
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
        // month is -1 for "All Months"
        const matchesMonth = month === -1 ? true : date.getMonth() === month;

        return !(matchesYear && matchesMonth);
      });
      
      return { ...prev, [domain]: { ...domainState, data: newData } };
    });
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
    <div className="flex h-screen bg-gray-900">
      <Sidebar 
        domains={SIDEBAR_DOMAINS} 
        activeDomain={activeDomain} 
        setActiveDomain={onSetActiveDomain} 
        onLogout={onLogout}
        setCurrentView={setCurrentView}
        activeView={currentView}
        openDeleteModal={() => setIsDeleteModalOpen(true)}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto flex flex-col">
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