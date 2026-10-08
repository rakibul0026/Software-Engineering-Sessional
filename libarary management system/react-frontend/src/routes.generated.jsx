import AboutPage from "./pages/AboutPage";
import AdminAddBooksPage from "./pages/AdminAddBooksPage";
import AdminEbookSectionPage from "./pages/AdminEbookSectionPage";
import AdminIssueBooksPage from "./pages/AdminIssueBooksPage";
import AdminMembersPage from "./pages/AdminMembersPage";
import AdminPage from "./pages/AdminPage";
import AdminPublicationPage from "./pages/AdminPublicationPage";
import AdminQuestionBankPage from "./pages/AdminQuestionBankPage";
import AdminRfidTagsPage from "./pages/AdminRfidTagsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AdminTermsPage from "./pages/AdminTermsPage";
import AdminTotalBooksPage from "./pages/AdminTotalBooksPage";
import BooksPage from "./pages/BooksPage";
import CategoryPage from "./pages/CategoryPage";
import BusinessPage from "./pages/BusinessPage";
import ContactPage from "./pages/ContactPage";
import FictionPage from "./pages/FictionPage";
import EbookPage from "./pages/EbookPage";
import HistoryPage from "./pages/HistoryPage";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import ScienceTechPage from "./pages/ScienceTechPage";
import ProfilePage from "./pages/ProfilePage";
import PublicationPage from "./pages/PublicationPage";
import QrSystemPage from "./pages/QrSystemPage";
import QuestionBankPage from "./pages/QuestionBankPage";
import RfidScannerPage from "./pages/RfidScannerPage";
import RulesPage from "./pages/RulesPage";
import ScannerPage from "./pages/ScannerPage";
import SignupPage from "./pages/SignupPage";
import StatusPage from "./pages/StatusPage";

export const routeDefinitions = [
  { path: "/about", Component: AboutPage },
  { path: "/admin", Component: AdminPage },
  { path: "/admin/add-books", Component: AdminAddBooksPage },
  { path: "/admin/ebook-section", Component: AdminEbookSectionPage },
  { path: "/admin/issue-books", Component: AdminIssueBooksPage },
  { path: "/admin/members", Component: AdminMembersPage },
  { path: "/admin-panel", Component: AdminPage },
  { path: "/admin/publication", Component: AdminPublicationPage },
  { path: "/admin/question-bank", Component: AdminQuestionBankPage },
  { path: "/admin_rfid_tags", Component: AdminRfidTagsPage },
  { path: "/admin/settings", Component: AdminSettingsPage },
  { path: "/admin/terms", Component: AdminTermsPage },
  { path: "/admin/total-books", Component: AdminTotalBooksPage },
  { path: "/books", Component: BooksPage },
  { path: "/category", Component: CategoryPage },
  { path: "/category/business", Component: BusinessPage },
  { path: "/category/fiction", Component: FictionPage },
  { path: "/category/history", Component: HistoryPage },
  { path: "/contact", Component: ContactPage },
  { path: "/ebook", Component: EbookPage },
  { path: "/history", Component: HistoryPage },
  { path: "/", Component: IndexPage },
  { path: "/login", Component: LoginPage },
  { path: "/profile", Component: ProfilePage },
  { path: "/publication", Component: PublicationPage },
  { path: "/qr_system", Component: QrSystemPage },
  { path: "/question_bank", Component: QuestionBankPage },
  { path: "/category/science-tech", Component: ScienceTechPage },
  { path: "/rfid_scanner", Component: RfidScannerPage },
  { path: "/rules", Component: RulesPage },
  { path: "/scanner", Component: ScannerPage },
  { path: "/signup", Component: SignupPage },
  { path: "/status", Component: StatusPage }
];
