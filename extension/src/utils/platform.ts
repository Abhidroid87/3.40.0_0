export const getPlatform = (hostname: string): 'youtube' | 'shopping' | 'default' => {
  if (hostname.includes('youtube.com')) {
    return 'youtube';
  }
  
  // Add common shopping sites
  const shoppingSites = [
    'amazon.com',
    'ebay.com',
    'walmart.com',
    'shopify.com',
    'aliexpress.com'
  ];
  
  if (shoppingSites.some(site => hostname.includes(site))) {
    return 'shopping';
  }
  
  return 'default';
};