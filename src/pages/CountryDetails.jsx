import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCountryByCode } from "../services/countriesApi";
import styles from "./CountryDetails.module.css";

export function CountryDetails() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCountry = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCountryByCode(code);
        setCountry(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      loadCountry();
    }
  }, [code]);

  const formatPopulation = (population) => {
    return population?.toLocaleString() || "N/A";
  };

  const formatLanguages = (languages) => {
    if (!languages) return "N/A";
    return Object.values(languages).join(", ");
  };

  const formatCurrencies = (currencies) => {
    if (!currencies) return "N/A";
    return Object.values(currencies)
      .map((currency) => `${currency.name} (${currency.symbol || ""})`)
      .join(", ");
  };

  const getFlagUrl = (flags) => {
    if (!flags) return null;
    return flags.svg || flags.png || null;
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div data-testid="loading-spinner" className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading country details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Country not found</h2>
          <p className={styles.errorText}>
            We couldn't find the country you're looking for. It may not exist or
            there was an error loading the data.
          </p>
          <button onClick={handleBackClick} className={styles.backButton}>
            ← Back to Countries
          </button>
        </div>
      </div>
    );
  }

  if (!country) {
    return null;
  }

  const flagUrl = getFlagUrl(country.flags);

  return (
    <div className={styles.container}>
      <button
        onClick={handleBackClick}
        className={styles.backButton}
        aria-label="Go back to countries list"
      >
        ← Back to Countries
      </button>

      <div className={styles.detailsCard}>
        <div className={styles.flagSection}>
          {flagUrl ? (
            <img
              src={flagUrl}
              alt={country.flags?.alt || `Flag of ${country.name.common}`}
              className={styles.flag}
            />
          ) : (
            <div className={styles.flagPlaceholder}>
              <span className={styles.flagIcon}>🏴</span>
              <span className={styles.flagText}>No flag available</span>
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.countryName}>{country.name.common}</h1>
          <p className={styles.officialName}>{country.name.official}</p>

          <div className={styles.detailsGrid}>
            <div className={styles.detailGroup}>
              <h3 className={styles.groupTitle}>General Information</h3>
              <div className={styles.detail}>
                <span className={styles.label}>Population:</span>
                <span className={styles.value}>
                  {formatPopulation(country.population)}
                </span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Region:</span>
                <span className={styles.value}>{country.region || "N/A"}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Sub Region:</span>
                <span className={styles.value}>
                  {country.subregion || "N/A"}
                </span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Capital:</span>
                <span className={styles.value}>
                  {country.capital?.join(", ") || "N/A"}
                </span>
              </div>
            </div>

            <div className={styles.detailGroup}>
              <h3 className={styles.groupTitle}>Cultural Information</h3>
              <div className={styles.detail}>
                <span className={styles.label}>Languages:</span>
                <span className={styles.value}>
                  {formatLanguages(country.languages)}
                </span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Currencies:</span>
                <span className={styles.value}>
                  {formatCurrencies(country.currencies)}
                </span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Timezones:</span>
                <span className={styles.value}>
                  {country.timezones?.join(", ") || "N/A"}
                </span>
              </div>
              {country.borders && country.borders.length > 0 && (
                <div className={styles.detail}>
                  <span className={styles.label}>Border Countries:</span>
                  <span className={styles.value}>
                    {country.borders.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
