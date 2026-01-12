export default function Footer() {
  return (
    <footer className="bg-mckinsey-blue-800 text-white mt-20">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-mckinsey-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h3 className="text-lg font-bold text-white">EcliptOS Marketplace</h3>
            </div>
            <p className="text-sm text-mckinsey-light-200 leading-relaxed">
              Centralized repository for MLRun functions, modules, and steps. 
              Discover and integrate powerful MLRun components for your projects.
            </p>
          </div>

          {/* Resources Section */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#" 
                  className="text-mckinsey-light-200 hover:text-white transition-colors duration-200"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-mckinsey-light-200 hover:text-white transition-colors duration-200"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-mckinsey-light-200 hover:text-white transition-colors duration-200"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-mckinsey-light-200 hover:text-white transition-colors duration-200"
                >
                  Examples
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#" 
                  className="text-mckinsey-light-200 hover:text-white transition-colors duration-200"
                >
                  License
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-mckinsey-light-200 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-mckinsey-light-200 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-mckinsey-light-200 hover:text-white transition-colors duration-200"
                >
                  Contributing
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-mckinsey-blue-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-mckinsey-light-200 text-center md:text-left">
              © {new Date().getFullYear()} EcliptOS Marketplace. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a 
                href="#" 
                className="text-mckinsey-light-200 hover:text-white transition-colors"
              >
                Support
              </a>
              <a 
                href="#" 
                className="text-mckinsey-light-200 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

