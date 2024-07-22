
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const SHELL: string;
	export const SESSION_MANAGER: string;
	export const NVM_RC_VERSION: string;
	export const COLORTERM: string;
	export const SDK_HOME: string;
	export const XDG_CONFIG_DIRS: string;
	export const LESS: string;
	export const XDG_SESSION_PATH: string;
	export const XDG_MENU_PREFIX: string;
	export const TERM_PROGRAM_VERSION: string;
	export const JDK_HOME: string;
	export const MACHTYPE: string;
	export const G_BROKEN_FILENAMES: string;
	export const HOSTNAME: string;
	export const HISTSIZE: string;
	export const ICEAUTHORITY: string;
	export const FROM_HEADER: string;
	export const MINICOM: string;
	export const NODE: string;
	export const WEZTERM_CONFIG_DIR: string;
	export const JAVA_HOME: string;
	export const AUDIODRIVER: string;
	export const GUESTFISH_OUTPUT: string;
	export const JRE_HOME: string;
	export const CPU: string;
	export const JAVA_BINDIR: string;
	export const npm_config_local_prefix: string;
	export const WEZTERM_EXECUTABLE: string;
	export const DESKTOP_SESSION: string;
	export const GTK_RC_FILES: string;
	export const GPG_TTY: string;
	export const XDG_SEAT: string;
	export const PWD: string;
	export const QEMU_AUDIO_DRV: string;
	export const XDG_SESSION_DESKTOP: string;
	export const LOGNAME: string;
	export const XDG_SESSION_TYPE: string;
	export const MANPATH: string;
	export const SYSTEMD_EXEC_PID: string;
	export const XAUTHORITY: string;
	export const GUESTFISH_RESTORE: string;
	export const XKEYSYMDB: string;
	export const XKB_DEFAULT_MODEL: string;
	export const GTK2_RC_FILES: string;
	export const XNLSPATH: string;
	export const HOME: string;
	export const LANG: string;
	export const WEZTERM_UNIX_SOCKET: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const npm_package_version: string;
	export const PYTHONSTARTUP: string;
	export const STARSHIP_SHELL: string;
	export const WAYLAND_DISPLAY: string;
	export const OSTYPE: string;
	export const GUESTFISH_PS1: string;
	export const XDG_SEAT_PATH: string;
	export const LESS_ADVANCED_PREPROCESSOR: string;
	export const INVOCATION_ID: string;
	export const MANAGERPID: string;
	export const STARSHIP_SESSION_KEY: string;
	export const KDE_SESSION_UID: string;
	export const MOZ_GMP_PATH: string;
	export const NVM_DIR: string;
	export const XKB_DEFAULT_LAYOUT: string;
	export const XDG_ACTIVATION_TOKEN: string;
	export const LESSCLOSE: string;
	export const XDG_SESSION_CLASS: string;
	export const PYTHONPATH: string;
	export const TERM: string;
	export const npm_package_name: string;
	export const G_FILENAME_ENCODING: string;
	export const HOST: string;
	export const XAUTHLOCALHOSTNAME: string;
	export const LESSOPEN: string;
	export const USER: string;
	export const QT_WAYLAND_RECONNECT: string;
	export const KDE_SESSION_VERSION: string;
	export const PAM_KWALLET5_LOGIN: string;
	export const MORE: string;
	export const CSHEDIT: string;
	export const DISPLAY: string;
	export const npm_lifecycle_event: string;
	export const SHLVL: string;
	export const NVM_CD_FLAGS: string;
	export const WINDOWMANAGER: string;
	export const PAGER: string;
	export const GUESTFISH_INIT: string;
	export const XDG_VTNR: string;
	export const STM32CubeMX_PATH: string;
	export const XDG_SESSION_ID: string;
	export const npm_config_user_agent: string;
	export const npm_execpath: string;
	export const WEZTERM_CONFIG_FILE: string;
	export const XDG_RUNTIME_DIR: string;
	export const DEBUGINFOD_URLS: string;
	export const npm_package_json: string;
	export const QT_AUTO_SCREEN_SCALE_FACTOR: string;
	export const JOURNAL_STREAM: string;
	export const MANPATHISSET: string;
	export const XDG_DATA_DIRS: string;
	export const KDE_FULL_SESSION: string;
	export const VENDOR: string;
	export const CONFIG_SITE: string;
	export const PATH: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const PROFILEREAD: string;
	export const KDE_APPLICATIONS_AS_SCOPE: string;
	export const MAIL: string;
	export const HOSTTYPE: string;
	export const XKB_DEFAULT_OPTIONS: string;
	export const npm_node_execpath: string;
	export const LESSKEY: string;
	export const WEZTERM_PANE: string;
	export const TERM_PROGRAM: string;
	export const WEZTERM_EXECUTABLE_DIR: string;
	export const _: string;
	export const NODE_VERSION: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		SHELL: string;
		SESSION_MANAGER: string;
		NVM_RC_VERSION: string;
		COLORTERM: string;
		SDK_HOME: string;
		XDG_CONFIG_DIRS: string;
		LESS: string;
		XDG_SESSION_PATH: string;
		XDG_MENU_PREFIX: string;
		TERM_PROGRAM_VERSION: string;
		JDK_HOME: string;
		MACHTYPE: string;
		G_BROKEN_FILENAMES: string;
		HOSTNAME: string;
		HISTSIZE: string;
		ICEAUTHORITY: string;
		FROM_HEADER: string;
		MINICOM: string;
		NODE: string;
		WEZTERM_CONFIG_DIR: string;
		JAVA_HOME: string;
		AUDIODRIVER: string;
		GUESTFISH_OUTPUT: string;
		JRE_HOME: string;
		CPU: string;
		JAVA_BINDIR: string;
		npm_config_local_prefix: string;
		WEZTERM_EXECUTABLE: string;
		DESKTOP_SESSION: string;
		GTK_RC_FILES: string;
		GPG_TTY: string;
		XDG_SEAT: string;
		PWD: string;
		QEMU_AUDIO_DRV: string;
		XDG_SESSION_DESKTOP: string;
		LOGNAME: string;
		XDG_SESSION_TYPE: string;
		MANPATH: string;
		SYSTEMD_EXEC_PID: string;
		XAUTHORITY: string;
		GUESTFISH_RESTORE: string;
		XKEYSYMDB: string;
		XKB_DEFAULT_MODEL: string;
		GTK2_RC_FILES: string;
		XNLSPATH: string;
		HOME: string;
		LANG: string;
		WEZTERM_UNIX_SOCKET: string;
		XDG_CURRENT_DESKTOP: string;
		npm_package_version: string;
		PYTHONSTARTUP: string;
		STARSHIP_SHELL: string;
		WAYLAND_DISPLAY: string;
		OSTYPE: string;
		GUESTFISH_PS1: string;
		XDG_SEAT_PATH: string;
		LESS_ADVANCED_PREPROCESSOR: string;
		INVOCATION_ID: string;
		MANAGERPID: string;
		STARSHIP_SESSION_KEY: string;
		KDE_SESSION_UID: string;
		MOZ_GMP_PATH: string;
		NVM_DIR: string;
		XKB_DEFAULT_LAYOUT: string;
		XDG_ACTIVATION_TOKEN: string;
		LESSCLOSE: string;
		XDG_SESSION_CLASS: string;
		PYTHONPATH: string;
		TERM: string;
		npm_package_name: string;
		G_FILENAME_ENCODING: string;
		HOST: string;
		XAUTHLOCALHOSTNAME: string;
		LESSOPEN: string;
		USER: string;
		QT_WAYLAND_RECONNECT: string;
		KDE_SESSION_VERSION: string;
		PAM_KWALLET5_LOGIN: string;
		MORE: string;
		CSHEDIT: string;
		DISPLAY: string;
		npm_lifecycle_event: string;
		SHLVL: string;
		NVM_CD_FLAGS: string;
		WINDOWMANAGER: string;
		PAGER: string;
		GUESTFISH_INIT: string;
		XDG_VTNR: string;
		STM32CubeMX_PATH: string;
		XDG_SESSION_ID: string;
		npm_config_user_agent: string;
		npm_execpath: string;
		WEZTERM_CONFIG_FILE: string;
		XDG_RUNTIME_DIR: string;
		DEBUGINFOD_URLS: string;
		npm_package_json: string;
		QT_AUTO_SCREEN_SCALE_FACTOR: string;
		JOURNAL_STREAM: string;
		MANPATHISSET: string;
		XDG_DATA_DIRS: string;
		KDE_FULL_SESSION: string;
		VENDOR: string;
		CONFIG_SITE: string;
		PATH: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		PROFILEREAD: string;
		KDE_APPLICATIONS_AS_SCOPE: string;
		MAIL: string;
		HOSTTYPE: string;
		XKB_DEFAULT_OPTIONS: string;
		npm_node_execpath: string;
		LESSKEY: string;
		WEZTERM_PANE: string;
		TERM_PROGRAM: string;
		WEZTERM_EXECUTABLE_DIR: string;
		_: string;
		NODE_VERSION: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
