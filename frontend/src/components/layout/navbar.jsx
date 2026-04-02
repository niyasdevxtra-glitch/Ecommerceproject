import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, 
  Search, 
  ShoppingBag, 
  X, 
  User, 
  ChevronDown, 
  Heart,
  Truck,
  Smartphone,
  Watch,
  Speaker,
  Gamepad,
  Home,
  LayoutGrid,
  Moon,
  Sun,
  LogOut,
  Package
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import MiniCart from "./MiniCart";
import AnimatedLogoutButton from "../common/AnimatedLogoutButton";
import "./glowing-nav.css";

const CATEGORY_ICONS = {
  "Mobiles": <Smartphone size={18} />,
  "Watches": <Watch size={18} />,
  "Speakers": <Speaker size={18} />,
  "Gaming": <Gamepad size={18} />,
};

const getCategoryIcon = (name) => CATEGORY_ICONS[name] || <LayoutGrid size={18} />;

export default function NavbarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      navigate(`/Product?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
    }
  };

  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    API.get('/api/categorys')
      .then(res => setCategories(res.data || []))
      .catch(err => console.error("Failed to fetch categories:", err));
  }, []);

  return (
    <>
      <MiniCart />
      {/* Announcement Bar */}
      <div className="w-full bg-black text-white py-1.5 px-4 text-center text-[9px] md:text-[10px] font-semibold tracking-[0.2em] uppercase">
        <span className="flex items-center justify-center gap-2">
          <Truck size={12} /> Free Delivery Above ₹499 • 2026 pixel edition
        </span>
      </div>

      <nav className="sticky top-0 w-full z-50 transition-all duration-300 bg-[#ffffff] dark:bg-[#09090b] border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 relative">
            
            {/* Mobile Menu Button */}
            <button className="lg:hidden hover:scale-110 transition-transform dark:text-white" onClick={() => setIsOpen(true)}>
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 group absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <span className="text-lg font-black tracking-tighter transition-colors group-hover:text-accent dark:text-white">PIXEL</span>
              <span className="w-1 h-1 bg-accent rounded-full animate-pulse self-end mb-1"></span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-sm font-semibold hover:text-accent transition-colors dark:text-zinc-400 dark:hover:text-white">Home</Link>
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-semibold hover:text-accent transition-colors py-8 cursor-pointer dark:text-zinc-400 dark:hover:text-white">
                  Categories <ChevronDown size={14} />
                </button>
                {/* Mega Menu */}
                <div className="absolute top-full -left-10 w-64 glass p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 rounded-2xl shadow-xl">
                  {categories.map((cat) => (
                    <Link 
                      key={cat._id || cat.name} 
                      to={`/category/${cat.name.toLowerCase()}`}
                      className="flex items-center gap-3 p-3 text-sm font-medium rounded-xl hover:bg-black hover:text-white transition-all mb-1"
                    >
                      {getCategoryIcon(cat.name)} {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
                  <Link to="/Product" className="text-sm font-semibold hover:text-accent transition-colors dark:text-zinc-400 dark:hover:text-white">Shop All</Link>
                </div>

            {/* Search, Auth, Cart */}
            <div className="flex items-center gap-4 md:gap-6 ml-auto lg:ml-0">
              <div className="hidden md:flex relative group">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="Find your vibe..." 
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={handleSearch}
                  className="pl-10 pr-4 py-2 bg-gray-100/50 dark:bg-zinc-900/50 rounded-full text-sm w-48 lg:w-64 focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                />
              </div>

              <div className="flex items-center gap-3 md:gap-5">
                <button 
                  onClick={toggleTheme}
                  className="p-2 hover:scale-110 transition-transform bg-gray-100 dark:bg-zinc-800 rounded-full"
                >
                  {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {isLoggedIn ? (
                  <div className="scale-75 hover:scale-90 transition-transform transform origin-right">
                      <AnimatedLogoutButton onClick={handleLogout} />
                  </div>
                ) : (
                  <Link to="/login" className="hover:scale-110 transition-transform dark:text-white">
                    <User size={22} strokeWidth={1.5} />
                  </Link>
                )}
                {isLoggedIn && (
                  <Link to="/orders" className="hidden lg:flex hover:scale-110 transition-transform relative group dark:text-white" title="My Orders">
                    <Package size={22} strokeWidth={1.5} />
                  </Link>
                )}
                <Link to="/wishlist" className="hidden lg:flex hover:scale-110 transition-transform relative group dark:text-white">
                  <Heart size={22} strokeWidth={1.5} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-black dark:bg-white dark:text-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold group-hover:bg-accent group-hover:text-black transition-colors">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="hidden lg:flex hover:scale-110 transition-transform relative group dark:text-white"
                >
                  <ShoppingBag size={22} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-black dark:bg-white dark:text-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold group-hover:bg-accent group-hover:text-black transition-colors">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className={`absolute left-0 top-0 h-full w-[80%] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl transition-transform duration-300 p-6 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between mb-10">
            <span className="text-2xl font-black dark:text-white">MENU</span>
            <button onClick={() => setIsOpen(false)} className="dark:text-white"><X size={24} /></button>
          </div>
          <div className="space-y-6 flex-1">
            <Link to="/" className="block text-xl font-bold border-b border-gray-100 dark:border-zinc-800 pb-2 dark:text-white">Home</Link>
            <div className="space-y-4">
              <p className="text-xs uppercase font-bold text-gray-400 tracking-widest">Categories</p>
              {categories.map(cat => (
                <Link key={cat._id || cat.name} to={`/category/${cat.name.toLowerCase()}`} className="flex items-center gap-3 text-lg font-medium dark:text-zinc-300" onClick={() => setIsOpen(false)}>
                  {getCategoryIcon(cat.name)} {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-6 space-y-4 border-t border-gray-100">
            {isLoggedIn ? (
              <>
                <Link to="/orders" className="px-6 py-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 w-full flex items-center gap-3 text-lg font-bold dark:text-white border border-gray-100 dark:border-zinc-800 transition-all active:scale-95" onClick={() => setIsOpen(false)}>
                  <Package size={20} /> My Orders
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="premium-button w-full justify-center flex items-center gap-2">
                   Power Down
                </button>
              </>
            ) : (
               <Link to="/login" className="premium-button w-full justify-center flex items-center gap-2" onClick={() => setIsOpen(false)}>
                 <User size={18} /> Join Pixel
               </Link>
            )}
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
}

function MobileBottomNav() {
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  
  const location = useLocation();
  const path = location.pathname;
  
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
     if (isCartOpen) {
       setActiveIndex(2);
       return;
     }

     if (path === '/') setActiveIndex(0);
     else if (path.startsWith('/Product') || path.startsWith('/category')) setActiveIndex(1);
     else if (path.startsWith('/cart')) setActiveIndex(2);
     else if (path.startsWith('/wishlist')) setActiveIndex(3);
     else setActiveIndex(4);
  }, [path, isCartOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="xl:hidden glowing-nav">
      <ul>
        <li className={`list ${activeIndex === 0 ? 'active' : ''}`} style={{ "--clr": "#f44336" }}>
          <Link to="/" onClick={() => setActiveIndex(0)}>
            <span className="icon"><Home size={24} /></span>
            <span className="text">Home</span>
          </Link>
        </li>
        <li className={`list ${activeIndex === 1 ? 'active' : ''}`} style={{ "--clr": "#ffa117" }}>
          <Link to="/Product" onClick={() => setActiveIndex(1)}>
            <span className="icon"><LayoutGrid size={24} /></span>
            <span className="text">Shop</span>
          </Link>
        </li>
        <li className={`list ${activeIndex === 2 ? 'active' : ''}`} style={{ "--clr": "#0fc70f" }}>
          <button onClick={() => { setActiveIndex(2); setIsCartOpen(true); }}>
            <span className="icon relative">
              <ShoppingBag size={24} />
              {cartCount > 0 && <span className="absolute top-2 right-2 bg-accent text-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-black border border-white dark:border-zinc-950">{cartCount}</span>}
            </span>
            <span className="text">Cart</span>
          </button>
        </li>
        <li className={`list ${activeIndex === 3 ? 'active' : ''}`} style={{ "--clr": "#2196f3" }}>
          <Link to="/wishlist" onClick={() => setActiveIndex(3)}>
            <span className="icon relative">
              <Heart size={24} />
              {wishlistCount > 0 && <span className="absolute top-2 right-2 bg-black text-white dark:bg-white dark:text-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-black">{wishlistCount}</span>}
            </span>
            <span className="text">Likes</span>
          </Link>
        </li>
        <li className={`list ${activeIndex === 4 ? 'active' : ''}`} style={{ "--clr": "#9c27b0" }}>
          <Link to="/orders" onClick={() => setActiveIndex(4)}>
            <span className="icon relative">
              <Package size={24} />
            </span>
            <span className="text">Orders</span>
          </Link>
        </li>
        <div className="glowing-nav-indicator" style={{ transform: `translateX(calc(20vw * ${activeIndex}))` }}></div>
      </ul>
    </div>
  );
}
