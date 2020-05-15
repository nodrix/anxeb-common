# Nodrix Anxeb Common Tool Kit

**Setting Up**

- Go to your source root directory
- Clone submodule by executing `git submodule add https://github.com/nodrix/anxeb-common.git common`
- Go to newly created `common/` submodule end execute `npm install`
- After all scripts completes its execution, go to folder: `static/vendors/v-calendar/`
- Replace code `componentPrefix: 'v'` by `componentPrefix: 'vc'` on file `v-calendar.umd.js` line 7185
- Repeat process again if you reinstall npm modules.

**Notes**

- You can change packages scripts to customize vendors directory.
- You can change root directory before cloning submodule