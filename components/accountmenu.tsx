import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface AccountMenuProps {
  visible: boolean;
  profileName: string;
  email: string;
  profileImage: string | null;
}

const AccountMenu = ({ visible, profileName, email, profileImage }: AccountMenuProps) => {
  if (!visible) return null;

  return (
    <div
      id="account-menu"
      className="absolute right-0 top-12 w-64 border border-zinc-700 bg-zinc-900 p-4 text-sm text-white shadow-lg"
    >
      <div className="mb-3 flex items-center gap-3 border-b border-zinc-700 pb-3">
        <Image
          src={profileImage || "/images/default-blue.png"}
          alt=""
          width={40}
          height={40}
          unoptimized={Boolean(profileImage)}
          className="h-10 w-10 rounded object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-semibold">{profileName}</p>
          <p className="truncate text-zinc-400">{email}</p>
        </div>
      </div>
      <Link href="/profiles" className="block py-2 hover:underline">
        Manage Profiles
      </Link>
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/auth" })}
        className="block w-full py-2 text-left hover:underline"
      >
        Sign Out
      </button>
    </div>
  );
};

export default AccountMenu;