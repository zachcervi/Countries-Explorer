export function Home() {
  return (
    <main>
      <header role="banner">
        <h1>Countries Explorer</h1>
        <p>Welcome to the Countries Explorer app!</p>
      </header>
      <section>
        <input
          type="text"
          placeholder="Search countries"
          aria-label="Search countries"
        />
        <select aria-label="Filter by region">
          <option value="">All Regions</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="oceania">Oceania</option>
        </select>
      </section>

      <section data-testid="countries-section"></section>
    </main>
  );
}
