const services = [
  ["Restaurant pickup", "Pick up an order from a local restaurant and bring it to your door."],
  ["Groceries & shops", "Send a rider to collect an order from a local store."],
  ["Documents", "Fast point-to-point delivery for papers and small documents."],
  ["Small parcels", "Send a small package to someone across Khenifra."],
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <strong>Khenifra Delivery</strong>
        <div className="lang">العربية · Français · English</div>
      </nav>

      <section className="hero">
        <div>
          <span className="eyebrow">LOCAL DELIVERY · KHENIFRA</span>
          <h1>Send it across the city.</h1>
          <p className="lead">
            Request a local rider for food, groceries, shop orders, documents and small parcels.
          </p>
          <div className="actions">
            <a className="button primary" href="#request">Request delivery</a>
            <a className="button secondary" href="#riders">Become a rider</a>
          </div>
        </div>

        <div className="requestCard" id="request">
          <span className="status">MVP REQUEST</span>
          <h2>Where should we deliver?</h2>
          <label>Pickup</label>
          <input placeholder="Shop, restaurant or address" />
          <label>Drop-off</label>
          <input placeholder="Delivery address" />
          <label>What are we carrying?</label>
          <select defaultValue="">
            <option value="" disabled>Select a category</option>
            <option>Food order</option>
            <option>Groceries / shop order</option>
            <option>Documents</option>
            <option>Small parcel</option>
          </select>
          <button>Get delivery estimate</button>
          <small>Cash-first pilot. Final price shown before confirming.</small>
        </div>
      </section>

      <section className="services">
        <div className="sectionHead">
          <span className="eyebrow">ONE RIDER NETWORK</span>
          <h2>Useful from day one</h2>
        </div>
        <div className="grid">
          {services.map(([title, text]) => (
            <article key={title}>
              <div className="icon">↗</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rider" id="riders">
        <div>
          <span className="eyebrow">FOR LOCAL RIDERS</span>
          <h2>Deliver when you are available.</h2>
          <p>Receive nearby requests, accept jobs, confirm pickup and complete deliveries from your phone.</p>
        </div>
        <a className="button primary" href="mailto:simohamed.amara@gmail.com?subject=Khenifra%20Delivery%20Rider">Join pilot</a>
      </section>
    </main>
  );
}
