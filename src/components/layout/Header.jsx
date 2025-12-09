import React from "react";
import styles from "../../styles/Header.module.css"; // Import as module

export default function Header({ title, subtitle, actionButtonText, onActionClick, showSuperAdminBadge = false }) {
    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerContent}>
                {/* Left side: Title, Subtitle, and Super Admin Badge */}
                <div className={styles.headerLeft}>
                    <div className={styles.headerTitleSection}>
                        <h1 className={styles.headerTitle}>{title}</h1>
                        {showSuperAdminBadge && (
                            <div className={styles.superAdminBadge}>
                                <span className={styles.superAdminIcon}>👑</span>
                                SUPER ADMIN
                            </div>
                        )}
                    </div>
                    {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
                </div>

                {/* Right side: Optional Action Button */}
                {actionButtonText && onActionClick && (
                    <div className={styles.headerRight}>
                        <button className={`${styles.primaryBtn} ${styles.addBtn}`} onClick={onActionClick}>
                            {actionButtonText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
