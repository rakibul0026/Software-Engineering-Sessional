import RawHtmlPage from "../components/RawHtmlPage";

const html = `<nav class="bg-blue-600 text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div class="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span class="text-3xl">🏛️</span> <a href="/">CSTU Library</a>
        </div>
        <div class="hidden md:flex gap-6 text-sm font-medium">
            <a href="/" class="hover:text-blue-200 transition">Home</a>
            <a href="/books" class="hover:text-blue-200 transition">Books</a>
            <a href="/category" class="hover:text-blue-200 transition">Category</a>
             <a href="/ebook" class="text-blue-100 hover:text-white transition">E-books</a>
             <a href="/question_bank" class="text-blue-100 hover:text-white transition">Question bank</a>
             <a href="/publication" class="text-blue-100 hover:text-white transition">Publication</a>
            <a href="/contact" class="hover:text-blue-200 transition">Contact</a>
            <a href="/about" class="text-blue-200 border-b-2 border-white">About</a>
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

    <header class="bg-slate-900 py-20 px-4 text-center text-white">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Empowering Minds Through Knowledge</h1>
        <p class="text-blue-400 text-lg font-medium">About Chandpur Science and Technology University Library</p>
    </header>

    <section class="max-w-7xl mx-auto py-20 px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
                <h2 class="text-3xl font-bold text-gray-800 mb-6 border-l-8 border-blue-600 pl-4">Our Mission</h2>
                <p class="text-gray-600 leading-relaxed mb-6 text-lg">
                    Established alongside the University, the CSTU Library is dedicated to supporting the academic excellence of our students and faculty. We provide a vast array of digital and physical resources specifically curated for science, technology, and engineering disciplines.
                </p>
                <p class="text-gray-600 leading-relaxed mb-6">
                    Our goal is to create an environment that fosters research, critical thinking, and a lifelong passion for learning. Whether you are a first-year student or a senior researcher, our library is designed to be your primary partner in success.
                </p>
                <div class="grid grid-cols-2 gap-4 mt-8">
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h4 class="font-bold text-blue-600 text-xl">24/7</h4>
                        <p class="text-gray-500 text-sm">Digital Access</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h4 class="font-bold text-blue-600 text-xl">Modern</h4>
                        <p class="text-gray-500 text-sm">Study Spaces</p>
                    </div>
                </div>
            </div>
            <div class="relative">
                <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80" 
                     alt="Library Interior" class="rounded-2xl shadow-2xl">
                <div class="absolute -bottom-6 -left-6 bg-blue-600 text-white p-8 rounded-2xl hidden lg:block">
                    <p class="text-4xl font-bold italic">"Read, Lead, Succeed."</p>
                </div>
            </div>
        </div>
    </section>

    <section class="bg-gray-100 py-20 px-4">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-gray-800">Why Choose CSTU Library?</h2>
                <p class="text-gray-500 mt-2">The pillars of our service to the community</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-10 rounded-2xl shadow-sm text-center">
                    <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                        <i class="fas fa-microchip"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4">Tech Focused</h3>
                    <p class="text-gray-600 text-sm">Specialized collections for ICT, Civil Engineering, and Emerging Technologies.</p>
                </div>
                <div class="bg-white p-10 rounded-2xl shadow-sm text-center">
                    <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                        <i class="fas fa-globe"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4">Global Reach</h3>
                    <p class="text-gray-600 text-sm">Access to international journals, e-books, and global research databases.</p>
                </div>
                <div class="bg-white p-10 rounded-2xl shadow-sm text-center">
                    <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4">Community</h3>
                    <p class="text-gray-600 text-sm">Collaborative zones designed for group projects and academic discussion.</p>
                </div>
            </div>
        </div>
    </section>

    <footer class="bg-[#0f172a] text-gray-400 py-16 px-8">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div class="text-center md:text-left">
                <h3 class="text-white text-2xl font-bold mb-2">CSTU Library</h3>
                <p class="text-sm">Chandpur Science and Technology University</p>
            </div>
            <div class="flex gap-8 text-sm">
                <a href="/" class="hover:text-white transition">Home</a>
                <a href="/books" class="hover:text-white transition">Books</a>
                <a href="/category" class="hover:text-white transition">Categories</a>
            </div>
            <p class="text-xs uppercase tracking-widest">&copy; 2026 CSTU Library. All Rights Reserved.</p>
        </div>
    </footer>`;

export default function AboutPage() {
  return (
    <div className="page-shell">
      <RawHtmlPage html={html} />
    </div>
  );
}
