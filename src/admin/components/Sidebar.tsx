/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { menuItems } from "../helpers/sidebarMenu";

export const AdminSidebar = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    dashboard: false,
    orders: false,
    requests: false,
    communication: false,
    settings: false,
  });
  const navigate = useNavigate();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div>
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-slate-200 rounded-lg shadow-lg border border-slate-700"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0  bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 h-screen bg-slate-800 text-slate-200 flex flex-col border-r border-slate-700 transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Header */}
        <div className="p-5.5 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Admin Dashboard
            </h2>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1">
            {menuItems.map((item: any) => {
              const Icon = item.icon;
              const isExpanded =
                expandedSections[item.id as keyof typeof expandedSections];
              const isActive = activeTab === item.id;

              return (
                <div key={item.id}>
                  {/* Main Menu Item */}
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.hasSubmenu) {
                        toggleSection(item.id);
                      }
                      // Close mobile menu when item is clicked
                      if (window.innerWidth < 1024) {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-6 py-3 text-left transition-all duration-200 hover:bg-slate-700/50 ${
                      isActive
                        ? "bg-slate-600 border-r-3 border-blue-400 text-slate-100"
                        : "text-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        size={20}
                        className={
                          isActive ? "text-blue-400" : "text-slate-400"
                        }
                      />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {item.hasSubmenu && (
                      <div className="text-slate-400">
                        {isExpanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Submenu */}
                  {item.hasSubmenu && isExpanded && (
                    <div className="bg-slate-900/50">
                      {item.submenuItems.map((subItem: any) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = activeTab === subItem.id;

                        return (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              setActiveTab(subItem.id);
                              navigate(`/admin${subItem.url}`);
                              if (window.innerWidth < 1024) {
                                setIsMobileMenuOpen(false);
                              }
                            }}
                            className={`w-full flex items-center px-12 py-2.5 text-left text-sm transition-colors duration-200 hover:bg-slate-700/30 ${
                              isSubActive
                                ? "bg-slate-700 text-blue-300 border-r-2 border-blue-400"
                                : "text-slate-400"
                            }`}
                          >
                            <SubIcon
                              size={16}
                              className={`mr-3 ${
                                isSubActive ? "text-blue-400" : "text-slate-500"
                              }`}
                            />
                            <span>{subItem.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-slate-200">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Admin User</p>
              <p className="text-xs text-slate-400">admin@gadgetstore.com</p>
            </div>
          </div>
        </div>
        <div />
      </div>
    </div>
  );
};
