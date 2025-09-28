interface ProductDetails {
  title?: string;
  price?: string;
  description?: string;
  images?: string[];
  specs?: Record<string, string>;
}

export const extractProductDetails = (): ProductDetails => {
  // Common selectors for different e-commerce platforms
  const selectors = {
    amazon: {
      title: '#productTitle',
      price: '.a-price-whole',
      description: '#productDescription',
      images: '#imgTagWrapperId img',
    },
    ebay: {
      title: '.x-item-title',
      price: '.x-price-primary',
      description: '.x-item-description',
      images: '.ux-image-carousel-item img',
    },
    // Add more platforms as needed
  };

  const platform = getPlatform(window.location.hostname);
  const currentSelectors = platform === 'shopping' ? selectors[getSpecificPlatform()] : null;

  if (!currentSelectors) return {};

  const details: ProductDetails = {};
  
  // Extract text content if element exists
  const getContent = (selector: string) => {
    const element = document.querySelector(selector);
    return element?.textContent?.trim();
  };

  // Extract multiple image URLs
  const getImages = (selector: string) => {
    const images = document.querySelectorAll(selector);
    return Array.from(images).map(img => (img as HTMLImageElement).src);
  };

  // Extract specifications from common patterns
  const extractSpecs = () => {
    const specs: Record<string, string> = {};
    const specTables = document.querySelectorAll('table[class*="spec"], table[class*="detail"]');
    
    specTables.forEach(table => {
      table.querySelectorAll('tr').forEach(row => {
        const [key, value] = Array.from(row.children).map(cell => cell.textContent?.trim());
        if (key && value) specs[key] = value;
      });
    });

    return specs;
  };

  // Populate details object
  if (currentSelectors.title) details.title = getContent(currentSelectors.title);
  if (currentSelectors.price) details.price = getContent(currentSelectors.price);
  if (currentSelectors.description) details.description = getContent(currentSelectors.description);
  if (currentSelectors.images) details.images = getImages(currentSelectors.images);
  
  details.specs = extractSpecs();

  return details;
};

const getSpecificPlatform = (): 'amazon' | 'ebay' => {
  const hostname = window.location.hostname;
  if (hostname.includes('amazon')) return 'amazon';
  if (hostname.includes('ebay')) return 'ebay';
  return 'amazon'; // Default to amazon selectors
};