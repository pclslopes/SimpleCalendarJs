const fs = require('fs');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

async function build() {
  const distDir = './dist';
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Minify JavaScript
  const jsSource = fs.readFileSync('./js/simple-calendar-js.js', 'utf8');
  const jsResult = await minify(jsSource, {
    compress: {
      dead_code: true,
      drop_console: true,
      drop_debugger: true
    },
    mangle: { toplevel: true },
    format: { 
      comments: function(node, comment) {
        // Keep header comments (/** ... */)
        return comment.type === 'comment2' && comment.value.includes('SimpleCalendarJs v');
      }
    }
  });
  fs.writeFileSync('./dist/simple-calendar-js.min.js', jsResult.code);
  console.log('✓ JS minified');
  
  // Minify CSS
  const cssSource = fs.readFileSync('./css/simple-calendar-js.css', 'utf8');
  
  // Extract header comment manually
  const cssHeaderMatch = cssSource.match(/^(\/\*[\s\S]*?\*\/)/);
  const cssHeader = cssHeaderMatch ? cssHeaderMatch[1] + '\n' : '';
  
  const cssResult = new CleanCSS({}).minify(cssSource);
  const minifiedCSS = cssHeader + cssResult.styles;
  fs.writeFileSync('./dist/simple-calendar-js.min.css', minifiedCSS);
  console.log('✓ CSS minified');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});