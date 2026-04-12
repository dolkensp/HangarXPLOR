var fs = require('fs');
var path = require('path');
var JSZip = require('jszip');

var support = [ 'chrome', 'firefox', 'edge' ];

var manifest_master = JSON.parse(fs.readFileSync('src/manifest.core.json', 'utf8'));

manifest_master.version = process.argv[2];

support.forEach((browser) => {
  var zip = new JSZip();
  
  if (!fs.existsSync('dist')) fs.mkdirSync('dist');
  
  var manifest = manifest_master;
  
  if (fs.existsSync('src/manifest.' + browser + '.json', 'utf8')) {
    var manifest_browser = JSON.parse(fs.readFileSync('src/manifest.' + browser + '.json', 'utf8'));
    manifest = { ...manifest, ...manifest_browser };
  }
  
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  
  var addFiles = function(filePath) {
    var checkPath = path.basename(filePath.toLowerCase());
    
    if (checkPath == 'debug') return;
    if (checkPath == 'screenshots') return;
    if (checkPath.startsWith('manifest.') && checkPath.endsWith('.json')) return;
    
    if (fs.lstatSync(filePath).isDirectory()) {
      files = fs.readdirSync(filePath);
      files.forEach(function(file) { addFiles(path.join(filePath, file)) });
    } else {
      zip.file(filePath.substr(4).replace(/\\/g, '/'), fs.readFileSync(filePath, 'binary'), { binary: true });
    }
  }
  
  addFiles('src');
  
  // Always use STORE compression method
  zip.generateAsync({ type: 'nodebuffer', compression: 'STORE' })
     .then(function(content) {
       fs.writeFileSync('dist/' + manifest.short_name + '-' + browser + '-v' + manifest.version + '.zip', content);
     });
});

// Safari requires a directory (not a zip) for xcrun safari-web-extension-converter
(function() {
  var browser = 'safari';

  if (!fs.existsSync('dist')) fs.mkdirSync('dist');

  var manifest = JSON.parse(JSON.stringify(manifest_master));

  if (fs.existsSync('src/manifest.' + browser + '.json')) {
    var manifest_browser = JSON.parse(fs.readFileSync('src/manifest.' + browser + '.json', 'utf8'));
    manifest = { ...manifest, ...manifest_browser };
  }

  var outDir = 'dist/' + manifest.short_name + '-' + browser + '-v' + manifest.version;

  var copyFiles = function(filePath) {
    var checkPath = path.basename(filePath.toLowerCase());

    if (checkPath == 'debug') return;
    if (checkPath == 'screenshots') return;
    if (checkPath.startsWith('manifest.') && checkPath.endsWith('.json')) return;

    if (fs.lstatSync(filePath).isDirectory()) {
      var destDir = outDir + '/' + filePath.substr(4);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      fs.readdirSync(filePath).forEach(function(file) { copyFiles(path.join(filePath, file)); });
    } else {
      var destFile = outDir + '/' + filePath.substr(4);
      var destFileDir = path.dirname(destFile);
      if (!fs.existsSync(destFileDir)) fs.mkdirSync(destFileDir, { recursive: true });
      fs.copyFileSync(filePath, destFile);
    }
  };

  if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true });
  fs.mkdirSync(outDir, { recursive: true });

  copyFiles('src');

  fs.writeFileSync(outDir + '/manifest.json', JSON.stringify(manifest, null, 2));

  console.log('Safari extension directory created: ' + outDir);
  console.log('To convert for Safari, run:');
  console.log('  xcrun safari-web-extension-converter ' + outDir + ' --project-location dist --app-name HangarXPLOR-Safari --bundle-identifier com.hangarxplor.safari');
})();
