import React from 'react';

interface Column {
    header: string;
    accessor: string;
    format?: 'currency' | 'number';
}

interface InsightTableProps {
  data: any[];
  title: string;
  columns: Column[];
}

const InsightTable: React.FC<InsightTableProps> = ({ data, title, columns }) => {
    if (!data.length) {
        return (
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
                <p className="text-gray-400 text-center py-8">No data available.</p>
            </div>
        );
    }
    
    const formatValue = (value: any, format?: 'currency' | 'number') => {
        if (format === 'currency') return `₹${Number(value).toLocaleString('en-IN')}`;
        if (format === 'number') return Number(value).toLocaleString('en-IN');
        return String(value);
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <div className="overflow-y-auto max-h-96">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700 sticky top-0">
                        <tr>
                            {columns.map(col => (
                                <th key={col.accessor} scope="col" className="px-4 py-3 whitespace-nowrap">{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                {columns.map(col => (
                                    <td key={col.accessor} className="px-4 py-3 whitespace-nowrap">
                                        {formatValue(row[col.accessor], col.format)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InsightTable;
