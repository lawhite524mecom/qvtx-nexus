/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AI from './pages/AI';
import Admin from './pages/Admin';
import Apps from './pages/Apps';
import BuyQVTX from './pages/BuyQVTX';
import Contracts from './pages/Contracts';
import Dashboard from './pages/Dashboard';
import Docs from './pages/Docs';
import Gaming from './pages/Gaming';
import Home from './pages/Home';
import PartnerDashboard from './pages/PartnerDashboard';
import Partnerships from './pages/Partnerships';
import Portfolio from './pages/Portfolio';
import Staking from './pages/Staking';
import StakingDashboard from './pages/StakingDashboard';
import Storage from './pages/Storage';
import TokenLaunchpad from './pages/TokenLaunchpad';
import Wallet from './pages/Wallet';
import XRP from './pages/XRP';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AI": AI,
    "Admin": Admin,
    "Apps": Apps,
    "BuyQVTX": BuyQVTX,
    "Contracts": Contracts,
    "Dashboard": Dashboard,
    "Docs": Docs,
    "Gaming": Gaming,
    "Home": Home,
    "PartnerDashboard": PartnerDashboard,
    "Partnerships": Partnerships,
    "Portfolio": Portfolio,
    "Staking": Staking,
    "StakingDashboard": StakingDashboard,
    "Storage": Storage,
    "TokenLaunchpad": TokenLaunchpad,
    "Wallet": Wallet,
    "XRP": XRP,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};