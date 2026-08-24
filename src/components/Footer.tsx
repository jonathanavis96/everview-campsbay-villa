const base = import.meta.env.BASE_URL;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper">
      <div className="container py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-label text-paper/60 mb-3">Address</p>
          <p className="text-body">
            14 Cramond Road
            <br />
            Camps Bay, Cape Town
          </p>
        </div>
        <div>
          <p className="text-label text-paper/60 mb-3">Contact</p>
          <p className="text-body">
            <a href="tel:+27822227457" className="hover:underline">
              +27 82 222 7457
            </a>
          </p>
          <p className="text-body">
            <a
              href="https://wa.me/27822227457"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              WhatsApp
            </a>
          </p>
        </div>
        <div>
          <p className="text-label text-paper/60 mb-3">Before &amp; after</p>
          <a href={`${base}old/`} className="text-body hover:underline">
            See the previous site
          </a>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="container py-6">
          <p className="text-caption text-paper/50">
            © {year} Everview, Camps Bay.
          </p>
        </div>
      </div>
    </footer>
  );
}
