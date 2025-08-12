<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** Database username */
define( 'DB_USER', 'wpuser' );

/** Database password */
define( 'DB_PASSWORD', 'wppassword' );

/** Database hostname */
define( 'DB_HOST', 'mysql:3306' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'DKJvzE:0xJjdmK<Al6?b<={$l)TXn8hz7xHJ?-9*x7<Q<R~Xn=Z_U2e?&F<Bjp1#' );
define( 'SECURE_AUTH_KEY',  'R0GPi5i-59};MKo!1e&y|8l$RlE(qNSCB_~|wW#A*wBCgE^p.q9nkxQ+V39d_ t~' );
define( 'LOGGED_IN_KEY',    'G[(tJ#?4/D~dViTapI8c4~xa2:ha?}T#gG#~au<El}k!9Vb/#*78(EYF5+Zwp|sn' );
define( 'NONCE_KEY',        'YrWS$6phj]*hJak}t?zd@6u:>xw)x>PMIf1QS.U`s$e1O][poV(@v[3l.6M^YN >' );
define( 'AUTH_SALT',        'x)8nK7.:#v};J_0cuC9fcP<p,I*PjszmrIjm.Gxq@im::)uwkri9iX0(?V{d[hdq' );
define( 'SECURE_AUTH_SALT', '@`!N|>1b%8s2$Ab;md8w}~~Q!6f{| s.W^)z|f}}dn&VRW6gGRw}|SG,wadxya~^' );
define( 'LOGGED_IN_SALT',   '^&s?sU2t7Qg[M34w#8Oieae,_.>KROOj@@B4;<].<$0.)fB|jGGja|rQlGM8r[vh' );
define( 'NONCE_SALT',       '}X_zaY-A.=iF9T2##@?8<8?%Q!G-v;-zjzav8_.D&O^Cp5LD(bQeS9 V2y{^v=vH' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
