# Overview
Provides mock *clients*, *instruments* and *actions* search results to Global Search component in Glue42.

When a search result is clicked in Global Search an interop method registered by this app is invoked.

See console (F12) for detailed log.

# How to run

1. Host the app somewhere (e.g. use local http server like live-server from npm)
1. Edit *app-definition.json* and update the URL
1. Paste the *app-definition.json* to your local store (usually %LOCALAPPDATA%\Tick42\GlueDesktop\config\apps folder)
1. Restart Glue42
1. Search in Glue42 Global Search, e.g. by typing *AAPL*

# Details

For the simplicity of the example data is fetched from local JSON files (stored data folder).

On startup an interop method is registered (**T42.Search.Provider**) - it will be called by Global Search for each search query. 





