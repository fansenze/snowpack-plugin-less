# snowpack-plugin-less
Use the [Less](https://github.com/less/less.js) compiler to build `.less` files from source

## Usage

### Install
```bash
npm install --save-dev snowpack-plugin-less
```

### Config
add this plugin to your Snowpack config:  

**snowpack.config.json**
```json
{
  "plugins": [
    "snowpack-plugin-less"
  ]
}
```

### Use Custom Less Compile Options
**snowpack.config.js**
```javascript
const path = require("path");

module.exports = {
  // ...another config
  "plugins": [
    [
      "snowpack-plugin-less",
      { /* less render options */ }
    ]
  ]
}
```
