import { SearchFilter } from "../components/SearchFilter/SearchFilter";
import { CountryList } from "../components/CountryList/CountryList";
import { useCountries } from "../hooks/useCountries";
import styles from "./Home.module.css";

export function Home() {
  const { countries, loading, error, searchCounties, filterByRegion } =
    useCountries();

  const handleSearch = (searchTerm) => {
    searchCounties(searchTerm);
  };

  const handleRegionFilter = (region) => {
    filterByRegion(region);
  };
  return (
    <main className={styles.main}>
      <header role="banner" className={styles.header}>
        <h1 className={styles.title}>Countries Explorer</h1>
        <p className={styles.subtitle}>
          Discover amazing facts, cultures, and information about countries from
          around the world
        </p>
      </header>
      <div className={styles.searchSection}>
        <SearchFilter
          onSearch={handleSearch}
          onRegionFilter={handleRegionFilter}
        />
      </div>

      <section
        data-testid="countries-section"
        className={styles.countriesSection}
      >
        {error ? (
          <div className={styles.error}>
            <p>Failed to load countries. Please try again.</p>
          </div>
        ) : (
          <CountryList countries={countries} loading={loading} />
        )}
      </section>
    </main>
  );
}
