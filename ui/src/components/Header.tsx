export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo placeholder - McKinsey-inspired blue square */}
            <div className="w-10 h-10 bg-mckinsey-blue-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              EcliptOS Marketplace
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#" 
              className="text-gray-700 hover:text-mckinsey-blue-500 transition-colors duration-200 font-medium text-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mckinsey-blue-500 after:transition-all after:duration-200 hover:after:w-full"
            >
              Browse
            </a>
            <a 
              href="#" 
              className="text-gray-700 hover:text-mckinsey-blue-500 transition-colors duration-200 font-medium text-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mckinsey-blue-500 after:transition-all after:duration-200 hover:after:w-full"
            >
              Documentation
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

