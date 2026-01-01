// JavaScript to Clear All LocalStorage Data
// Run this in your browser console (F12) to clear all localStorage data

// Clear all portfolio-related localStorage items
const keysToRemove = [
  'website-projects',
  'website-blog-posts',
  'website-services',
  'website-themes',
  'website-plugins',
  'website-about',
  'website-hero',
  'website-footer',
  'website-contact'
];

console.log('Clearing localStorage...');

keysToRemove.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✓ Removed: ${key}`);
  } else {
    console.log(`- Not found: ${key}`);
  }
});

// Clear all other localStorage items (optional - be careful!)
// Uncomment the line below if you want to clear EVERYTHING
// localStorage.clear();

console.log('LocalStorage cleanup complete!');
console.log('Remaining items:', Object.keys(localStorage));

