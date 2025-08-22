import { SearchFilter } from "../components/SearchFilter/SearchFilter";
import styles from "./Home.module.css";
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
    <main className={styles.main}>
      <header role="banner" className={styles.header}>
        <h1 className={styles.title}>Countries Explorer</h1>
        <p className={styles.subtitle}>
          Welcome to the Countries Explorer app!
        </p>
      </header>
      <SearchFilter
        onSearch={handleSearch}
        onRegionFilter={handleRegionFilter}
      />

      <section data-testid="countries-section"></section>
    </main>
  );
}
