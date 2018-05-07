const fs = require('fs');
const path = require('path'); 

function getAngularType(parsed) {
  const angularCoreImports = parsed.imports.find(el => el.from === '@angular/core');
  
  if (angularCoreImports) {
    return angularCoreImports.specifiers.includes('Component') ? 'Component': 
      angularCoreImports.specifiers.includes('Directive') ? 'Directive': 
      angularCoreImports.specifiers.includes('Injectable') ? 'Injectable': 
      angularCoreImports.specifiers.includes('Pipe') ? 'Pipe': undefined;
  }
}

function getEjsTemplate(type) {
  let ejsFile; 
  switch(type) {
    case 'Component': 
    case 'Directive': 
    case 'Pipe': 
    case 'Injectable': 
      const typeLower = type.toLowerCase();
      ejsFile = path.join(__dirname, '../', 'templates', `${typeLower}.spec.ts.ejs`);
      break;
    default:
      ejsFile = path.join(__dirname, '../', 'templates', `default.spec.ts.ejs`);
      break;
  }

  return fs.readFileSync(ejsFile, 'utf8');
}

function getImportLib(mports, className) {
  let lib;
  mports.forEach(mport => {
    mport.specifiers.forEach(el => { // e.g. 'Inject', 'Inject as foo'
      if (el.indexOf(className) !== -1) {
        lib = mport.from; // e.g. '@angular/core'
      }
    });
  });

  return lib;
}

function reIndent(str, prefix="") {
  let toRepl = str.match(/^\n\s+/)[0];
  let regExp = new RegExp(toRepl, 'gm');
  return str.replace(regExp, "\n" + prefix);
}

module.exports = {
  getAngularType,
  getEjsTemplate,
  getImportLib,
  reIndent
};