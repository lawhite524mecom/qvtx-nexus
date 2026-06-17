import { Toaster } from "@/components/ui/toaster"
import ChainOverview from './pages/ChainOverview'
import AddressView from './pages/AddressView'
import ByteID from './pages/ByteID'
import DNACompress from './pages/DNACompress'
import Contracts from './pages/Contracts'
import Disclosures from './pages/Disclosures'
import QVTXEMining from './pages/QVTXEMining'
import NFTGallery from './pages/NFTGallery'
import MyNFTs from './pages/MyNFTs'
import NFTDetail from './pages/NFTDetail'
import ServicesCatalog from './pages/ServicesCatalog'
import GatedRoute from './components/auth/GatedRoute'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/ByteID" element={
        <LayoutWrapper currentPageName="ByteID">
          <ByteID />
        </LayoutWrapper>
      } />
      <Route path="/DNACompress" element={
        <LayoutWrapper currentPageName="DNACompress">
          <DNACompress />
        </LayoutWrapper>
      } />
      <Route path="/Contracts" element={
        <LayoutWrapper currentPageName="Contracts">
          <Contracts />
        </LayoutWrapper>
      } />
      <Route path="/Disclosures" element={
        <LayoutWrapper currentPageName="Disclosures">
          <Disclosures />
        </LayoutWrapper>
      } />
      <Route path="/QVTXEMining" element={
        <LayoutWrapper currentPageName="QVTXEMining">
          <QVTXEMining />
        </LayoutWrapper>
      } />
      <Route path="/NFTGallery" element={
        <LayoutWrapper currentPageName="NFTGallery">
          <NFTGallery />
        </LayoutWrapper>
      } />
      <Route path="/MyNFTs" element={
        <LayoutWrapper currentPageName="MyNFTs">
          <MyNFTs />
        </LayoutWrapper>
      } />
      <Route path="/ServicesCatalog" element={
        <LayoutWrapper currentPageName="ServicesCatalog">
          <ServicesCatalog />
        </LayoutWrapper>
      } />
      <Route path="/NFTDetail" element={
        <LayoutWrapper currentPageName="NFTDetail">
          <NFTDetail />
        </LayoutWrapper>
      } />
      <Route path="/chain/:chainId" element={
        <LayoutWrapper currentPageName="ChainOverview">
          <ChainOverview />
        </LayoutWrapper>
      } />
      <Route path="/address/:addr" element={
        <LayoutWrapper currentPageName="AddressView">
          <AddressView />
        </LayoutWrapper>
      } />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App