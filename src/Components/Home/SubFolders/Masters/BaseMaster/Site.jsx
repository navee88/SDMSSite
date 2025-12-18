import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, FileText, SquarePen, Plus, Edit } from 'lucide-react';
import GridLayout from '../../../../Layout/Common/Home/Grid/GridLayout';
import { useLanguage } from '../../../../../Context/LanguageContext';
import { useTranslation } from "react-i18next";



const InstrumentGrid = () => {
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValues, setSearchValues] = useState({
        siteName: '',
        siteCode: '',
        
    });
    const [focusedInput, setFocusedInput] = useState(null);
    const [hoveredColumn, setHoveredColumn] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);



    // Simulate API call
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // Simulated API response
        const apiData = [
            { id: 1, siteName: 'DESKTOP-CU9J5T2', siteCode: 'CU-Summary1 (CU-Summary1)', live: true },
            { id: 2, siteName: 'DESKTOP-CU9J5T2', siteCode: 'CU-Summary1 (CU-Summary1)', live: true },
            { id: 3, siteName: 'DESKTOP-CU9J5T2', siteCode: 'MU-Summary1 (MU-Summary1)', live: true },
            { id: 4, siteName: 'DESKTOP-CU9J5T2', siteCode: 'AU-Summary1 (AU-Summary1)', live: true },
            { id: 5, siteName: 'DESKTOP-CU9J5T2', siteCode: 'CU-Summary1 (CU-Summary1)', live: true },
            { id: 6, siteName: 'DESKTOP-CU9J5T2', siteCode: 'CU-Summary1 (CU-Summary1)', live: false },
            { id: 7, siteName: 'DESKTOP-CU9J5T2', siteCode: 'CU-Summary1 (CU-Summary1)', live: true },
        ];
        setData(apiData);
        setFilteredData(apiData);
    };

    useEffect(() => {
        filterData();
    }, [searchValues, data]);

    const filterData = () => {
        let filtered = [...data];

        if (searchValues.siteName) {
            filtered = filtered.filter(item =>
                item.siteName.toLowerCase().includes(searchValues.siteName.toLowerCase())
            );
        }

        if (searchValues.siteCode) {
            filtered = filtered.filter(item =>
                item.siteCode.toLowerCase().includes(searchValues.siteCode.toLowerCase())
            );
        }

        if (searchValues.live) {
            const searchLower = searchValues.live.toLowerCase();
            filtered = filtered.filter(item => {
                const liveText = item.live ? 'true' : 'false';
                return liveText.includes(searchLower);
            });
        }

        setFilteredData(filtered);
    };

    const handleSort = (order) => {
        const sorted = [...filteredData].sort((a, b) => {
            if (order === 'asc') {
                return a.siteCode.localeCompare(b.siteCode);
            } else if (order === 'desc') {
                return b.siteCode.localeCompare(a.siteCode);
            }
            return 0;
        });
        setFilteredData(sorted);
        setSortOrder(order);
        setSortMenuOpen(false);
    };

    const handleRemoveSort = () => {
        filterData();
        setSortOrder(null);
        setSortMenuOpen(false);
    };

    const handleSearchChange = (column, value) => {
        setSearchValues(prev => ({
            ...prev,
            [column]: value
        }));
    };

    const clearSearch = (column) => {
        setSearchValues(prev => ({
            ...prev,
            [column]: ''
        }));
    };

    return (
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-gray-300 bg-white">
                <div
                    className="px-4 py-3 font-semibold text-sm text-gray-700 border-r border-gray-300 relative"
                    onMouseEnter={() => setHoveredColumn('siteName')}
                    onMouseLeave={() => setHoveredColumn(null)}
                >
                    <div className="flex items-center justify-between">
                        <span>Client Name</span>
                    </div>
                </div>
                <div
                    className="px-4 py-3 font-semibold text-sm text-gray-700 border-r border-gray-300 relative"
                    onMouseEnter={() => setHoveredColumn('siteCode')}
                    onMouseLeave={() => setHoveredColumn(null)}
                >
                    <div className="flex items-center justify-between">
                        <span>siteCode</span>
                        {hoveredColumn === 'siteCode' && (
                            <button
                                onClick={() => setSortMenuOpen(!sortMenuOpen)}
                                className="hover:bg-gray-100 p-1 rounded"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Sort Dropdown Menu */}
                    {sortMenuOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 shadow-lg z-10 w-48">
                            <button
                                onClick={() => handleSort('asc')}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12l7-7 7 7" />
                                </svg>
                                Sort Ascending
                            </button>
                            <button
                                onClick={() => handleSort('desc')}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 19V5M5 12l7 7 7-7" />
                                </svg>
                                Sort Descending
                            </button>
                            <button
                                onClick={handleRemoveSort}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                                Remove Sort
                            </button>
                        </div>
                    )}
                </div>
                <div
                    className="px-4 py-3 font-semibold text-sm text-gray-700 flex items-center justify-between"
                    onMouseEnter={() => setHoveredColumn('live')}
                    onMouseLeave={() => setHoveredColumn(null)}
                >
                    <span>live</span>
                </div>
            </div>

            {/* Search Row */}
            <div className="grid grid-cols-3 border-b border-gray-300 bg-gray-50">
                <div className="px-4 py-1 border-r border-gray-300">
                    <div className="relative">
                        {focusedInput !== 'siteName' && !searchValues.siteName && (
                            <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        )}
                        <input
                            type="text"
                            value={searchValues.siteCode}
                            onChange={(e) => handleSearchChange('siteName', e.target.value)}
                            onFocus={() => setFocusedInput('siteName')}
                            onBlur={() => setFocusedInput(null)}
                            className={`w-full ${focusedInput === 'siteName' || searchValues.siteName ? 'pl-2' : 'pl-8'} pr-2 py-1 text-sm border-0 border-b-2 ${focusedInput === 'siteName' ? 'border-blue-500' : 'border-gray-300'
                                } focus:outline-none bg-transparent`}
                        />
                    </div>
                </div>
                <div className="px-4 py-1 border-r border-gray-300">
                    <div className="relative">
                        {focusedInput !== 'siteCode' && !searchValues.siteCode && (
                            <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        )}
                        <input
                            type="text"
                            value={searchValues.siteCode}
                            onChange={(e) => handleSearchChange('siteCode', e.target.value)}
                            onFocus={() => setFocusedInput('siteCode')}
                            onBlur={() => setFocusedInput(null)}
                            className={`w-full ${focusedInput === 'siteCode' || searchValues.siteCode ? 'pl-2' : 'pl-8'} pr-2 py-1 text-sm border-0 border-b-2 ${focusedInput === 'siteCode' ? 'border-blue-500' : 'border-gray-300'
                                } focus:outline-none bg-transparent`}
                        />
                    </div>
                </div>
                <div className="px-4 py-2">
                    {/* Empty - no search for live column */}
                </div>
            </div>
            <div className="overflow-y-auto flex-1">
                {/* Data Rows */}
                {filteredData.map((row, index) => (
                    <div
                        key={row.id}
                        onClick={() => setSelectedRow(row.id)}
                        className={`grid grid-cols-3 border-b border-gray-200 cursor-pointer ${selectedRow === row.id ? 'bg-[#EEF2F9]' : 'hover:bg-gray-50'
                            }`}

                    >
                        <div className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200 font-medium">
                            {row.siteName}
                        </div>
                        <div className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">
                            {row.siteCode}
                        </div>
                        <div className="px-4 py-2 text-center">
                            {row.live && (
                                <span className="text-gray-700 text-lg">✓</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};



const UsersPage = () => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentLanguage, changeLanguage, languages } = useLanguage();
    const { t } = useTranslation();

    const mockData = [
        {
            id: 1,
            siteName: "DESKTOP-CU9J5T2",
            siteCode: "CU-Summary1 (CU-Summary1)",
            live: true
        },
        {
            id: 2,
            siteName: "DESKTOP-CU9J5T2",
            siteCode: "CU-Summary1 (CU-Summary1)",
            live: true
        },
        {
            id: 3,
            siteName: "DESKTOP-CU9J5T2",
            siteCode: "MU-Summary1 (MU-Summary1)",
            live: true
        },
        {
            id: 4,
            siteName: "DESKTOP-CU9J5T2",
            siteCode: "AU-Summary1 (AU-Summary1)",
            live: true
        },
        {
            id: 5,
            siteName: "DESKTOP-CU9J5T2",
            siteCode: "CU-Summary1 (CU-Summary1)",
            live: true
        },
        {
            id: 6,
            siteName: "DESKTOP-CU9J5T2",
            siteCode: "CU-Summary1 (CU-Summary1)",
            live: true
        },
        {
            id: 7,
            siteName: "DESKTOP-CU9J5T2",
            siteCode: "CU-Summary1 (CU-Summary1)",
            live: true
        }
    ];



    //   useEffect(() => {
    //     const fetchUsers = async () => {
    //       try {
    //         setLoading(true);
    //         const response = await axios.get('http://localhost:5173/users');
    //         setUserData(response.data);
    //         setLoading(false);
    //       } catch (err) {
    //         console.error("Error fetching data:", err);
    //         setError(err.message || "Something went wrong");
    //         setLoading(false);
    //       }
    //     };

    //     fetchUsers();
    //   }, []);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setUserData(mockData);
            setLoading(false);
        }, 300);

    }, []);


    const userColumns = useMemo(() => [
        {
            key: 'siteName',
            label: t('label.siteName'),
            width: 200,
            enableSearch: true,
            render: (row) => (
                <span className="text-gray-700">
                    {row.siteName}
                </span>
            )
        },
        {
            key: 'siteCode',
            label: t('label.siteCode'),
            width: 250,
            enableSearch: true,
            render: (row) => (
                <span className="text-gray-700">
                    {row.siteCode}
                </span>
            )
        },
    ], []);


    const renderUserDetail = (user) => (
        <div className="space-y-3 text-[12px]">

            <div className="grid grid-cols-3 gap-4">
                <div className="font-semibold text-700 text-[#405F7D]">{t("label.siteAddress")}</div>
                <div className="col-span-2">{user.siteAddress}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="font-semibold text-700 text-[#405F7D]">{t("label.contactPerson")}</div>
                <div className="col-span-2">{user.contactPerson}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="font-semibold text-700 text-[#405F7D]">{t("label.mobileNo")}</div>
                <div className="col-span-2">{user.mobileNo}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="font-semibold text-700 text-[#405F7D]">{t("label.faxNo")}</div>
                <div className="col-span-2">{user.faxNo}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="font-semibold text-700 text-[#405F7D]">{t("label.email")}</div>
                <div className="col-span-2">{user.email}</div>
            </div>
        </div>
    );


    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500"></div>;
    }


    return (
        <div className="flex flex-col">
            <GridLayout
                columns={userColumns}
                data={userData}
                renderDetailPanel={renderUserDetail}
            />
        </div>
    );
};


function Site() {
    const { currentLanguage, changeLanguage, languages } = useLanguage();
    const { t } = useTranslation();

    const ActionButton = ({ icon: Icon, label, disabled, onClick, className = "" }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-2 py-2 text-[11px] font-bold rounded whitespace-nowrap
      hover:scale-90 transition-all
      ${disabled
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                    : "bg-[#f1f5f9] text-[#2883FE] hover:bg-[#E6F0FF]"
                }
      ${className}
    `}
        >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{label}</span>
        </button>
    );


    return (
        <div className="px-4 font-roboto h-[calc(100vh-150px)] flex flex-col">

            {/* Top Action Buttons (same place) */}
            <div className="flex justify-end gap-2 mt-4">
                <ActionButton icon={Plus} label={t('button.add')} />
                <ActionButton icon={Edit} label={t('button.edit')} />
            </div>

            {/* UsersPage takes full width & height */}
            <div className="flex-1 overflow-hidden">
                <UsersPage />
            </div>

        </div>
    );

}

export default Site