import Image from "next/image";
import { useState } from "react";
import NavbarItem from "./navbaritem";
import { BsBell, BsChevronDown, BsSearch } from "react-icons/bs";
import AccountMenu from "./accountmenu";

const unavailablePages = [
  "TV Shows",
  "Movies",
  "Browse by Language",
  "New & Popular"
];

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "TV Shows" },
  { label: "Movies" },
  { label: "Browse by Language" },
  { label: "New & Popular" },
  { label: "My List", href: "/my-list" }
];

const MobileMenu = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;

  return (
    <div
      id="mobile-navigation-menu"
      className="absolute left-0 top-8 flex w-56 flex-col border-2 border-gray-800 bg-black py-5"
    >
      <div className="flex flex-col gap-4">
        <NavbarItem label="Home" href="/" />
        <NavbarItem label="My List" href="/my-list" />
        {unavailablePages.map((item) => (
          <button
            key={item}
            type="button"
            disabled
            className="cursor-not-allowed text-left text-gray-500"
            aria-label={`${item} page is not available yet`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

const Navbar = ({
  profileImage,
  profileName,
  email
}: {
  profileImage: string | null;
  profileName: string;
  email: string;
}) => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);

  return (
    <nav className="fixed z-40 w-full">
      <div className="flex flex-row items-center bg-zinc-900 bg-opacity-90 px-4 py-6 transition duration-500 md:px-16">
        <Image
          src="/images/logo.png"
          alt="Netflix"
          width={1280}
          height={346}
          priority
          className="h-8 w-auto"
        />
        <div
          className="relative ml-8 flex flex-row items-center space-x-2 lg:hidden"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setMobileMenuVisible(true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") setMobileMenuVisible(false);
          }}
        >
          <button
            type="button"
            aria-expanded={mobileMenuVisible}
            aria-controls="mobile-navigation-menu"
            onClick={() => setMobileMenuVisible((visible) => !visible)}
            className="flex items-center gap-2 text-white"
          >
            Browse
            <BsChevronDown aria-hidden="true" className="transition" />
          </button>
          <MobileMenu visible={mobileMenuVisible} />

        </div>
        <div className="relative ml-8 hidden flex-row space-x-4 lg:flex">
          {navigationItems.map((item) => (
            <NavbarItem key={item.label} {...item} />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-5">
          <div className="relative">
            <button
              type="button"
              aria-label={notificationsOpen ? "Close notifications" : "Notifications"}
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((open) => !open)}
              className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <BsBell aria-hidden="true" size={22} />
            </button>
            {notificationsOpen && (
              <div
                role="status"
                className="absolute right-0 top-10 w-56 border border-zinc-700 bg-zinc-900 p-4 text-sm text-white shadow-lg"
              >
                No new notifications.
              </div>
            )}
          </div>
          {searchOpen && (
            <input
              type="search"
              aria-label="Search titles"
              placeholder="Search titles"
              autoFocus
              className="w-40 border border-white bg-black/80 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white sm:w-56"
            />
          )}
          <button
            type="button"
            aria-label={searchOpen ? "Close title search" : "Search titles"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
            className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <BsSearch aria-hidden="true" size={22} />
          </button>
          <div
            className="relative"
          >
            <button
              type="button"
              aria-label={accountMenuVisible ? "Close user menu" : "Open user menu"}
              aria-expanded={accountMenuVisible}
              aria-controls="account-menu"
              onClick={() => setAccountMenuVisible((visible) => !visible)}
              className="flex items-center gap-1 rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <Image
                src={profileImage || "/images/default-blue.png"}
                alt=""
                width={32}
                height={32}
                unoptimized={Boolean(profileImage)}
                className="h-8 w-8 rounded-sm object-cover"
              />
              <BsChevronDown
                aria-hidden="true"
                className={`transition-transform ${accountMenuVisible ? "rotate-180" : ""}`}
              />
            </button>
            <AccountMenu
              visible={accountMenuVisible}
              profileName={profileName}
              email={email}
              profileImage={profileImage}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;