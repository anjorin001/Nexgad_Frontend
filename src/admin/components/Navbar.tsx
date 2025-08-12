import { Search } from 'lucide-react';
import { useState } from 'react';

export default function AdminNavbar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="w-full bg-white border-b-2" style={{ borderBottomColor: '#CBDCEB' }}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-end sm:justify-between md:justify-end relative">

          {/* Search Bar */}
          <div className="relative">
            <div className="flex items-center bg-gray-50 rounded-lg border transition-colors duration-200 focus-within:border-opacity-100" 
                 style={{ borderColor: '#CBDCEB' }}>
              <div className="pl-3 pr-2">
                <Search className="w-5 h-5" style={{ color: '#456882' }} />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pr-4 bg-transparent outline-none text-gray-700 placeholder-gray-500 w-64"
                style={{ 
                  color: '#1B3C53'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}