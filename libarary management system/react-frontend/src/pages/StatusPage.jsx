import RawHtmlPage from "../components/RawHtmlPage";

const html = `<nav class="bg-blue-600 text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div class="flex items-center gap-8">
            <div class="flex items-center gap-2 text-2xl font-bold">
                <span>🏛️</span> CSTU Library
            </div>
            <div class="hidden md:flex gap-6 text-sm font-medium">
                <a href="/" class="hover:text-blue-200 transition">Home</a>
                <a href="/books" class="hover:text-blue-200 transition">Books</a>
                <a href="/category" class="text-blue-100 hover:text-white transition">Category</a>
                <a href="/about" class="text-blue-100 hover:text-white transition">About</a>
                <a href="/contact" class="text-blue-100 hover:text-white transition">Contact</a>
                <a href="/ebook" class="text-blue-100 hover:text-white transition">E-books</a>
                <a href="/question_bank" class="text-blue-100 hover:text-white transition">Question bank</a>
                <a href="/rfid_scanner" class="text-blue-100 hover:text-white transition">RFID Scanner</a>
                <a href="/rules" class="text-blue-100 hover:text-white transition">Rules</a>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <a href="/profile" class="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-bold text-sm">
                <i class="fas fa-user"></i> Profile
            </a>
            <a href="/logout" class="text-sm font-semibold hover:underline">Logout</a>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto py-10 px-4">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-slate-800 mb-2">My Issued Books</h1>
            <p class="text-slate-500">Track your borrowed books and return dates</p>
        </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="book-card bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
                        <div class="absolute inset-0 bg-black bg-opacity-20"></div>
                        <div class="absolute bottom-4 left-4 text-white">
                        </div>
                        <div class="absolute top-4 right-4">
                            <span class="bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full font-bold">
                            </span>
                        </div>
                    </div>

                    <div class="p-6">
                        <div class="space-y-3">
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-slate-500">Issued Date:</span>
                            </div>

                            <div class="flex justify-between items-center text-sm">
                                <span class="text-slate-500">Due Date:</span>
                            </div>

                            <div class="flex justify-between items-center text-sm">
                                <span class="text-slate-500">Days Left:</span>
                            </div>
                        </div>

                        <div class="mt-6 space-y-3">
                                <div class="due-date-overdue p-3 rounded-lg">
                                    <div class="flex items-center gap-2 text-red-800">
                                        <i class="fas fa-exclamation-triangle"></i>
                                        <span class="font-bold text-sm">Overdue - Please return immediately</span>
                                    </div>
                                </div>
                                <div class="due-date-warning p-3 rounded-lg">
                                    <div class="flex items-center gap-2 text-orange-800">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                </div>
                                <div class="due-date-good p-3 rounded-lg">
                                    <div class="flex items-center gap-2 text-green-800">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                </div>

                            <div class="flex gap-2">
                                    <i class="fas fa-undo mr-1"></i> Return Book
                                </a>
                                    <i class="fas fa-calendar-plus mr-1"></i> Extend
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 class="font-bold text-slate-800 mb-4">Library Rules Reminder</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-calendar text-blue-500"></i>
                        <div>
                            <p class="font-semibold text-slate-800">Return Period</p>
                            <p class="text-slate-500">14 days from issue date</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <i class="fas fa-dollar-sign text-green-500"></i>
                        <div>
                            <p class="font-semibold text-slate-800">Fine Policy</p>
                            <p class="text-slate-500">BDT 5 per day overdue</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <i class="fas fa-book text-purple-500"></i>
                        <div>
                            <p class="font-semibold text-slate-800">Max Books</p>
                            <p class="text-slate-500">3 books per student</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-book-open text-slate-400 text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">No Books Issued</h3>
                <p class="text-slate-500 mb-6">You haven't borrowed any books yet. Start exploring our collection!</p>
                <div class="space-y-3">
                    <a href="/books" class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                        <i class="fas fa-search mr-2"></i> Browse Books
                    </a>
                    <br>
                    <a href="/rfid_scanner" class="inline-block text-blue-600 hover:text-blue-800 transition text-sm">
                        <i class="fas fa-microchip mr-1"></i> Use RFID Scanner
                    </a>
                </div>
            </div>
    </main>

    <footer class="bg-slate-800 text-slate-400 py-8 px-4 mt-12 text-center">
        <p class="text-sm">© 2026 CSTU Library Management System | Chandpur, Bangladesh</p>
    </footer>`;

export default function StatusPage() {
  return (
    <div className="page-shell">
      <RawHtmlPage html={html} />
    </div>
  );
}
