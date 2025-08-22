import { SearchFilter } from "../components/SearchFilter/SearchFilter";
export function Home() {
  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
    //TODO: Implement search functionality
  };

  const handleRegionFilter = (region) => {
    console.log("Filtering by region:", region);
    //TODO: Implement region filter functionality
  };
  return (
    <main>
      <header role="banner">
        <h1>Countries Explorer</h1>
        <p>Welcome to the Countries Explorer app!</p>
      </header>
      <SearchFilter
        onSearch={handleSearch}
        onRegionFilter={handleRegionFilter}
      />

      <section data-testid="countries-section"></section>
    </main>
  );
}
