// src/services/ImageCompressionService.js

/**
 * Service for compressing images before sending to the API
 */
class ImageCompressionService {
  /**
   * Compresses an image file to reduce its size
   * @param {File} file - Original image file
   * @param {Object} options - Compression options
   * @param {Number} options.maxWidth - Maximum width in pixels
   * @param {Number} options.maxHeight - Maximum height in pixels
   * @param {Number} options.quality - JPEG quality (0-1)
   * @returns {Promise<Blob>} - Compressed image as a blob
   */
  async compressImage(file, options = {}) {
    const { 
      maxWidth = 1200, 
      maxHeight = 1200, 
      quality = 0.7 
    } = options;

    return new Promise((resolve, reject) => {
      // Create a FileReader to read the file
      const reader = new FileReader();
      
      // Set up the onload callback
      reader.onload = (event) => {
        // Create an image element
        const img = new Image();
        
        // Set up image onload callback
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
          
          // Create a canvas element
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          // Draw the image on the canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert the canvas to a blob
          canvas.toBlob((blob) => {
            if (blob) {
              // Create a new file from the blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          }, 'image/jpeg', quality);
        };
        
        // Handle image loading errors
        img.onerror = () => {
          reject(new Error('Failed to load image for compression'));
        };
        
        // Set the image source from the FileReader result
        img.src = event.target.result;
      };
      
      // Handle FileReader errors
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      
      // Read the file as a data URL
      reader.readAsDataURL(file);
    });
  }

  /**
   * Checks if an image needs compression based on size
   * @param {File} file - Original image file
   * @param {Number} thresholdMB - Size threshold in MB
   * @returns {Boolean} - Whether image needs compression
   */
  needsCompression(file, thresholdMB = 1) {
    const thresholdBytes = thresholdMB * 1024 * 1024;
    return file.size > thresholdBytes;
  }
}

export default new ImageCompressionService();