import { useState, useEffect, useRef } from "react";
import styles from "./SearchFilter.module.css";

export function SearchFilter({ onSearch, onRegionFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const onSearchRef = useRef(onSearch);


  useEffect(() => {
    onSearchRef.current = onSearch;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchRef.current?.(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]); 

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRegionChange = (e) => {
    onRegionFilter?.(e.target.value);
  };

  return (
    <section className={styles.searchFilter}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search countries..."
          aria-label="Search countries"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterContainer}>
        <select
          aria-label="Filter by region"
          onChange={handleRegionChange}
          className={styles.regionSelect}
        >
          <option value="">All Regions</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="oceania">Oceania</option>
        </select>
      </div>
    </section>
  );
}
