const NavbarItem = ({ label }: { label: string }) => {
  return (
    <div className="text-white cursor-pointer hover:text-white transition">
      {label}
    </div>
  );
};

export default NavbarItem;