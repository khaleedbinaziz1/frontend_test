import Link from 'next/link';

const Footer1 = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">
              About Us
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-accent transition-colors">
                  About Company
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-accent transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-accent transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-accent transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">
              Get In Touch
            </h3>
            <div className="space-y-2 text-gray-300">
              <p>Hotline: 16263</p>
              <p>Email: support@company.com.bd</p>
              <p>Address: Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-6 border-t border-gray-600">
          <div className="text-center">
            <h4 className="text-accent font-medium mb-4">Secure Payment Methods</h4>
            <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
              {/* SSL Commerz */}
              <div className="bg-white px-3 py-1 rounded text-xs font-medium text-blue-600">
                SSL Commerz
              </div>
              {/* bKash */}
              <div className="bg-pink-100 px-3 py-1 rounded text-xs font-medium text-pink-600">
                bKash
              </div>
              {/* Nagad */}
              <div className="bg-red-100 px-3 py-1 rounded text-xs font-medium text-red-600">
                Nagad
              </div>
              {/* Rocket */}
              <div className="bg-purple-100 px-3 py-1 rounded text-xs font-medium text-purple-600">
                Rocket
              </div>
              {/* Cash on Delivery */}
              <div className="bg-accent px-3 py-1 rounded text-xs font-medium text-white">
                Cash on Delivery
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Powered by */}
        <div className="mt-6 pt-6 border-t border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              &copy; {currentYear} Your Company. All rights reserved.
            </p>
            
       <a
  href="https://www.pixentix.com"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block"
>
  <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg hover:shadow-md transition">
    <span className="text-gray-800 text-sm font-medium">Powered by PIXENTIX</span>
    <img
      src="https://i.ibb.co/B5nHQjNR/pixentix-logo-removebg-preview.png"
      alt="Pixentix"
      className="h-8 w-auto filter brightness-110"
    />
  </div>
</a>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer1;