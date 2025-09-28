import React, { useEffect, useState } from 'react';
import { extractProductDetails } from '../../utils/productExtractor';
import { FiRefreshCcw } from 'react-icons/fi';

interface ProductDetails {
  title?: string;
  price?: string;
  description?: string;
  images?: string[];
  specs?: Record<string, string>;
}

interface ShoppingTabProps {
  generateRecommendations: (context: any) => Promise<string>;
}

export const ShoppingTab: React.FC<ShoppingTabProps> = ({ generateRecommendations }) => {
  const [productDetails, setProductDetails] = useState<ProductDetails>({});
  const [recommendations, setRecommendations] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    extractAndAnalyzeProduct();
  }, []);

  const extractAndAnalyzeProduct = async () => {
    setLoading(true);
    const details = extractProductDetails();
    setProductDetails(details);

    try {
      const recs = await generateRecommendations({
        type: 'product',
        details
      });
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Details</h3>
        <button
          onClick={extractAndAnalyzeProduct}
          className="text-blue-500 hover:text-blue-600"
        >
          <FiRefreshCcw size={20} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <>
          {productDetails.title && (
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium mb-2">{productDetails.title}</h4>
              {productDetails.price && (
                <p className="text-lg text-green-600 dark:text-green-400 font-bold">
                  {productDetails.price}
                </p>
              )}
              {productDetails.description && (
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                  {productDetails.description}
                </p>
              )}
            </div>
          )}

          {recommendations && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <h4 className="font-medium mb-2">AI Recommendations</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {recommendations}
              </p>
            </div>
          )}

          {productDetails.specs && Object.keys(productDetails.specs).length > 0 && (
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium mb-2">Specifications</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(productDetails.specs).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};