import Link from "next/link";

const NavbarItem = ({
  label,
  href
}: {
  label: string;
  href?: string;
}) => {
  const className = "text-white transition hover:text-gray-300";

  return href ? (
    <Link href={href} className={className}>
      {label}
    </Link>
  ) : (
    <span className="text-gray-400">{label}</span>
  );
};

export default NavbarItem;