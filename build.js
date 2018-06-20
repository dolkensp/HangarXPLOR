var fs = require('fs');
var path = require('path');
var JSZip = require('jszip');

var support = [ 'chrome', 'firefox', 'edge' ];

var manifest_master = JSON.parse(fs.readFileSync('src/manifest.json', 'utf8'));

manifest_master.version = process.argv[2];

support.forEach((browser, index) => {
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
      zip.file(filePath.substr(4), fs.readFileSync(filePath, 'binary'), { binary: true });
    }
  }
  
  addFiles('src');
  
  // TODO: Copy Files In
  
  zip.generateNodeStream({ type:'nodebuffer', compression: 'DEFLATE', streamFiles:true }).pipe(fs.createWriteStream('dist/' + manifest.short_name + '-' + browser + '-v' + manifest.version + '.zip'))
});
