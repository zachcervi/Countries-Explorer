export function SearchFilter({ onSearch, onRegionFilter }) {
  const handleSearchChange = (e) => {
    onSearch?.(e.target.value);
  };

  const handleRegionChange = (e) => {
    onRegionFilter?.(e.target.value);
  };

  return (
    <section className="search-filter">
      <input
        type="text"
        placeholder="Search countries..."
        aria-label="Search countries"
        onChange={handleSearchChange}
      />
      <select aria-label="Filter by region" onChange={handleRegionChange}>
        <option value="">All Regions</option>
        <option value="africa">Africa</option>
        <option value="americas">Americas</option>
        <option value="asia">Asia</option>
        <option value="europe">Europe</option>
        <option value="oceania">Oceania</option>
      </select>
    </section>
  );
}
