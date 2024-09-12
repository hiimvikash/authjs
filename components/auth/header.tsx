function Header({ label }: { label: string }) {
  return (
    <div
      className="flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-3xl font-semibold">🔐Auth</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

export default Header;
