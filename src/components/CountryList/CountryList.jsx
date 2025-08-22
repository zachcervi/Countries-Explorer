import { CountryCard } from "../CountryCard/CountryCard";
import styles from "./CountryList.module.css";

export function CountryList({ countries, loading }) {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div data-testid="loading-spinner" className={styles.spinner}></div>
        <p className={styles.loadingText}>Loading countries...</p>
      </div>
    );
  }

  if (!countries || countries.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🌍</div>
        <h3 className={styles.emptyTitle}>No countries found</h3>
        <p className={styles.emptyText}>
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <ul className={styles.countryGrid} role="list">
      {countries.map((country) => (
        <li key={country.cca3} role="listitem">
          <CountryCard data-testid="country-card" country={country} />
        </li>
      ))}
    </ul>
  );
}
