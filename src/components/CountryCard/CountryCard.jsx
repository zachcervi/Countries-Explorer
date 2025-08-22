import styles from "./CountryCard.module.css";

export function CountryCard({ country, onClick, ...props }) {
  const formatPopulation = (population) => {
    return population?.toLocaleString() || "N/A";
  };

  const getCapitalText = (capital) => {
    if (!capital || capital.length === 0) return "N/A";
    return capital.join(", ");
  };

  const getFlagUrl = (flags) => {
    if (!flags) return null;
    // Prefer SVG for crisp display, fallback to PNG
    return flags.svg || flags.png || null;
  };

  const getFlagAlt = (flags, countryName) => {
    if (!flags) return `Flag of ${countryName}`;
    return flags.alt || `Flag of ${countryName}`;
  };

  const handleClick = () => {
    onClick?.(country);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleImageError = (e) => {
    const img = e.target;
    const placeholder = img.nextElementSibling;

    // If SVG failed, try PNG as fallback
    if (img.src.includes(".svg") && country?.flags?.png) {
      img.src = country.flags.png;
      return;
    }

    // If both failed, show placeholder
    img.style.display = "none";
    if (placeholder) {
      placeholder.style.display = "flex";
    }
  };

  const flagUrl = getFlagUrl(country?.flags);
  const countryName = country?.name?.common || "Unknown Country";

  return (
    <article
      {...props}
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${countryName}`}
    >
      <div className={styles.flagContainer}>
        {flagUrl ? (
          <img
            src={flagUrl}
            alt={getFlagAlt(country?.flags, countryName)}
            className={styles.flag}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
            // Add sizes attribute for responsive images
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px"
          />
        ) : null}
        <div
          className={styles.flagPlaceholder}
          style={{ display: flagUrl ? "none" : "flex" }}
        >
          <span className={styles.flagIcon}>🏴</span>
          <span className={styles.flagText}>No flag available</span>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.countryName}>{countryName}</h3>

        <div className={styles.details}>
          <div className={styles.detail}>
            <span className={styles.label}>Population:</span>
            <span className={styles.value}>
              {formatPopulation(country?.population)}
            </span>
          </div>

          <div className={styles.detail}>
            <span className={styles.label}>Region:</span>
            <span className={styles.value}>{country?.region || "N/A"}</span>
          </div>

          <div className={styles.detail}>
            <span className={styles.label}>Capital:</span>
            <span className={styles.value}>
              {getCapitalText(country?.capital)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
