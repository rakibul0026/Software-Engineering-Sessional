import RawHtmlPage from "../components/RawHtmlPage";

const html = `<nav class="bg-blue-600 text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div class="flex items-center gap-2 text-2xl font-bold">
            <span class="text-3xl">🏛️</span> <a href="/">CSTU Library</a>
        </div>
        <div class="hidden md:flex gap-6 text-sm font-medium">
            <a href="/" class="hover:text-blue-200 transition">Home</a>
            <a href="/books" class="hover:text-blue-200 transition">Books</a>
            <a href="/category" class="text-blue-200 border-b-2 border-white pb-1">Category</a>
            <a href="/ebook" class="text-blue-100 hover:text-white transition">E-books</a>
            <a href="/question_bank" class="text-blue-100 hover:text-white transition">Question bank</a>
             <a href="/publication" class="text-blue-100 hover:text-white transition">Publication</a>
            <a href="/contact" class="text-blue-100 hover:text-white transition">Contact</a>
            <a href="/about" class="hover:text-blue-200 transition">About</a>
             <a href="/rules" class="text-blue-100 hover:text-white transition">Rules</a>
        </div>
        <div class="flex gap-4">
                    <a href="/admin" class="bg-yellow-500 text-white px-6 py-2 rounded font-semibold hover:bg-yellow-600 transition shadow-sm text-sm">
                        <i class="fas fa-cog mr-1"></i> Admin
                    </a>
                <a href="/profile" class="bg-green-500 text-white px-6 py-2 rounded font-semibold hover:bg-green-600 transition shadow-sm text-sm">
                    <i class="fas fa-user mr-1"></i> Profile
                </a>
                <a href="/logout" class="bg-red-500 text-white px-6 py-2 rounded font-semibold hover:bg-red-600 transition shadow-sm text-sm">
                    <i class="fas fa-sign-out-alt mr-1"></i> Logout
                </a>
                <a href="/login" class="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition shadow-sm text-sm">
                    Login
                </a>
                <a href="/signup" class="bg-blue-500 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition shadow-sm text-sm border border-blue-400">
                    SignUp
                </a>
        </div>
    </nav>

    <div class="bg-blue-700 py-16 px-4 text-center text-white">
        <h1 class="text-4xl font-bold mb-2">Book Categories</h1>
        <p class="opacity-80 text-lg">Browse our library collection by subject and genre</p>
    </div>

    <main class="max-w-7xl mx-auto py-16 px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            
            <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div class="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=500&q=80" 
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Science">
                </div>
                <div class="p-6 text-center">
                    <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto -mt-12 relative z-10 border-4 border-white">
                        <i class="fas fa-microscope"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mt-4">Science & Tech</h3>
                    <p class="text-gray-500 text-sm mb-6">Physics, Biology, and IT Engineering resources.</p>
                    <div class="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                        <span class="text-xs font-bold text-blue-600">5 Books</span>
                        <a href="/category/science-tech" class="text-xs font-bold uppercase hover:text-blue-800 transition">View All →</a>
                    </div>
                </div>
            </div>

            <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div class="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80" 
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Fiction">
                </div>
                <div class="p-6 text-center">
                    <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto -mt-12 relative z-10 border-4 border-white">
                        <i class="fas fa-feather-alt"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mt-4">Fiction</h3>
                    <p class="text-gray-500 text-sm mb-6">Classic novels, modern drama, and storytelling.</p>
                    <div class="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                        <span class="text-xs font-bold text-purple-600">7 Books</span>
                        <a href="/category/fiction" class="text-xs font-bold uppercase hover:text-purple-800 transition">View All →</a>
                    </div>
                </div>
            </div>

            <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div class="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=500&q=80" 
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="History">
                </div>
                <div class="p-6 text-center">
                    <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto -mt-12 relative z-10 border-4 border-white">
                        <i class="fas fa-monument"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mt-4">History</h3>
                    <p class="text-gray-500 text-sm mb-6">World history, archeology, and global events.</p>
                    <div class="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                        <span class="text-xs font-bold text-amber-600">3 Books</span>
                        <a href="/category/history" class="text-xs font-bold uppercase hover:text-amber-800 transition">View All →</a>
                    </div>
                </div>
            </div>

            <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div class="h-48 overflow-hidden">
                    <img src="/assets/images/Business/book/lviv-ukraine-february-20-2025-260nw-2597958335.webp" 
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Business">
                </div>
                <div class="p-6 text-center">
                    <div class="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto -mt-12 relative z-10 border-4 border-white">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mt-4">Business</h3>
                    <p class="text-gray-500 text-sm mb-6">Economics, Management, and Marketing.</p>
                    <div class="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                        <span class="text-xs font-bold text-green-600">3 Books</span>
                        <a href="/category/business" class="text-xs font-bold uppercase hover:text-green-800 transition">View All →</a>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <footer class="bg-[#0f172a] text-gray-400 py-12 px-8 mt-20">
        <div class="max-w-7xl mx-auto text-center">
            <div class="flex justify-center gap-6 mb-8 text-xl">
                <i class="fab fa-facebook hover:text-white cursor-pointer transition"></i>
                <i class="fab fa-twitter hover:text-white cursor-pointer transition"></i>
                <i class="fab fa-linkedin hover:text-white cursor-pointer transition"></i>
            </div>
            <p class="text-sm">© 2026 CSTU Library Management System. Chandpur, Bangladesh.</p>
        </div>
    </footer>`;

export default function CategoryPage() {
  return (
    <div className="page-shell">
      <RawHtmlPage html={html} />
    </div>
  );
}
